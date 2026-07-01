import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import logoImg from '/logo2.jpeg';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (!loading && isAuthenticated) navigate('/admin');
  }, [isAuthenticated, loading, navigate]);

  const onSubmit = async ({ email, password }) => {
    const result = await login(email, password);
    if (result.success) navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #04041a, #0a0a2e, #0f0f4a)' }}>

      {/* Background */}
      <div className="absolute inset-0 animated-grid opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/8 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 rounded-2xl border border-white/10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }}>
              <img 
                src={logoImg} 
                alt="Logo" 
                className="w-auto h-12 mb-4 object-contain" 
                style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.4))' }}
              />
            </motion.div>
            <h1 className="font-heading font-bold text-2xl text-white">Admin Login</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
                  type="email"
                  placeholder="Admin Email"
                  className="form-input pl-10"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  placeholder="Password"
                  className="form-input pl-10"
                  autoComplete="current-password"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-neon w-full justify-center py-3.5 mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2"><FiLogIn className="w-4 h-4" />Sign In</span>
              )}
            </motion.button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-6">
            Protected by JWT Authentication & Rate Limiting
          </p>
        </div>
      </motion.div>
    </div>
  );
}
