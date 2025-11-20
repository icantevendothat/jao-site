'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import './globals.css';

export default function Home() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 1000);
    };
    
    const timer = setTimeout(handleLoad, 1000); 

    const handleOrientationChange = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    handleOrientationChange(); 
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  const totalPages = 27; 
  
  // Define project ranges: Start page and the page before the next project begins.
  // The 'rangeEnd' is the last page of that project's section.
  const projectNav = [
    // Project 1: Pages 8-13
    { title: "TELFAR - 20th ANNIVERSARY", page: 8, rangeEnd: 13 },
    // Project 2: Pages 14-16
    { title: "GRACE LING", page: 14, rangeEnd: 16 },
    // Project 3: Pages 17-20
    { title: "GRAND NATIONAL TOUR", page: 17, rangeEnd: 20 },
    // Project 4: Pages 21-25
    { title: "TELFAR - DESIGN DEVELOPMENT", page: 21, rangeEnd: 25 },
    // Project 5: Pages 26-27 (Assumes page 27 is the last page of this project/site)
    { title: "STRAY RATS", page: 26, rangeEnd: totalPages }, 
  ];
  
  const navPages = projectNav.map(p => p.page); 

  // Function to determine if the current page falls within a project's range
  const isProjectActive = (startPage: number, endPage: number) => {
    // Also consider pages before the first project (1-7) as inactive for all projects
    if (page < projectNav[0].page && startPage === projectNav[0].page) {
        return false;
    }
    return page >= startPage && page <= endPage;
  };

  const handleNext = () => {
    setPage((prevPage) => (prevPage === totalPages ? 1 : prevPage + 1));
  };

  const handlePrevious = () => {
    setPage((prevPage) => (prevPage === 1 ? totalPages : prevPage - 1));
  };

  const jumpToPage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const jumpToCover = () => {
    setPage(1);
  };

  const pageImage = `/${page}.webp`;

  return (
    <>
      {loading && (
        <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}></div>
      )}
      {!isPortrait ? (
        <div className={styles.container}>
          {/* Always display the left navigation button */}
          <button onClick={handlePrevious} className={`${styles.navButton} ${styles.left}`}>
            &lt;
          </button>

          <div className={styles.pageContainer}>
            <Image 
              src={pageImage} 
              alt={`Page ${page}`} 
              width={1200} 
              height={750} 
              className={styles.pageImage} 
              priority 
            />
          </div>
          
          {/* Always display the right navigation button */}
          <button onClick={handleNext} className={`${styles.navButton} ${styles.right}`}>
            &gt;
          </button>

          <div className={styles.navPanel}>
            {navPages.map((pageNumber, index) => (
              <div 
                key={index} 
                className={styles.navLink} 
                onClick={() => jumpToPage(pageNumber)}>
              </div>
            ))}
          </div>

          {/* New Project Info Panel */}
          <div className={styles.infoPanel}>
          <h1 className={styles.infoHeading1} onClick={jumpToCover}>
            JUSTIN O&apos;LEARY
          </h1>
            
            {/* Map over the projectNav array to create clickable H2s */}
            {projectNav.map((project, index) => (
              <h2 
                key={index} 
                className={`${styles.infoHeading2} ${isProjectActive(project.page, project.rangeEnd) ? styles.selected : ''}`}
                onClick={() => jumpToPage(project.page)}
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