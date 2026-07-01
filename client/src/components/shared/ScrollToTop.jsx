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
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full outline-none border border-white/10 flex items-center justify-center cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.15))',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 20px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.05)',
          }}
          aria-label="Back to top"
        >
          {/* Arrow Up Icon */}
          <motion.div
            animate={isLaunching ? {
              y: [0, -20, -1000],
              scale: [1, 1.1, 0.5],
              opacity: [1, 1, 0],
            } : { y: [0, -3, 0] }}
            transition={isLaunching
              ? { duration: 1.5, ease: 'easeIn' }
              : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative flex items-center justify-center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#arrowGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="arrowGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#00d4ff" />
                </linearGradient>
              </defs>
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
