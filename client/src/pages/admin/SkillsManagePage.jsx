import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import api from '../../config/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['frontend', 'backend', 'database', 'devops', 'tools', 'languages', 'other'];

export default function SkillsManagePage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ defaultValues: { proficiency: 80, color: '#00d4ff', category: 'frontend', iconType: 'reacticon' } });

  const fetchSkills = async () => {
    const { data } = await api.get('/skills/all');
    setSkills(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const openAdd = () => { reset({ proficiency: 80, color: '#00d4ff', category: 'frontend', iconType: 'reacticon' }); setEditId(null); setShowForm(true); };
  const openEdit = (skill) => { reset(skill); setEditId(skill._id); setShowForm(true); };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editId) { await api.put(`/skills/${editId}`, data); toast.success('Skill updated!'); }
      else { await api.post('/skills', data); toast.success('Skill added!'); }
      setShowForm(false); fetchSkills();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  const deleteSkill = async (id) => {
    if (!confirm('Delete this skill?')) return;
    await api.delete(`/skills/${id}`);
    toast.success('Skill deleted');
    fetchSkills();
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const s = skills.filter((sk) => sk.category === cat);
    if (s.length > 0) acc[cat] = s;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-white">Skills Management</h1>
        <button onClick={openAdd} className="btn-neon gap-2 text-sm">
          <FiPlus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl border border-neon-blue/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{editId ? 'Edit Skill' : 'Add New Skill'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><FiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Skill Name *</label>
                <input {...register('name', { required: true })} className="form-input" placeholder="e.g., React.js" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Category</label>
                <select {...register('category')} className="form-input">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Icon (React Icon name)</label>
                <input {...register('icon')} className="form-input" placeholder="e.g., FaReact" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Proficiency % *</label>
                <input {...register('proficiency', { required: true, min: 0, max: 100 })} type="number" min="0" max="100" className="form-input" />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Color</label>
                <div className="flex gap-2">
                  <input {...register('color')} className="form-input flex-1" placeholder="#00d4ff" />
                  <input type="color" {...register('color')} className="w-11 h-11 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Order</label>
                <input {...register('order')} type="number" className="form-input" />
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit" disabled={saving} className="btn-neon gap-2 text-sm">
                  <FiSave className="w-4 h-4" />{saving ? 'Saving...' : 'Save Skill'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-neon-outline text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills List */}
      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" /></div> : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([cat, catSkills]) => (
            <div key={cat}>
              <h3 className="text-neon-blue text-xs font-semibold uppercase tracking-widest mb-3 capitalize">{cat}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catSkills.map((skill) => (
                  <div key={skill._id} className="glass-card p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: `${skill.color}15` }}>
                        {skill.icon || skill.name?.[0]}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{skill.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${skill.proficiency}%`, background: skill.color || '#00d4ff' }} />
                          </div>
                          <span className="text-xs text-slate-500">{skill.proficiency}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg text-slate-400 hover:text-neon-blue hover:bg-neon-blue/10 transition-colors"><FiEdit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteSkill(skill._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><FiTrash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {skills.length === 0 && <p className="text-center text-slate-500 py-12">No skills yet. Add your first skill!</p>}
        </div>
      )}
    </div>
  );
}
