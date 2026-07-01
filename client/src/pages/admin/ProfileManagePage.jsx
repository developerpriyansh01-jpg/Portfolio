import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiSave, FiUpload, FiUser } from 'react-icons/fi';
import api from '../../config/api';
import toast from 'react-hot-toast';

export default function ProfileManagePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setProfile(data.data);
      reset(data.data);
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const { data: res } = await api.put('/profile', data);
      setProfile(res.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post('/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile((p) => ({ ...p, avatar: data.data.avatar }));
      toast.success('Avatar updated!');
    } catch { toast.error('Upload failed'); } finally { setAvatarUploading(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      await api.post('/profile/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Resume uploaded!');
    } catch { toast.error('Upload failed'); } finally { setResumeUploading(false); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" /></div>;

  const Field = ({ label, name, type = 'text', required, ...props }) => (
    <div>
      <label className="block text-slate-400 text-xs mb-1.5">{label}{required && ' *'}</label>
      <input {...register(name, required ? { required: `${label} is required` } : {})} type={type} className="form-input" {...props} />
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="font-heading font-bold text-2xl text-white">Profile Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center gap-4">
          <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
            {profile?.avatar?.url
              ? <img src={profile.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
              : <FiUser className="w-12 h-12 text-white" />
            }
          </div>
          <label className="btn-neon-outline text-xs px-4 py-2 cursor-pointer">
            {avatarUploading ? 'Uploading...' : '📷 Change Avatar'}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
          </label>
          <div className="w-full">
            <p className="text-slate-500 text-xs text-center mb-2">Resume PDF</p>
            <label className="w-full flex items-center justify-center gap-2 btn-neon-outline text-xs py-2 cursor-pointer">
              <FiUpload className="w-3 h-3" />
              {resumeUploading ? 'Uploading...' : 'Upload Resume'}
              <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={resumeUploading} />
            </label>
            {profile?.resume?.url && (
              <a href={profile.resume.url} target="_blank" rel="noopener noreferrer" className="text-neon-blue text-xs block text-center mt-2 hover:underline">
                View Current Resume ↗
              </a>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 glass-card p-6 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" name="name" required />
              <Field label="Tagline" name="tagline" />
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" />
              <Field label="Location" name="location" />
              <div>
                <label className="block text-slate-400 text-xs mb-1.5">Availability</label>
                <select {...register('isAvailable')} className="form-input">
                  <option value={true}>Available</option>
                  <option value={false}>Not Available</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1.5">Bio *</label>
              <textarea {...register('bio', { required: true })} rows={4} className="form-input resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="GitHub URL" name="github" type="url" />
              <Field label="LinkedIn URL" name="linkedin" type="url" />
              <Field label="Twitter URL" name="twitter" type="url" />
              <Field label="Instagram URL" name="instagram" type="url" />
              <Field label="Years Experience" name="yearsExperience" type="number" />
              <Field label="Projects Completed" name="projectsCompleted" type="number" />
            </div>
            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.01 }} className="btn-neon gap-2">
              {saving ? 'Saving...' : <><FiSave className="w-4 h-4" />Save Profile</>}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
