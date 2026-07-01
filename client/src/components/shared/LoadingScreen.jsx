import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 600);
          }, 400);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="loading-screen"
        >
          {/* Background aurora */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-12px] rounded-full"
                style={{ background: 'conic-gradient(from 0deg, transparent 0deg, #00d4ff 120deg, transparent 240deg, #a855f7 360deg)', opacity: 0.4 }}
              />
              <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full"
                style={{ background: 'rgba(4,4,26,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span
                  style={{
                    fontFamily: "'Inter', 'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.6rem',
                    background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  PR
                </span>
              </div>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h1 className="font-heading font-bold text-3xl text-white">
                Priyansh <span className="gradient-text">Rajput</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Full Stack MERN Developer</p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-64 space-y-2">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    background: 'linear-gradient(90deg, #00d4ff, #a855f7)',
                    transition: 'width 0.2s ease',
                  }}
                />
              </div>
              <p className="text-center text-xs text-slate-600">{Math.round(Math.min(progress, 100))}%</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
