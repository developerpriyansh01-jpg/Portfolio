import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiCalendar, FiCheck } from 'react-icons/fi';
import { HiOutlineLightningBolt } from 'react-icons/hi';
import SectionHeader from '../shared/SectionHeader';
import { fadeInLeft, fadeInRight, staggerContainer, staggerItem } from '../../utils/animations';

export default function AboutSection({ profile }) {
  const stats = [
    { label: 'Years Experience', value: profile?.yearsExperience || 3, suffix: '+' },
    { label: 'Projects Completed', value: profile?.projectsCompleted || 20, suffix: '+' },
    { label: 'Happy Clients', value: profile?.happyClients || 15, suffix: '+' },
    { label: 'Coffees ☕', value: profile?.coffeeConsumed || 1000, suffix: '+' },
  ];

  const highlights = [
    'Full Stack MERN Development',
    'REST API & GraphQL Design',
    'Responsive UI/UX Design',
    'Database Architecture',
    'JWT Authentication & Security',
    'Cloud Deployment (Vercel, Render)',
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-neon-blue/5 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="section-container">
        <SectionHeader
          tag="🧑‍💻 About Me"
          title="The Developer"
          titleGradient="Behind the Code"
          subtitle="Passionate about building scalable, high-performance web applications that solve real-world problems."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Avatar + Card */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Avatar */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'conic-gradient(from 0deg, #00d4ff, #a855f7, #ec4899, #00d4ff)',
                    padding: '2px',
                    borderRadius: '16px',
                  }}
                >
                  <div className="w-full h-full rounded-2xl bg-[#0a0a2e]" />
                </motion.div>
                <div className="absolute inset-[3px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  {profile?.avatar?.url ? (
                    <img src={profile.avatar.url} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-8xl font-bold gradient-text">P</div>
                  )}
                </div>

                {/* Status badge */}
                <div className="absolute -bottom-3 -right-3 glass-card px-3 py-2 rounded-xl flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  <span className="text-green-400 text-xs font-semibold">
                    {profile?.availabilityText || 'Available for work'}
                  </span>
                </div>

                {/* Experience badge */}
                <div className="absolute -top-3 -left-3 glass-card px-3 py-2 rounded-xl">
                  <p className="text-neon-blue font-bold text-lg leading-none">{profile?.yearsExperience || 3}+</p>
                  <p className="text-slate-400 text-[10px]">Years Exp.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <p className="text-slate-300 text-base leading-relaxed">
                {profile?.bio || "I'm Priyansh Rajput, a passionate Full Stack MERN Developer with 3 years of experience building scalable web applications. I specialize in crafting premium digital experiences with clean code and modern architecture."}
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                As a student and developer, I blend academic knowledge with real-world project experience to deliver solutions that are both technically sound and visually compelling.
              </p>
            </div>

            {/* Info */}
            <div className="space-y-2">
              {[
                { icon: FiMapPin, label: profile?.location || 'India' },
                { icon: FiMail, label: profile?.email || 'developer.priyansh01@gmail.com' },
                { icon: FiCalendar, label: `${profile?.yearsExperience || 3} Years of Development Experience` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-slate-400 text-sm">
                  <Icon className="w-4 h-4 text-neon-blue shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                  <FiCheck className="w-4 h-4 text-neon-blue shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {stats.map(({ label, value, suffix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card-hover p-6 text-center rounded-2xl"
            >
              <div className="font-heading font-bold text-3xl sm:text-4xl gradient-text">
                {value}{suffix}
              </div>
              <p className="text-slate-400 text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


