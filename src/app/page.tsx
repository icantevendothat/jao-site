'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from 'next-sanity';
import styles from './page.module.css';
import './globals.css';

// 1. Initialize Sanity Client using Environment Variables
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

// 2. Define the GROQ Query
const PROJECT_QUERY = `*[_type == "project"] | order(order asc) {
  title,
  "imageUrl": mainImage.asset->url,
  isProtected,
  "id": _id
}`;

// 3. Define the TypeScript Interface for your data
interface Project {
  id: string;
  title: string;
  imageUrl: string;
  isProtected?: boolean;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await client.fetch(PROJECT_QUERY);
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        // Trigger the fade out and loading screen removal
        setFadeOut(true);
        setTimeout(() => setLoading(false), 1000);
      }
    }
    
    fetchProjects();

    const handleOrientationChange = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    handleOrientationChange(); 
    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  // Navigation Logic
  const handleNext = () => {
    if (projects.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrevious = () => {
    if (projects.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const jumpToCover = () => setActiveIndex(0);

  // Safety check for dynamic background
  const currentProject = projects[activeIndex];
  const currentBg = currentProject?.imageUrl || "/test.png";

  return (
    <>
      {/* Loading Screen logic from your module.css */}
      {(loading || projects.length === 0) && (
        <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}></div>
      )}

      {/* Dynamic Background Image from Sanity */}
      <div className={styles.fullscreenBg}>
        {projects.length > 0 && (
          <Image 
            src={currentBg} 
            alt={currentProject?.title || "Background"} 
            fill
            priority 
            className={styles.bgImage}
          />
        )}
      </div>

      {!isPortrait ? (
        <div className={styles.container}>
          
          <div className={styles.infoPanelTop}>
            <h1 className={styles.infoHeading1Top} onClick={jumpToCover}>
                JUSTIN O&apos;LEARY
            </h1>
          </div>
          
          <div className={styles.navButtonStack}>
              <button onClick={handlePrevious} className={styles.navButton}>&lt;</button>
              <button onClick={handleNext} className={styles.navButton}>&gt;</button>
          </div>

          <div className={styles.infoPanelBottom}>
            {projects.map((project, index) => (
              <h2 
                key={project.id} 
                className={`${styles.infoHeading2} ${activeIndex === index ? styles.selected : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                {project.title}
              </h2>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.rotateMessage}>ROTATE SCREEN FOR BEST EXPERIENCE</div>
      )}
    </>
  );
}