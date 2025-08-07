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

  const totalPages = 16;
  const navPages = [1, 8, 11, 13, 15]; 

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const jumpToPage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const pageImage = `/Page${page}.png`;

  return (
    <>
      {loading && (
        <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}></div>
      )}
      {!isPortrait ? (
        <div className={styles.container}>
          {page > 1 && (
            <button onClick={handlePrevious} className={`${styles.navButton} ${styles.left}`}>
              &lt;
            </button>
          )}
          <div className={styles.pageContainer}>
            <Image src={pageImage} alt={`Page ${page}`} width={1200} height={750} className={styles.pageImage} priority />
          </div>
          {page < totalPages && (
            <button onClick={handleNext} className={`${styles.navButton} ${styles.right}`}>
              &gt;
            </button>
          )}
          <div className={styles.navPanel}>
            {navPages.map((pageNumber, index) => (
              <div 
                key={index} 
                className={styles.navLink} 
                onClick={() => jumpToPage(pageNumber)}>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.rotateMessage}>ROTATE SCREEN FOR BEST EXPERIENCE</div>
      )}
    </>
  );
}