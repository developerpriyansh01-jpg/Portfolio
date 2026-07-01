import { motion } from 'framer-motion';
import SectionHeader from '../shared/SectionHeader';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { SiLeetcode, SiHackerrank, SiCodechef, SiCodeforces, SiGeeksforgeeks } from 'react-icons/si';

const defaultProfiles = [
  { platform: 'GitHub', username: 'priyanshrajput', url: 'https://github.com/priyanshrajput', icon: FiGithub, color: '#ffffff', stats: '50+ repos', gradient: 'from-gray-800 to-gray-900' },
  { platform: 'LeetCode', username: 'priyansh_rajput', url: 'https://leetcode.com/priyansh_rajput', icon: SiLeetcode, color: '#ffa116', stats: '200+ solved', gradient: 'from-yellow-900/50 to-orange-900/30' },
  { platform: 'HackerRank', username: 'priyanshrajput', url: 'https://hackerrank.com/priyanshrajput', icon: SiHackerrank, color: '#00ea64', stats: '5⭐ Stars', gradient: 'from-green-900/50 to-emerald-900/30' },
  { platform: 'GeeksForGeeks', username: 'priyanshrajput', url: 'https://auth.geeksforgeeks.org/user/priyanshrajput', icon: SiGeeksforgeeks, color: '#2f8d46', stats: '150+ problems', gradient: 'from-green-900/40 to-teal-900/30' },
];

export default function CodingProfilesSection({ codingProfiles = [] }) {
  const displayProfiles = codingProfiles.length > 0 ? codingProfiles : defaultProfiles;

  return (
    <section id="coding-profiles" className="py-20 relative overflow-hidden">
      <div className="section-container">
        <SectionHeader
          tag="💻 Coding"
          title="Coding"
          titleGradient="Profiles"
          subtitle="Solving problems, building algorithms, and competing — my coding journey across platforms."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {displayProfiles.map((profile, i) => {
            const Icon = typeof profile.icon === 'string' ? FiGithub : profile.icon;
            return (
              <motion.a
                key={profile.platform}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-3 group cursor-pointer bg-gradient-to-br ${profile.gradient || 'from-slate-800/50 to-slate-900/50'} border border-white/5 hover:border-white/15 transition-all`}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: `${profile.color}15`, border: `2px solid ${profile.color}30` }}
                >
                  <Icon style={{ color: profile.color }} className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base">{profile.platform}</h3>
                  <p className="text-slate-500 text-xs">@{profile.username}</p>
                </div>
                <div
                  className="px-4 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: `${profile.color}15`, color: profile.color, border: `1px solid ${profile.color}30` }}
                >
                  {profile.stats}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-white transition-colors">
                  <FiExternalLink className="w-3 h-3" /> View Profile
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
