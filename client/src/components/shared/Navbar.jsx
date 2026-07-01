import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FiDownload } from 'react-icons/fi';
import { useScrollPosition } from '../../hooks/useScrollPosition';

const navLinks = [
  { label: 'Home', to: '/#hero' },
  { label: 'About', to: '/#about' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Services', to: '/#services' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Reviews', to: '/#reviews' },
  { label: 'Contact', to: '/#contact' },
];

export default function Navbar({ onHireMeClick, resumeUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { scrollY, isAtTop } = useScrollPosition();
  const location = useLocation();

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'skills', 'services', 'projects', 'experience', 'reviews', 'contact'];
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [location.pathname]);

  const scrollToSection = (to) => {
    setIsOpen(false);
    const hash = to.split('#')[1];
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${!isAtTop
        ? 'bg-[#04041a]/80 backdrop-blur-2xl border-b border-white/5 shadow-lg shadow-black/20'
        : 'bg-transparent'
        }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Text Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span
                style={{
                  fontFamily: "'Inter', 'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  letterSpacing: '0.04em',
                  background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.3))',
                }}
              >
                Priyansh<span style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg, #a855f7 0%, #00d4ff 100%)', WebkitBackgroundClip: 'text', fontWeight: 400, letterSpacing: '0.06em' }}>.dev</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const sectionId = link.to.split('#')[1];
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.to)}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${isActive ? 'text-neon-blue' : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 rounded-lg bg-neon-blue/10 border border-neon-blue/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {resumeUrl && (
              <motion.a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-neon-outline text-sm px-4 py-2"
              >
                <FiDownload className="w-4 h-4" />
                Resume
              </motion.a>
            )}
            <motion.button
              onClick={onHireMeClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-neon text-sm px-5 py-2"
            >
              ✦ Hire Me
            </motion.button>
          </div>

          {/* Mobile Hamburger */}
          <motion.button
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-[#04041a]/95 backdrop-blur-2xl border-b border-white/5"
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map((link, i) => {
                const sectionId = link.to.split('#')[1];
                const isActive = activeSection === sectionId;
                return (
                  <motion.button
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollToSection(link.to)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                      ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {link.label}
                  </motion.button>
                );
              })}
              <div className="flex gap-2 pt-3">
                {resumeUrl && (
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-neon-outline flex-1 justify-center text-sm py-2.5">
                    <FiDownload className="w-4 h-4" /> Resume
                  </a>
                )}
                <button onClick={() => { setIsOpen(false); onHireMeClick(); }} className="btn-neon flex-1 justify-center text-sm py-2.5">
                  ✦ Hire Me
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
