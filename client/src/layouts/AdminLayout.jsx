import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiUser, FiCode, FiBookOpen, FiBriefcase, FiAward,
  FiStar, FiMail, FiUsers, FiSettings, FiActivity, FiLogOut,
  FiMenu, FiX, FiLayers, FiTool, FiClock,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import logoImg from '/logo.jpeg';

const navItems = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/profile', icon: FiUser, label: 'Profile' },
  { to: '/admin/skills', icon: FiCode, label: 'Skills' },
  { to: '/admin/services', icon: FiLayers, label: 'Services' },
  { to: '/admin/projects', icon: FiBriefcase, label: 'Projects' },
  { to: '/admin/experience', icon: FiClock, label: 'Experience' },
  { to: '/admin/certificates', icon: FiAward, label: 'Certificates' },
  { to: '/admin/reviews', icon: FiStar, label: 'Reviews' },
  { to: '/admin/messages', icon: FiMail, label: 'Messages' },
  { to: '/admin/hire-requests', icon: FiUsers, label: 'Hire Requests' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
  { to: '/admin/logs', icon: FiActivity, label: 'Activity Logs' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-[#04041a] overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/5 flex flex-col
          lg:relative lg:translate-x-0 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <img 
            src={logoImg} 
            alt="Logo" 
            className="w-auto h-8 object-contain" 
            style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 5px rgba(0,212,255,0.4))' }}
          />
          <div>
            <p className="font-heading font-bold text-sm text-white">Admin Panel</p>
            <p className="text-[10px] text-neon-blue">Priyansh Rajput</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 overflow-y-auto hide-scrollbar space-y-0.5">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <FiLogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-white/5 bg-[#04041a]/80 backdrop-blur-sm shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <NavLink
              to="/"
              target="_blank"
              className="text-xs text-slate-500 hover:text-neon-blue transition-colors px-3 py-1.5 rounded-lg hover:bg-neon-blue/5"
            >
              View Site ↗
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
