import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUsers, FiEye, FiStar, FiDownload, FiGithub, FiBriefcase, FiSmartphone, FiMonitor, FiTablet } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../config/api';
import { staggerContainer, staggerItem } from '../../utils/animations';

const DEVICE_COLORS = { desktop: '#00d4ff', mobile: '#a855f7', tablet: '#ec4899' };
const BROWSER_COLORS = { chrome: '#4285f4', firefox: '#ff6600', safari: '#0fb5ee', edge: '#0078d7', other: '#94a3b8' };

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard').then(({ data }) => {
      setStats(data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Visitors', value: stats?.totalVisits?.toLocaleString() || '0', icon: FiEye, color: '#00d4ff', bg: 'from-cyan-500/10 to-blue-600/10' },
    { label: "Today's Visitors", value: stats?.todayVisits?.toLocaleString() || '0', icon: FiUsers, color: '#a855f7', bg: 'from-purple-500/10 to-violet-600/10' },
    { label: 'Resume Downloads', value: stats?.resumeDownloads?.toLocaleString() || '0', icon: FiDownload, color: '#10b981', bg: 'from-green-500/10 to-emerald-600/10' },
    { label: 'GitHub Clicks', value: stats?.githubClicks?.toLocaleString() || '0', icon: FiGithub, color: '#f59e0b', bg: 'from-amber-500/10 to-orange-600/10' },
    { label: 'Contact Messages', value: stats?.totalContacts?.toLocaleString() || '0', icon: FiMail, color: '#ec4899', bg: 'from-pink-500/10 to-rose-600/10', badge: stats?.unreadContacts ? `${stats.unreadContacts} unread` : null },
    { label: 'Hire Requests', value: stats?.totalHire?.toLocaleString() || '0', icon: FiBriefcase, color: '#06b6d4', bg: 'from-cyan-500/10 to-sky-600/10' },
    { label: 'Approved Reviews', value: stats?.totalReviews?.toLocaleString() || '0', icon: FiStar, color: '#fbbf24', bg: 'from-yellow-500/10 to-amber-600/10', badge: stats?.pendingReviews ? `${stats.pendingReviews} pending` : null },
    { label: 'Live Projects', value: stats?.totalProjects?.toLocaleString() || '0', icon: FiBriefcase, color: '#8b5cf6', bg: 'from-violet-500/10 to-purple-600/10' },
  ];

  const deviceData = stats?.devices
    ? Object.entries(stats.devices).filter(([,v]) => v > 0).map(([k, v]) => ({ name: k, value: v }))
    : [{ name: 'desktop', value: 60 }, { name: 'mobile', value: 35 }, { name: 'tablet', value: 5 }];

  const chartData = (stats?.monthlyChart || []).map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visits: d.visits,
    contacts: d.contacts,
    hires: d.hires,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Portfolio analytics & overview</p>
      </div>

      {/* Stat Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map(({ label, value, icon: Icon, color, bg, badge }) => (
          <motion.div
            key={label}
            variants={staggerItem}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`glass-card p-4 rounded-2xl bg-gradient-to-br ${bg} relative overflow-hidden`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs mb-1">{label}</p>
                <p className="font-heading font-bold text-2xl text-white">{value}</p>
                {badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 mt-1 inline-block">
                    {badge}
                  </span>
                )}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="xl:col-span-2 glass-card p-5 rounded-2xl">
          <h3 className="font-heading font-semibold text-white mb-4">Monthly Traffic</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0a0a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="visits" stroke="#00d4ff" strokeWidth={2} fill="url(#visitGrad)" name="Visits" />
                <Area type="monotone" dataKey="contacts" stroke="#a855f7" strokeWidth={2} fill="none" name="Contacts" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-500 text-sm">No data yet — visit the site to generate analytics!</div>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="glass-card p-5 rounded-2xl">
          <h3 className="font-heading font-semibold text-white mb-4">Device Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={deviceData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {deviceData.map(({ name }, i) => (
                  <Cell key={name} fill={DEVICE_COLORS[name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0a0a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12, textTransform: 'capitalize' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
