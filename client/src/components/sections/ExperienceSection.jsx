import { motion } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import SectionHeader from '../shared/SectionHeader';

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const defaultExperiences = [
  {
    _id: '1',
    position: 'Full Stack Developer (Freelance)',
    company: 'Self-Employed',
    location: 'Remote',
    startDate: '2022-01-01',
    isCurrent: true,
    employmentType: 'freelance',
    description: 'Building full-stack MERN applications for clients globally. Specializing in e-commerce, portfolio, and SaaS applications.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'AWS'],
  },
  {
    _id: '2',
    position: 'Frontend Developer Intern',
    company: 'Tech Startup',
    location: 'Remote',
    startDate: '2021-06-01',
    endDate: '2021-12-31',
    employmentType: 'internship',
    description: 'Developed responsive web interfaces using React.js, collaborated with backend team to integrate REST APIs, and improved application performance by 40%.',
    techStack: ['React', 'JavaScript', 'CSS3', 'REST API', 'Git'],
  },
];

export default function ExperienceSection({ experiences = [] }) {
  const displayExperiences = experiences.length > 0 ? experiences : defaultExperiences;

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-neon-blue/5 rounded-full blur-[100px]" />

      <div className="section-container">
        <SectionHeader
          tag="🏢 Experience"
          title="My Professional"
          titleGradient="Journey"
          subtitle="A timeline of growth, learning, and impact across different roles and projects."
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue/50 via-neon-purple/30 to-transparent" />

          <div className="space-y-8">
            {displayExperiences.map((exp, index) => (
              <motion.div
                key={exp._id || index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-16 sm:pl-24"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 sm:left-4 top-6 w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                  <FiBriefcase className="w-4 h-4 text-white" />
                  {exp.isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-neon-blue/30 animate-ping" />
                  )}
                </div>

                <div className="glass-card-hover p-6 rounded-2xl">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-heading font-bold text-white text-lg">{exp.position}</h3>
                      <p className="text-neon-blue font-medium text-sm">{exp.company}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exp.isCurrent && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/20">
                          Current
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 capitalize">
                        {exp.employmentType?.replace('-', ' ') || 'full-time'}
                      </span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <FiMapPin className="w-3 h-3" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{exp.description}</p>

                  {/* Tech Stack */}
                  {exp.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.techStack.map((tech) => (
                        <span key={tech} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
