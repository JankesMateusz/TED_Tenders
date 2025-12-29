import React, { useEffect, useState } from 'react';
import styles from './ScrollToTopButton.module.css';
import { SCROLL_THRESHOLD } from '../constants';

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    // Sprawdź czy przeglądarka obsługuje smooth scroll
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback dla starszych przeglądarek - animacja ręczna
      const startPosition = window.pageYOffset;
      const startTime = performance.now();
      const duration = 500; // 500ms animacji

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition * (1 - ease));
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  return (
    <button
      className={styles.scrollToTop + (visible ? ' ' + styles.visible : '')}
      onClick={scrollToTop}
      aria-label="Wróć na górę strony"
      tabIndex={visible ? 0 : -1}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton; 