'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from 'next-sanity';
import styles from './page.module.css';
import './globals.css';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const PROJECT_QUERY = `*[_type == "project"] | order(order asc) {
  title,
  "images": images[].asset->url,
  isProtected,
  "id": _id
}`;

interface Project {
  id: string;
  title: string;
  images: string[];
  isProtected?: boolean;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectIndex, setProjectIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  
  // Password State
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await client.fetch(PROJECT_QUERY);
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
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

  const currentProject = projects[projectIndex];
  const needsPassword = currentProject?.isProtected && !isAuthorized;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "gnx2026") { 
      setIsAuthorized(true);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const handleNext = () => {
    if (needsPassword) return;
    if (imageIndex < currentProject.images.length - 1) {
      setImageIndex(imageIndex + 1);
    } else {
      const nextIdx = (projectIndex + 1) % projects.length;
      setProjectIndex(nextIdx);
      setImageIndex(0);
      setIsAuthorized(false); // Relock when moving to a new project
    }
  };

  const handlePrevious = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    } else {
      const prevIdx = projectIndex === 0 ? projects.length - 1 : projectIndex - 1;
      setProjectIndex(prevIdx);
      setImageIndex(projects[prevIdx].images.length - 1);
      setIsAuthorized(false); // Relock
    }
  };

  const jumpToCover = () => {
    setProjectIndex(0);
    setImageIndex(0);
    setIsAuthorized(false);
  };

  return (
    <>
      {(loading || projects.length === 0) && (
        <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}></div>
      )}

      <div className={styles.fullscreenBg}>
        {projects.length > 0 && !needsPassword && (
          <Image 
            src={currentProject?.images?.[imageIndex] || "/test.png"} 
            alt={currentProject?.title} 
            fill priority 
            className={styles.bgImage}
            key={currentProject?.images?.[imageIndex]}
          />
        )}
      </div>

      {!isPortrait ? (
        <div className={styles.container}>
          
          <div className={styles.infoPanelTop}>
            <h1 className={`${styles.infoHeading1Top} ${projectIndex === 0 ? styles.selected : ''}`} onClick={jumpToCover}>
                JUSTIN O&apos;LEARY
            </h1>
          </div>

          {/* Password Overlay */}
          {needsPassword && (
            <div className={styles.passwordOverlay}>
              <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
                <input 
                  type="password" 
                  placeholder="ENTER PASSCODE" 
                  className={styles.passwordInput}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className={styles.passwordSubmitButton}>SUBMIT</button>
                {showError && <p className={styles.authMessage}>INCORRECT PASSCODE</p>}
              </form>
            </div>
          )}
          
          <div className={styles.navButtonStack}>
              <button onClick={handlePrevious} className={styles.navButton}>&lt;</button>
              <button onClick={handleNext} className={styles.navButton}>&gt;</button>
          </div>

          <div className={styles.infoPanelBottom}>
            {projects.slice(1).map((project, index) => (
              <h2 
                key={project.id} 
                className={`${styles.infoHeading2} ${projectIndex === index + 1 ? styles.selected : ''}`}
                onClick={() => {
                  setProjectIndex(index + 1);
                  setImageIndex(0);
                  setIsAuthorized(false);
                }}
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