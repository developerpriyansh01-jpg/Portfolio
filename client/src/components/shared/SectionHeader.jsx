import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';

/**
 * Reusable section header with tag, gradient title, and subtitle
 */
export default function SectionHeader({ tag, title, titleGradient, subtitle, centered = true }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`mb-12 space-y-4 ${centered ? 'text-center' : ''}`}
    >
      {tag && (
        <div className={centered ? 'flex justify-center' : ''}>
          <span className="section-tag">{tag}</span>
        </div>
      )}
      <h2 className={`font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight ${centered ? 'text-center' : ''}`}>
        {title}
        {titleGradient && (
          <> <span className="gradient-text">{titleGradient}</span></>
        )}
      </h2>
      {subtitle && (
        <p className={`text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
      {/* Decorative line */}
      <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-neon-blue/60" />
        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
        <div className="h-px w-32 bg-gradient-to-r from-neon-blue/60 via-neon-purple/40 to-transparent" />
      </div>
    </motion.div>
  );
}
