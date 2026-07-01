import { motion } from 'framer-motion';
import SectionHeader from '../shared/SectionHeader';
import { FiGithub, FiStar, FiGitBranch, FiUsers } from 'react-icons/fi';

export default function GitHubSection({ profile }) {
  const githubUsername = profile?.github?.split('/').pop() || 'priyanshrajput';

  return (
    <section id="github" className="py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />
      <div className="section-container">
        <SectionHeader
          tag="🐙 GitHub"
          title="GitHub"
          titleGradient="Statistics"
          subtitle="Open source contributions and project activity — code speaks louder than words."
        />

        {/* GitHub Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <img
              src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=transparent&hide_border=true&title_color=00d4ff&text_color=94a3b8&icon_color=a855f7`}
              alt="GitHub Stats"
              className="w-full"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <img
              src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=transparent&hide_border=true&stroke=00d4ff&ring=a855f7&fire=ec4899&currStreakLabel=00d4ff`}
              alt="GitHub Streak"
              className="w-full"
              loading="lazy"
            />
          </motion.div>
        </div>

        {/* Language stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-2xl overflow-hidden max-w-lg mx-auto"
        >
          <img
            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=transparent&hide_border=true&title_color=00d4ff&text_color=94a3b8&langs_count=8`}
            alt="Top Languages"
            className="w-full"
            loading="lazy"
          />
        </motion.div>

        {/* GitHub CTA */}
        <div className="text-center mt-8">
          <motion.a
            href={profile?.github || `https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-neon-outline inline-flex"
          >
            <FiGithub className="w-5 h-5" /> View GitHub Profile
          </motion.a>
        </div>
      </div>
    </section>
  );
}
