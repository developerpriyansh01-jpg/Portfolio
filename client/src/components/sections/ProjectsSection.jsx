import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiEye } from 'react-icons/fi';
import { HiStar } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import SectionHeader from '../shared/SectionHeader';
import { staggerContainer, staggerItem } from '../../utils/animations';
import api from '../../config/api';

const CATEGORIES = ['All', 'fullstack', 'frontend', 'backend', 'mobile', 'ai-ml', 'open-source'];

export default function ProjectsSection({ projects = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState({ open: false, slides: [], index: 0 });

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const trackView = (projectId) => {
    api.post('/analytics/track', { event: 'project_view' }).catch(() => {});
  };

  const openLightbox = (project, imgIndex = 0) => {
    const slides = [
      ...(project.thumbnail?.url ? [{ src: project.thumbnail.url }] : []),
      ...(project.screenshots || []).map((s) => ({ src: s.url })),
    ];
    setLightbox({ open: true, slides, index: imgIndex });
  };

  const statusColors = {
    'completed': 'bg-green-500/15 text-green-400 border-green-500/20',
    'in-progress': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    'maintained': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    'archived': 'bg-gray-500/15 text-gray-400 border-gray-500/20',
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-neon-blue/5 rounded-full blur-[120px]" />

      <div className="section-container">
        <SectionHeader
          tag="🚀 Projects"
          title="Featured"
          titleGradient="Projects"
          subtitle="A showcase of my best work — each project built with passion, precision, and production-ready code."
        />

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-blue'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'ai-ml' ? 'AI/ML' : cat}
            </motion.button>
          ))}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard
                key={project._id || project.title}
                project={project}
                index={i}
                onLightbox={openLightbox}
                onView={trackView}
                statusColors={statusColors}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-16">No projects in this category yet.</p>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightbox.open}
        close={() => setLightbox((p) => ({ ...p, open: false }))}
        slides={lightbox.slides}
        index={lightbox.index}
      />
    </section>
  );
}

function ProjectCard({ project, index, onLightbox, onView, statusColors }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -8 }}
      className="glass-card group rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Thumbnail */}
      <div
        className="relative h-48 overflow-hidden cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900"
        onClick={() => onLightbox(project, 0)}
      >
        {project.thumbnail?.url && !imgError ? (
          <img
            src={project.thumbnail.url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl font-bold text-gradient opacity-30">{project.title?.[0]}</div>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onLightbox(project, 0); }}
            className="w-10 h-10 rounded-full bg-neon-blue/80 flex items-center justify-center hover:bg-neon-blue transition-colors"
          >
            <FiEye className="w-4 h-4 text-white" />
          </button>
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <FiExternalLink className="w-4 h-4 text-white" />
            </a>
          )}
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${statusColors[project.status] || statusColors.completed}`}>
            {project.status || 'completed'}
          </span>
        </div>

        {/* Featured badge */}
        {project.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
              <HiStar className="w-3 h-3" /> Featured
            </span>
          </div>
        )}

        {/* Screenshots count */}
        {project.screenshots?.length > 0 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[10px] bg-black/60 text-white">
            +{project.screenshots.length} shots
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-bold text-white text-base mb-1.5 group-hover:text-neon-blue transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-3 flex-1 line-clamp-3">
          {project.shortDescription}
        </p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack?.slice(0, 4).map((tech) => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
          {project.techStack?.length > 4 && (
            <span className="tech-tag">+{project.techStack.length - 4}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/projects/${project.slug || project._id}`}
            onClick={() => onView(project._id)}
            className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-medium bg-neon-blue/10 border border-neon-blue/20 text-neon-blue hover:bg-neon-blue/20 transition-colors"
          >
            View Details
          </Link>
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <FiGithub className="w-4 h-4" />
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors"
            >
              <FiExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
