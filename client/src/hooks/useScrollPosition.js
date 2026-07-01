import { useState, useEffect } from 'react';

/**
 * Track scroll position and direction for navbar effects
 */
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDir, setScrollDir] = useState('up');
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let prevScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsAtTop(currentScrollY < 50);
      setScrollDir(currentScrollY > prevScrollY ? 'down' : 'up');
      prevScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY, scrollDir, isAtTop };
};
