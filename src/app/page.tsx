'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    const timer = setTimeout(handleLoad, 1000); 

    const handleOrientationChange = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    handleOrientationChange(); // Initial check
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  const totalPages = 16;

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

  const pageImage = `/Page${page}.png`;

  if (loading) {
    return <div className={styles.loadingScreen}></div>;
  }

  return (
    <div className={styles.container}>
      {page > 1 && (
        <button onClick={handlePrevious} className={`${styles.navButton} ${styles.left}`}>
          &lt;
        </button>
      )}
      <div className={styles.pageContainer}>
        <Image src={pageImage} alt={`Page ${page}`} width={1000} height={750} className={styles.pageImage} priority />
      </div>
      {page < totalPages && (
        <button onClick={handleNext} className={`${styles.navButton} ${styles.right}`}>
          &gt;
        </button>
      )}
    </div>
  );
}