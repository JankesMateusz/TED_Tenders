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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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