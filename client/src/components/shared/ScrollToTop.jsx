import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '../../hooks/useScrollPosition';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const { scrollY } = useScrollPosition();

  useEffect(() => {
    setIsVisible(scrollY > 300);
  }, [scrollY]);

  const handleClick = () => {
    setIsLaunching(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsLaunching(false), 1500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleClick}
          className="fixed bottom-8 right-8 z-50 w-20 h-20 outline-none border-none bg-transparent flex items-center justify-center cursor-pointer"
          aria-label="Back to top"
        >
          {/* Rocket and Flame Wrapper */}
          <motion.div
            animate={isLaunching ? {
              y: [0, -20, -1000],
              scale: [1, 1.1, 0.5],
              opacity: [1, 1, 0],
            } : { y: [0, -5, 0] }}
            transition={isLaunching
              ? { duration: 1.5, ease: 'easeIn' }
              : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative w-full h-full flex items-center justify-center"
          >
            <img
              src="/rocket.png"
              alt="Rocket — scroll to top"
              className="w-16 h-16 drop-shadow-[0_0_15px_rgba(0,212,255,0.6)]"
              style={{
                filter: 'contrast(1.1) brightness(1.1)'
              }}
            />

            {/* Flame effect */}
            <AnimatePresence>
              {isLaunching && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 origin-top"
                >
                  <div className="w-3 h-12 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent rounded-full blur-sm animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
