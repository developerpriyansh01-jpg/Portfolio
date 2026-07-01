import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiImage, FiExternalLink, FiGithub } from 'react-icons/fi';
import api from '../../config/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['fullstack', 'frontend', 'backend', 'mobile', 'ai-ml', 'open-source', 'other'];
const STATUSES = ['completed', 'in-progress', 'maintained', 'archived'];

export default function ProjectsManagePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchProjects = async () => {
    const { data } = await api.get('/projects/admin/all?limit=50');
    setProjects(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => { reset({ status: 'completed', category: 'fullstack' }); setEditId(null); setThumbnail(null); setThumbnailPreview(''); setShowForm(true); };
  const openEdit = (project) => {
    reset({ ...project, techStack: project.techStack?.join(', '), thumbnailUrl: project.thumbnail?.publicId ? '' : (project.thumbnail?.url || '') });
    setEditId(project._id);
    setThumbnailPreview(project.thumbnail?.url || '');
    setShowForm(true);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => { if (data[key] !== undefined) formData.append(key, data[key]); });
      if (thumbnail) formData.append('thumbnail', thumbnail);

      if (editId) { await api.put(`/projects/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Project updated!'); }
      else { await api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); toast.success('Project created!'); }
      setShowForm(false); fetchProjects();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await api.delete(`/projects/${id}`);
    toast.success('Project deleted');
    fetchProjects();
  };

  const statusColors = { completed: 'text-green-400', 'in-progress': 'text-yellow-400', maintained: 'text-blue-400', archived: 'text-gray-400' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-white">Projects Management</h1>
        <button onClick={openAdd} className="btn-neon gap-2 text-sm"><FiPlus className="w-4 h-4" />Add Project</button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl border border-neon-blue/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{editId ? 'Edit Project' : 'Add New Project'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><FiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Thumbnail */}
                <div>
                  <label className="text-slate-400 text-xs block mb-2">Thumbnail Upload</label>
                  <label className="block cursor-pointer mb-3">
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-800 border-2 border-dashed border-white/10 hover:border-neon-blue/40 transition-colors flex items-center justify-center">
                      {thumbnailPreview
                        ? <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                        : <div className="text-center p-4"><FiImage className="w-8 h-8 text-slate-500 mx-auto mb-2" /><p className="text-slate-500 text-xs">Click to upload</p></div>
                      }
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
                  </label>
                  <label className="text-slate-400 text-xs block mb-1">OR Thumbnail URL</label>
                  <input {...register('thumbnailUrl')} className="form-input" placeholder="https://example.com/image.png" onChange={(e) => setThumbnailPreview(e.target.value)} />
                </div>

                {/* Fields */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-slate-400 text-xs mb-1 block">Title *</label>
                    <input {...register('title', { required: true })} className="form-input" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-slate-400 text-xs mb-1 block">Short Description *</label>
                    <input {...register('shortDescription', { required: true })} className="form-input" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Category</label>
                    <select {...register('category')} className="form-input">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Status</label>
                    <select {...register('status')} className="form-input">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">GitHub URL</label>
                    <input {...register('githubLink')} type="url" className="form-input" placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Live Demo URL</label>
                    <input {...register('liveLink')} type="url" className="form-input" placeholder="https://..." />
                  </div>
                  <div className="col-span-2">
                    <label className="text-slate-400 text-xs mb-1 block">Tech Stack (comma-separated)</label>
                    <input {...register('techStack')} className="form-input" placeholder="React, Node.js, MongoDB" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                      <input {...register('isFeatured')} type="checkbox" className="w-4 h-4 accent-neon-blue" />
                      Featured Project
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                      <input {...register('isVisible')} type="checkbox" defaultChecked className="w-4 h-4 accent-neon-blue" />
                      Visible
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Detailed Description *</label>
                <textarea {...register('description', { required: true })} rows={4} className="form-input resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-neon gap-2 text-sm">
                  {saving ? 'Saving...' : <><FiSave className="w-4 h-4" />Save Project</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-neon-outline text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Table */}
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" /></div> : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-slate-500 px-5 py-3">Project</th>
                  <th className="text-left text-xs text-slate-500 px-3 py-3">Category</th>
                  <th className="text-left text-xs text-slate-500 px-3 py-3">Status</th>
                  <th className="text-left text-xs text-slate-500 px-3 py-3">Featured</th>
                  <th className="text-right text-xs text-slate-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-8 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                          {project.thumbnail?.url && <img src={project.thumbnail.url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{project.title}</p>
                          <p className="text-slate-500 text-xs truncate max-w-xs">{project.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><span className="tech-tag capitalize">{project.category}</span></td>
                    <td className="px-3 py-3"><span className={`text-xs capitalize font-medium ${statusColors[project.status] || 'text-slate-400'}`}>{project.status}</span></td>
                    <td className="px-3 py-3"><span className={`text-xs ${project.isFeatured ? 'text-yellow-400' : 'text-slate-600'}`}>{project.isFeatured ? '⭐ Yes' : 'No'}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors"><FiExternalLink className="w-3.5 h-3.5" /></a>}
                        <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg text-slate-400 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors"><FiEdit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteProject(project._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><FiTrash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {projects.length === 0 && <p className="text-center text-slate-500 py-12">No projects yet. Add your first project!</p>}
          </div>
        </div>
      )}
    </div>
  );
}
