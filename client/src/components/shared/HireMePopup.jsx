import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiX, FiSend } from 'react-icons/fi';
import api from '../../config/api';
import toast from 'react-hot-toast';

const projectTypes = ['web-app', 'mobile-app', 'api', 'ecommerce', 'portfolio', 'consulting', 'other'];
const budgets = ['< $500', '$500-$1000', '$1000-$5000', '$5000-$10000', '$10000+', 'Negotiable'];
const timelines = ['< 1 week', '1-2 weeks', '1 month', '2-3 months', '3-6 months', '6+ months'];

export default function HireMePopup({ isOpen, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post('/hire', data);
      toast.success("🚀 Hire request sent! I'll contact you within 24 hours.");
      reset();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Modal Wrapper */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl pointer-events-auto custom-scrollbar"
            >
            <div className="glass-card p-6 sm:p-8 border border-neon-purple/20">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading font-bold text-2xl text-white">
                    🚀 Hire <span className="gradient-text">Me</span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-0.5">Let's build something amazing together</p>
                </div>
                <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Your Name *"
                      className="form-input"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <input
                      {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                      type="email"
                      placeholder="Email Address *"
                      className="form-input"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <input {...register('phone')} type="tel" placeholder="Phone Number" className="form-input" />
                  </div>
                  <div>
                    <input {...register('company')} placeholder="Company (Optional)" className="form-input" />
                  </div>
                  <div>
                    <select {...register('projectType', { required: 'Select project type' })} className="form-input">
                      <option value="">Project Type *</option>
                      {projectTypes.map((t) => <option key={t} value={t}>{t.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                    </select>
                    {errors.projectType && <p className="text-red-400 text-xs mt-1">{errors.projectType.message}</p>}
                  </div>
                  <div>
                    <select {...register('budget')} className="form-input">
                      <option value="">Budget Range</option>
                      {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <select {...register('timeline')} className="form-input">
                      <option value="">Timeline</option>
                      {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={4}
                      placeholder="Describe your project... *"
                      className="form-input resize-none"
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-neon w-full justify-center py-3.5 text-base"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><FiSend className="w-4 h-4" /> Send Hire Request</span>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
