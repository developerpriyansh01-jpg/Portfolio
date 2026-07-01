import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiSend, FiMail, FiPhone, FiMapPin, FiPaperclip } from 'react-icons/fi';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import api from '../../config/api';
import toast from 'react-hot-toast';
import SectionHeader from '../shared/SectionHeader';

const projectTypes = ['', 'web-app', 'mobile-app', 'api', 'ecommerce', 'portfolio', 'other'];
const budgets = ['', '< $500', '$500-$1000', '$1000-$5000', '$5000-$10000', '$10000+', 'Negotiable'];
const timelines = ['', '< 1 week', '1-2 weeks', '1 month', '2-3 months', '3-6 months', '6+ months'];

export default function ContactSection({ profile }) {
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key]) formData.append(key, data[key]);
      });
      if (fileRef.current?.files?.[0]) {
        formData.append('attachment', fileRef.current.files[0]);
      }
      await api.post('/contact', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success("Message sent! I'll reply within 24 hours. 📬");
      reset();
      setFileName('');
      api.post('/analytics/track', { event: 'contact_submit' }).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: FiMail, label: 'Email', value: profile?.email || 'developer.priyansh01@gmail.com', href: `mailto:${profile?.email || 'developer.priyansh01@gmail.com'}` },
    { icon: FiPhone, label: 'Phone', value: profile?.phone || '+91 8619350424', href: `tel:${profile?.phone || '+918619350424'}` },
    { icon: FiMapPin, label: 'Location', value: profile?.location || 'India', href: null },
  ];

  const socials = [
    { icon: FiGithub, href: profile?.github, label: 'GitHub' },
    { icon: FiLinkedin, href: profile?.linkedin, label: 'LinkedIn' },
    { icon: FiTwitter, href: profile?.twitter, label: 'Twitter' },
  ].filter((s) => s.href);

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-neon-blue/4 rounded-full blur-[120px]" />

      <div className="section-container">
        <SectionHeader
          tag="📬 Contact"
          title="Let's Work"
          titleGradient="Together"
          subtitle="Have a project in mind? Let's discuss it. I'm always open to interesting opportunities."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-slate-400 leading-relaxed">
              Whether you have a project in mind, want to discuss a collaboration, or just want to say hello — I'd love to hear from you. I typically respond within 24 hours.
            </p>

            {/* Contact Cards */}
            <div className="space-y-3">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="glass-card-hover flex items-center gap-4 p-4 rounded-2xl">
                  <div className="w-11 h-11 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-neon-blue" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{label}</p>
                    {href ? (
                      <a href={href} className="text-white text-sm font-medium hover:text-neon-blue transition-colors">{value}</a>
                    ) : (
                      <p className="text-white text-sm font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="text-slate-500 text-sm mb-3">Connect with me</p>
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-neon-blue hover:border-neon-blue/30 transition-all"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input {...register('name', { required: 'Name required' })} placeholder="Your Name *" className="form-input" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} type="email" placeholder="Email Address *" className="form-input" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <input {...register('phone')} type="tel" placeholder="Phone (Optional)" className="form-input" />
                <div>
                  <input {...register('subject', { required: 'Subject required' })} placeholder="Subject *" className="form-input" />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                </div>
                <select {...register('projectType')} className="form-input">
                  <option value="">Project Type</option>
                  {projectTypes.slice(1).map((t) => <option key={t} value={t}>{t.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </select>
                <select {...register('budget')} className="form-input">
                  <option value="">Budget Range</option>
                  {budgets.slice(1).map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <select {...register('timeline')} className="form-input sm:col-span-2">
                  <option value="">Timeline</option>
                  {timelines.slice(1).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <textarea {...register('message', { required: 'Message required', maxLength: { value: 2000, message: 'Max 2000 chars' } })} rows={5} placeholder="Your message... *" className="form-input resize-none" />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {/* File Upload */}
              <div>
                <label
                  htmlFor="contact-file"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/15 text-slate-400 text-sm cursor-pointer hover:border-neon-blue/40 hover:text-neon-blue transition-colors"
                >
                  <FiPaperclip className="w-4 h-4" />
                  {fileName || 'Attach a file (optional, max 5MB)'}
                </label>
                <input
                  id="contact-file"
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="btn-neon w-full justify-center py-3.5"
              >
                {submitting
                  ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</span>
                  : <span className="flex items-center gap-2"><FiSend className="w-4 h-4" />Send Message</span>
                }
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
