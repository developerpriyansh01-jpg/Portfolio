import { motion } from 'framer-motion';
import SectionHeader from '../shared/SectionHeader';
import { FaReact, FaNodeJs, FaGitAlt, FaDocker, FaAws, FaPython, FaDatabase } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTailwindcss, SiTypescript, SiNextdotjs, SiRedux, SiPostman, SiVercel, SiCloudinary, SiSocketdotio, SiJsonwebtokens, SiGraphql } from 'react-icons/si';
import { staggerContainer, staggerItem } from '../../utils/animations';

const defaultTechStack = [
  { name: 'React.js', icon: FaReact, color: '#00d4ff', category: 'Frontend' },
  { name: 'Node.js', icon: FaNodeJs, color: '#68a063', category: 'Backend' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248', category: 'Database' },
  { name: 'Express.js', icon: SiExpress, color: '#e2e8f0', category: 'Backend' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#38bdf8', category: 'Frontend' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178c6', category: 'Language' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff', category: 'Frontend' },
  { name: 'Redux', icon: SiRedux, color: '#764abc', category: 'Frontend' },
  { name: 'Git', icon: FaGitAlt, color: '#f14e32', category: 'DevOps' },
  { name: 'Docker', icon: FaDocker, color: '#2496ed', category: 'DevOps' },
  { name: 'AWS', icon: FaAws, color: '#ff9900', category: 'Cloud' },
  { name: 'Postman', icon: SiPostman, color: '#ff6c37', category: 'Tools' },
  { name: 'Vercel', icon: SiVercel, color: '#ffffff', category: 'DevOps' },
  { name: 'Cloudinary', icon: SiCloudinary, color: '#3448c5', category: 'Services' },
  { name: 'Socket.io', icon: SiSocketdotio, color: '#010101', category: 'Backend' },
  { name: 'JWT', icon: SiJsonwebtokens, color: '#d63aff', category: 'Security' },
];

export default function TechStackSection() {
  return (
    <section id="techstack" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-neon-blue/4 rounded-full blur-[100px]" />

      <div className="section-container">
        <SectionHeader
          tag="🛠️ Tech Stack"
          title="Tools I"
          titleGradient="Master"
          subtitle="A constantly evolving toolkit of technologies I use to build exceptional products."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
        >
          {defaultTechStack.map(({ name, icon: Icon, color, category }) => (
            <motion.div
              key={name}
              variants={staggerItem}
              whileHover={{ y: -8, scale: 1.1 }}
              className="glass-card p-4 rounded-2xl flex flex-col items-center gap-2 group cursor-pointer relative overflow-hidden"
              title={`${name} — ${category}`}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${color}15, transparent 70%)` }}
              />
              <Icon className="w-8 h-8 relative z-10 transition-transform duration-300" style={{ color }} />
              <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors text-center relative z-10">{name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
