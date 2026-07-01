import { motion } from 'framer-motion';
import SectionHeader from '../shared/SectionHeader';
import { FiAward, FiExternalLink } from 'react-icons/fi';
import { staggerContainer, staggerItem } from '../../utils/animations';

export default function CertificatesSection({ certificates = [] }) {
  const defaultCerts = [
    { _id: '1', title: 'React Developer Certification', issuer: 'Meta', issueDate: '2023-06-01', category: 'frontend', skills: ['React', 'Redux', 'Testing'], credentialUrl: '#' },
    { _id: '2', title: 'Node.js Application Development', issuer: 'OpenJS Foundation', issueDate: '2023-03-01', category: 'backend', skills: ['Node.js', 'Express', 'APIs'], credentialUrl: '#' },
    { _id: '3', title: 'MongoDB Associate Developer', issuer: 'MongoDB University', issueDate: '2023-08-01', category: 'database', skills: ['MongoDB', 'Aggregation', 'Indexing'], credentialUrl: '#' },
    { _id: '4', title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', issueDate: '2022-12-01', category: 'cloud', skills: ['AWS', 'EC2', 'S3'], credentialUrl: '#' },
  ];
  const displayCerts = certificates.length > 0 ? certificates : defaultCerts;

  const categoryColors = {
    frontend: '#00d4ff',
    backend: '#68a063',
    database: '#47A248',
    cloud: '#ff9500',
    'ai-ml': '#a855f7',
    security: '#ef4444',
    other: '#94a3b8',
  };

  return (
    <section id="certificates" className="py-24 relative overflow-hidden">
      <div className="section-container">
        <SectionHeader
          tag="🏅 Certificates"
          title="Achievements &"
          titleGradient="Certifications"
          subtitle="Continuously learning and validating my skills through industry-recognized certifications."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {displayCerts.map((cert) => (
            <motion.div
              key={cert._id || cert.title}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              className="glass-card p-5 rounded-2xl group relative overflow-hidden"
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${categoryColors[cert.category] || '#00d4ff'}15, transparent 60%)` }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${categoryColors[cert.category] || '#00d4ff'}15`, border: `1px solid ${categoryColors[cert.category] || '#00d4ff'}30` }}
                >
                  {cert.image?.url ? (
                    <img src={cert.image.url} alt={cert.title} className="w-8 h-8 object-contain" />
                  ) : (
                    <FiAward className="w-6 h-6" style={{ color: categoryColors[cert.category] || '#00d4ff' }} />
                  )}
                </div>

                <h3 className="font-heading font-semibold text-white text-sm mb-1 leading-tight">{cert.title}</h3>
                <p style={{ color: categoryColors[cert.category] || '#00d4ff' }} className="text-xs font-medium mb-2">{cert.issuer}</p>

                {cert.issueDate && (
                  <p className="text-slate-500 text-xs mb-3">
                    {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                )}

                {cert.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {cert.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {cert.credentialUrl && cert.credentialUrl !== '#' && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-neon-blue hover:text-neon-cyan transition-colors"
                  >
                    <FiExternalLink className="w-3 h-3" /> View Credential
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
