import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../shared/SectionHeader';
import { staggerContainer, staggerItem } from '../../utils/animations';

const CATEGORIES = ['All', 'frontend', 'backend', 'database', 'devops', 'tools', 'languages'];

export default function SkillsSection({ skills = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory);

  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    const catSkills = skills.filter((s) => s.category === cat);
    if (catSkills.length > 0) acc[cat] = catSkills;
    return acc;
  }, {});

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-[120px]" />

      <div className="section-container">
        <SectionHeader
          tag="⚡ Skills"
          title="Technologies I"
          titleGradient="Work With"
          subtitle="My technical arsenal — constantly growing and evolving with the latest technologies."
        />

        {/* Category Filter */}
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
                  : 'glass-card text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Skills Grid */}
        {activeCategory === 'All' ? (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-neon-blue mb-4 capitalize">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill, i) => (
                    <SkillCard key={skill._id || skill.name} skill={skill} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((skill, i) => (
              <SkillCard key={skill._id || skill.name} skill={skill} index={i} />
            ))}
          </motion.div>
        )}

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 py-12">No skills in this category yet.</p>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass-card p-4 rounded-2xl group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: `${skill.color}15`, border: `1px solid ${skill.color}30` }}
          >
            {skill.icon || skill.name?.[0]}
          </div>
          <span className="font-medium text-white text-sm">{skill.name}</span>
        </div>
        <span className="text-xs font-bold" style={{ color: skill.color || '#00d4ff' }}>
          {skill.proficiency}%
        </span>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: index * 0.05 }}
          style={{ background: `linear-gradient(90deg, ${skill.color || '#00d4ff'}, ${skill.color ? skill.color + '80' : '#a855f7'})` }}
        />
      </div>
    </motion.div>
  );
}
