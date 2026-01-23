'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import './globals.css';

const GRAND_NATIONAL_START_PAGE = 17;

export default function Home() {
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

  const projectNav = [
    { title: "TELFAR - 20th ANNIVERSARY" },
    { title: "GRACE LING" },
    { title: "GRAND NATIONAL TOUR" }, 
    { title: "TELFAR - DESIGN DEVELOPMENT" }, 
    { title: "STRAY RATS" }, 
  ];

  // Logic "Neutered": Navigation functions now do nothing
  const handleNext = () => {};
  const handlePrevious = () => {};
  const jumpToPage = () => {};
  const jumpToCover = () => {};

  return (
    <>
      {loading && (
        <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}></div>
      )}

      {/* NEW: Fullscreen Background Image */}
      <div className={styles.fullscreenBg}>
        <Image 
          src="/test.png" 
          alt="Background" 
          fill
          priority 
          className={styles.bgImage}
        />
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

          {/* Old pageContainer removed from here to keep viewport clean */}

          <div className={styles.infoPanelBottom}>
            {projectNav.map((project, index) => (
              <h2 
                key={index} 
                className={styles.infoHeading2}
                onClick={() => jumpToPage()}
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

// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import styles from './page.module.css';
// import './globals.css';

// // --- CONSTANTS ---
// const GRAND_NATIONAL_START_PAGE = 17;
// const CORRECT_PASSWORD = 'butt';

// export default function Home() {
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [fadeOut, setFadeOut] = useState(false);
//   const [isPortrait, setIsPortrait] = useState(false);
  
//   // --- NEW AUTHENTICATION STATES ---
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [passwordInput, setPasswordInput] = useState('');
//   const [authMessage, setAuthMessage] = useState('');
//   // ------------------------------------

//   useEffect(() => {
//     // Check local storage for session authentication on mount
//     const savedAuth = localStorage.getItem('grandNationalAuth');
//     if (savedAuth === 'true') {
//       setIsAuthenticated(true);
//     }
    
//     // Original loading and orientation logic
//     const handleLoad = () => {
//       setFadeOut(true);
//       setTimeout(() => setLoading(false), 1000);
//     };
    
//     const timer = setTimeout(handleLoad, 1000); 

//     const handleOrientationChange = () => {
//       setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
//     };

//     handleOrientationChange(); 
//     window.addEventListener('resize', handleOrientationChange);

//     return () => {
//       clearTimeout(timer);
//       window.removeEventListener('resize', handleOrientationChange);
//     };
//   }, []);

//   const totalPages = 35; 
  
//   const projectNav = [
//     { title: "TELFAR - 20th ANNIVERSARY", page: 8, rangeEnd: 13 },
//     { title: "GRACE LING", page: 14, rangeEnd: 16 },
//     { title: "GRAND NATIONAL TOUR", page: GRAND_NATIONAL_START_PAGE, rangeEnd: 20 }, 
//     { title: "TELFAR - DESIGN DEVELOPMENT", page: 21, rangeEnd: 33 }, 
//     { title: "STRAY RATS", page: 34, rangeEnd: totalPages }, 
//   ];
  
//   const navPages = projectNav.map(p => p.page); 

//   // 4. UPDATE VERTICAL LAYOUT ARRAY: Added pages 26 through 33
//   const verticalImagePages = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33]; 
//   const isVerticalLayout = verticalImagePages.includes(page);
  
//   // --- NEW: Check if the current page is part of the protected project ---
//   const isGrandNationalPage = page >= GRAND_NATIONAL_START_PAGE && page <= 20;
  
//   // Determine if the content should be blurred (i.e., protected page and not authenticated)
//   const isContentBlurred = isGrandNationalPage && !isAuthenticated;
//   // -----------------------------------------------------------------------

//   // Function to determine if the current page falls within a project's range
//   const isProjectActive = (startPage: number, endPage: number) => {
//     if (page < projectNav[0].page && startPage === projectNav[0].page) {
//         return false;
//     }
//     return page >= startPage && page <= endPage;
//   };

//   const handleNext = () => {
//     setPage((prevPage) => (prevPage === totalPages ? 1 : prevPage + 1));
//   };

//   const handlePrevious = () => {
//     setPage((prevPage) => (prevPage === 1 ? totalPages : prevPage - 1));
//   };

//   const jumpToPage = (pageNumber: number) => {
//     setPage(pageNumber);
//   };

//   const jumpToCover = () => {
//     setPage(1);
//   };
  
//   // --- NEW AUTHENTICATION HANDLER ---
//   const handlePasswordSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (passwordInput === CORRECT_PASSWORD) {
//       setIsAuthenticated(true);
//       setAuthMessage('ACCESS GRANTED');
//       // Set local storage to maintain auth for the session
//       localStorage.setItem('grandNationalAuth', 'true'); 
//     } else {
//       setAuthMessage('PASSWORD INCORRECT. All images in this section are blurred.');
//       setIsAuthenticated(false);
//       localStorage.removeItem('grandNationalAuth');
//     }
//   };
//   // -----------------------------------

//   const pageImage = `/${page}.webp`;

//   return (
//     <>
//       {loading && (
//         <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}></div>
//       )}
//       {!isPortrait ? (
//         <div className={`${styles.container} ${isVerticalLayout ? styles.verticalLayout : ''}`}>
          
//           {/* Top-Third Heading */}
//           <div className={styles.infoPanelTop}>
//             <h1 className={styles.infoHeading1Top} onClick={jumpToCover}>
//                 JUSTIN O&apos;LEARY
//             </h1>
//           </div>
          
//           {/* Stacked Navigation Buttons (Fixed) */}
//           <div className={styles.navButtonStack}>
//               <button onClick={handlePrevious} className={styles.navButton}>
//                   &lt;
//               </button>
//               <button onClick={handleNext} className={styles.navButton}>
//                   &gt;
//               </button>
//           </div>

//           {/* The image container, now conditionally blurred */}
//           <div className={`${styles.pageContainer} ${isVerticalLayout ? styles.verticalPageContainer : ''}`}>
//             <Image 
//               src={pageImage} 
//               alt={`Page ${page}`} 
//               width={1600} 
//               height={1600} 
//               className={`${styles.pageImage} ${isContentBlurred ? styles.blurredImage : ''} ${isVerticalLayout ? styles.verticalPageImage : ''}`}
//               priority 
//             />
//           </div>
          
//           {/* Password Input Box (Shown only on the Grand National cover page) */}
//           {page === GRAND_NATIONAL_START_PAGE && !isAuthenticated && (
//             <div className={styles.passwordOverlay}>
//               <form onSubmit={handlePasswordSubmit} className={styles.passwordForm}>
//                 <p className={styles.authMessage}>{authMessage || 'PASSWORD REQUIRED TO VIEW PROJECT.'}</p>
//                 <input
//                   type="password"
//                   value={passwordInput}
//                   onChange={(e) => setPasswordInput(e.target.value)}
//                   placeholder="Enter Password"
//                   className={styles.passwordInput}
//                   autoFocus
//                 />
//                 <button type="submit" className={styles.passwordSubmitButton}>
//                   SUBMIT
//                 </button>
//               </form>
//             </div>
//           )}

//           {/* Menu Panel (Fixed) */}
//           <div className={styles.infoPanelBottom}>
//             {projectNav.map((project, index) => (
//               <h2 
//                 key={index} 
//                 className={`${styles.infoHeading2} ${isProjectActive(project.page, project.rangeEnd) ? styles.selected : ''}`}
//                 onClick={() => jumpToPage(project.page)}
//               >
//                 {project.title}
//               </h2>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className={styles.rotateMessage}>ROTATE SCREEN FOR BEST EXPERIENCE</div>
//       )}
//     </>
//   );
// }