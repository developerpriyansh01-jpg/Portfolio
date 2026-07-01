import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin, FiHeart } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
const logoImg = '/logo2.jpeg';

const quickLinks = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Reviews', id: 'reviews' },
  { label: 'Contact', id: 'contact' },
];

export default function Footer({ profile, totalVisitors }) {
  const year = new Date().getFullYear();

  const scroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const socials = [
    { icon: FiGithub, href: profile?.github, label: 'GitHub', color: 'hover:text-white' },
    { icon: FiLinkedin, href: profile?.linkedin, label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: FiTwitter, href: profile?.twitter, label: 'Twitter', color: 'hover:text-cyan-400' },
    { icon: FiInstagram, href: profile?.instagram, label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: FiMail, href: `mailto:${profile?.email || 'developer.priyansh01@gmail.com'}`, label: 'Email', color: 'hover:text-neon-blue' },
  ].filter((s) => s.href);

  return (
    <footer className="relative border-t border-white/5 bg-[#04041a]">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <img 
                src={logoImg} 
                alt="Logo" 
                className="w-auto h-12 object-contain"
                style={{ 
                  mixBlendMode: 'screen',
                  filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.4))'
                }}
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Building premium digital experiences with clean code, modern architecture, and pixel-perfect designs. Open to freelance projects and full-time opportunities.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 ${color} transition-all duration-300 hover:border-white/20 hover:bg-white/10`}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scroll(link.id)}
                    className="text-slate-400 hover:text-neon-blue text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-neon-blue/50 group-hover:bg-neon-blue transition-colors" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-400 text-sm">
                  <FiMail className="w-4 h-4 text-neon-blue shrink-0" />
                  <a href={`mailto:${profile?.email || 'developer.priyansh01@gmail.com'}`} className="hover:text-neon-blue transition-colors truncate">
                    {profile?.email || 'developer.priyansh01@gmail.com'}
                  </a>
                </li>
                <li className="flex items-center gap-2 text-slate-400 text-sm">
                  <FiPhone className="w-4 h-4 text-neon-blue shrink-0" />
                  <a href={`tel:${profile?.phone || '+918619350424'}`} className="hover:text-neon-blue transition-colors">
                    {profile?.phone || '+91 8619350424'}
                  </a>
                </li>
              {profile?.location && (
                <li className="flex items-center gap-2 text-slate-400 text-sm">
                  <FiMapPin className="w-4 h-4 text-neon-blue shrink-0" />
                  <span>{profile.location}</span>
                </li>
              )}
            </ul>

            {/* Visitor Counter */}
            <div className="mt-6 glass-card p-4 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Total Visitors</p>
              <p className="text-2xl font-bold gradient-text">
                {totalVisitors || 1247}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm flex items-center gap-1">
            © {year} Priyansh Rajput. Built with
            <FiHeart className="text-pink-400 mx-0.5" /> using
            <span className="text-neon-blue font-medium">React</span> +
            <span className="text-green-400 font-medium">Node.js</span> +
            <span className="text-emerald-400 font-medium">MongoDB</span>
          </p>
          <div className="flex items-center gap-4 text-slate-600 text-xs">
            <span>v1.0.0</span>
            <span>•</span>
            <span>Updated: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
