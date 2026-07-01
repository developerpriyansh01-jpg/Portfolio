import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiLock, FiGlobe, FiMail } from 'react-icons/fi';
import api from '../../config/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('general');
  const { register, handleSubmit, reset } = useForm();
  const { register: regPwd, handleSubmit: handlePwd, reset: resetPwd } = useForm();

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      setSettings(data.data);
      reset(data.data);
      setLoading(false);
    });
  }, [reset]);

  const saveSettings = async (data) => {
    try {
      await api.put('/settings', data);
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save'); }
  };

  const changePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) { toast.error('Passwords do not match'); return; }
    try {
      await api.put('/auth/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed!');
      resetPwd();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FiGlobe },
    { id: 'email', label: 'Email', icon: FiMail },
    { id: 'security', label: 'Security', icon: FiLock },
  ];

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-heading font-bold text-2xl text-white">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 glass-card p-1 rounded-2xl w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${tab === id ? 'bg-neon-blue/20 text-neon-blue' : 'text-slate-400 hover:text-white'}`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {tab === 'general' && (
        <form onSubmit={handleSubmit(saveSettings)} className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-white mb-2">Site Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Site Name</label>
              <input {...register('siteName')} className="form-input" placeholder="Priyansh Rajput | Portfolio" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Canonical URL</label>
              <input {...register('canonicalUrl')} type="url" className="form-input" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="text-slate-400 text-xs mb-1.5 block">Meta Description</label>
              <textarea {...register('siteDescription')} rows={3} className="form-input resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-slate-400 text-xs mb-1.5 block">Keywords (comma-separated)</label>
              <input {...register('siteKeywords')} className="form-input" />
            </div>
            <div className="col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                <input {...register('maintenanceMode')} type="checkbox" className="w-4 h-4 accent-neon-blue" />
                Maintenance Mode
              </label>
              <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                <input {...register('analyticsEnabled')} type="checkbox" defaultChecked className="w-4 h-4 accent-neon-blue" />
                Analytics Enabled
              </label>
            </div>
          </div>
          <button type="submit" className="btn-neon gap-2 text-sm"><FiSave className="w-4 h-4" />Save Settings</button>
        </form>
      )}

      {/* Email Tab */}
      {tab === 'email' && (
        <form onSubmit={handleSubmit(saveSettings)} className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-white mb-2">Email Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">SMTP Host</label>
              <input {...register('emailSettings.host')} className="form-input" placeholder="smtp.gmail.com" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Port</label>
              <input {...register('emailSettings.port')} type="number" className="form-input" placeholder="587" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Email Address</label>
              <input {...register('emailSettings.user')} type="email" className="form-input" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Email Password / App Key</label>
              <input {...register('emailSettings.password')} type="password" className="form-input" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">Admin Email (notifications)</label>
              <input {...register('emailSettings.adminEmail')} type="email" className="form-input" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1.5 block">From Name</label>
              <input {...register('emailSettings.fromName')} className="form-input" placeholder="Priyansh Rajput" />
            </div>
          </div>
          <button type="submit" className="btn-neon gap-2 text-sm"><FiSave className="w-4 h-4" />Save Email Settings</button>
        </form>
      )}

      {/* Security Tab */}
      {tab === 'security' && (
        <form onSubmit={handlePwd(changePassword)} className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="font-semibold text-white mb-2">Change Password</h3>
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block">Current Password</label>
            <input {...regPwd('currentPassword', { required: true })} type="password" className="form-input" />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block">New Password</label>
            <input {...regPwd('newPassword', { required: true, minLength: 8 })} type="password" className="form-input" />
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1.5 block">Confirm New Password</label>
            <input {...regPwd('confirmPassword', { required: true })} type="password" className="form-input" />
          </div>
          <button type="submit" className="btn-neon gap-2 text-sm"><FiLock className="w-4 h-4" />Change Password</button>
        </form>
      )}
    </div>
  );
}
