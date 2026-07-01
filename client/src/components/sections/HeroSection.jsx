import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { FiGithub, FiMail, FiDownload, FiChevronDown } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { FaReact, FaNodeJs, FaDatabase } from 'react-icons/fa';
import { SiMongodb, SiTailwindcss, SiExpress } from 'react-icons/si';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const floatingIcons = [
  { icon: FaReact, color: '#00d4ff', label: 'React', top: '15%', left: '8%', delay: 0 },
  { icon: FaNodeJs, color: '#68a063', label: 'Node.js', top: '25%', right: '8%', delay: 0.5 },
  { icon: SiMongodb, color: '#47A248', label: 'MongoDB', bottom: '30%', left: '6%', delay: 1 },
  { icon: SiExpress, color: '#e2e8f0', label: 'Express', top: '55%', right: '10%', delay: 1.5 },
  { icon: SiTailwindcss, color: '#38bdf8', label: 'Tailwind', bottom: '20%', right: '6%', delay: 0.8 },
  { icon: FaDatabase, color: '#a855f7', label: 'Database', top: '70%', left: '10%', delay: 1.2 },
];

export default function HeroSection({ profile, onHireMeClick }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Cursor glow tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    const el = heroRef.current;
    el?.addEventListener('mousemove', handleMouseMove);
    return () => el?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Correct initialization for tsParticles v4+
  const initParticles = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #04041a 0%, #0a0a2e 40%, #0f0f4a 70%, #0a0a2e 100%)' }}
    >
      {/* Cursor glow */}
      <div
        className="pointer-events-none absolute w-96 h-96 rounded-full opacity-20 transition-all duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
      />

      {/* Animated Grid */}
      <div className="absolute inset-0 animated-grid opacity-40" />

      {/* Aurora blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -80, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 100, 0], scale: [1.2, 0.9, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-10 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -60, 0], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full opacity-12 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent 70%)' }}
        />
      </div>

      {/* Particles */}
      <Particles
        id="hero-particles"
        init={initParticles}
        particlesLoaded={particlesLoaded}
        options={{
          particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: ['#00d4ff', '#a855f7', '#ec4899'] },
            shape: { type: 'circle' },
            opacity: { value: 0.4, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false } },
            size: { value: 2, random: true },
            move: {
              enable: true, speed: 0.5, direction: 'none', random: true,
              straight: false, out_mode: 'out', bounce: false,
            },
            links: {
              enable: true, distance: 120, color: '#00d4ff', opacity: 0.15, width: 1,
            },
          },
          interactivity: {
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } }, push: { particles_nb: 3 } },
          },
          retina_detect: true,
        }}
        className="absolute inset-0"
      />

      {/* Floating Tech Icons */}
      {floatingIcons.map(({ icon: Icon, color, label, delay, ...pos }) => (
        <motion.div
          key={label}
          className="absolute hidden lg:flex items-center gap-2 glass-card px-3 py-2 text-xs"
          style={{ ...pos }}
          animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Icon style={{ color }} className="w-4 h-4" />
          <span className="text-slate-300 font-medium">{label}</span>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="section-container relative z-10 text-center pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue" />
            </span>
            <HiOutlineSparkles className="w-4 h-4" />
            Available for Freelance & Full-Time Work
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-bold text-4xl sm:text-5xl lg:text-7xl xl:text-8xl text-white leading-tight mb-4"
        >
          Hi, I'm{' '}
          <span className="gradient-text animate-glow">Priyansh</span>
        </motion.h1>

        {/* Typing Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xl sm:text-2xl lg:text-3xl text-slate-300 font-medium mb-6 h-10"
        >
          <span className="text-gradient">
            <Typewriter
              options={{
                strings: [
                  'Full Stack MERN Developer',
                  'React.js Expert',
                  'Node.js Developer',
                  'UI/UX Enthusiast',
                  'Open Source Contributor',
                  '3 Years of Experience',
                ],
                autoStart: true,
                loop: true,
                delay: 60,
                deleteSpeed: 30,
              }}
            />
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {profile?.bio || 'Passionate Full Stack Developer building premium web experiences with React, Node.js & MongoDB. 3 years of crafting scalable, pixel-perfect applications.'}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          <motion.button
            onClick={onHireMeClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-neon px-8 py-3.5 text-base"
          >
            🚀 Hire Me
          </motion.button>

          <motion.a
            href="#projects"
            onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-neon-outline px-8 py-3.5 text-base"
          >
            View Projects
          </motion.a>

          {profile?.github && (
            <motion.a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-neon-outline px-8 py-3.5 text-base"
            >
              <FiGithub className="w-5 h-5" /> GitHub
            </motion.a>
          )}

          {profile?.resume?.url && (
            <motion.a
              href={profile.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-purple px-8 py-3.5 text-base"
            >
              <FiDownload className="w-5 h-5" /> Resume
            </motion.a>
          )}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {[
            { label: 'Years Exp.', value: profile?.yearsExperience || 3 },
            { label: 'Projects Done', value: `${profile?.projectsCompleted || 20}+` },
            { label: 'Happy Clients', value: `${profile?.happyClients || 15}+` },
          ].map(({ label, value }) => (
            <div key={label} className="glass-card px-5 py-3 text-center">
              <div className="font-heading font-bold text-2xl gradient-text">{value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-neon-blue transition-colors"
        aria-label="Scroll down"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FiChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </section>
  );
}
