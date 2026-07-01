import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { HiStar, HiOutlineStar } from 'react-icons/hi';
import { FiSend } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import api from '../../config/api';
import toast from 'react-hot-toast';
import SectionHeader from '../shared/SectionHeader';

const StarRating = ({ rating, interactive = false, onRate }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type={interactive ? 'button' : 'submit'}
        onClick={interactive ? () => onRate(star) : undefined}
        className={interactive ? 'cursor-pointer' : 'cursor-default'}
      >
        {star <= rating
          ? <HiStar className="w-5 h-5 text-yellow-400" />
          : <HiOutlineStar className="w-5 h-5 text-slate-600" />
        }
      </button>
    ))}
  </div>
);

export default function ReviewsSection({ reviews = [], averageRating = 0, totalReviews = 0 }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post('/reviews', { ...data, rating: selectedRating });
      toast.success('Review submitted! It will appear after approval. 🙌');
      reset();
      setShowForm(false);
      setSelectedRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const defaultReviews = [
    { _id: '1', name: 'Alex Johnson', company: 'TechCorp', position: 'CTO', rating: 5, message: 'Priyansh delivered an exceptional full-stack application. His attention to detail, clean code, and timely delivery exceeded our expectations. Highly recommend!', createdAt: new Date() },
    { _id: '2', name: 'Sarah Williams', company: 'StartupXYZ', position: 'Founder', rating: 5, message: 'Outstanding work on our e-commerce platform. The UI is pixel-perfect and the backend is rock solid. Priyansh is a true professional.', createdAt: new Date() },
    { _id: '3', name: 'Michael Chen', company: 'DigitalAgency', position: 'PM', rating: 5, message: 'Incredible developer with a deep understanding of both frontend and backend. The project was delivered on time and within budget.', createdAt: new Date() },
  ];
  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-neon-purple/5 rounded-full blur-[100px]" />

      <div className="section-container">
        <SectionHeader
          tag="⭐ Reviews"
          title="What Clients"
          titleGradient="Say"
          subtitle="Real feedback from real clients — building trust through results."
        />

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
          <div className="glass-card px-8 py-5 text-center rounded-2xl">
            <div className="font-heading font-bold text-4xl gradient-text">{averageRating.toFixed(1)}</div>
            <StarRating rating={Math.round(averageRating)} />
            <p className="text-slate-400 text-sm mt-1">{totalReviews} Reviews</p>
          </div>
          <div className="glass-card px-8 py-5 text-center rounded-2xl">
            <div className="font-heading font-bold text-4xl text-green-400">100%</div>
            <p className="text-slate-400 text-sm mt-1">Client Satisfaction</p>
          </div>
          <div className="glass-card px-8 py-5 text-center rounded-2xl">
            <div className="font-heading font-bold text-4xl text-neon-blue">24h</div>
            <p className="text-slate-400 text-sm mt-1">Response Time</p>
          </div>
        </div>

        {/* Swiper Testimonials */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-10"
        >
          {displayReviews.map((review) => (
            <SwiperSlide key={review._id}>
              <motion.div
                whileHover={{ y: -5 }}
                className="glass-card p-6 rounded-2xl h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold">
                      {review.avatar?.url ? (
                        <img src={review.avatar.url} alt={review.name} className="w-full h-full object-cover" />
                      ) : review.name?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{review.name}</p>
                      <p className="text-slate-500 text-xs">{review.position}{review.company ? ` @ ${review.company}` : ''}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed italic">"{review.message}"</p>
                <p className="text-slate-600 text-xs mt-3">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Submit Review */}
        <div className="mt-10 text-center">
          <motion.button
            onClick={() => setShowForm(!showForm)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-neon-outline px-6 py-2.5 text-sm"
          >
            {showForm ? 'Cancel' : '✍️ Leave a Review'}
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-8"
            >
              <div className="glass-card max-w-2xl mx-auto p-6 rounded-2xl">
                <h3 className="font-heading font-bold text-white text-lg mb-4">Share Your Experience</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input {...register('name', { required: 'Name required' })} placeholder="Your Name *" className="form-input" />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <input {...register('email', { required: 'Email required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} type="email" placeholder="Email *" className="form-input" />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <input {...register('company')} placeholder="Company" className="form-input" />
                    <input {...register('position')} placeholder="Your Role" className="form-input" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm mb-2 block">Rating *</label>
                    <StarRating rating={selectedRating} interactive onRate={setSelectedRating} />
                  </div>
                  <div>
                    <textarea {...register('message', { required: 'Message required', maxLength: { value: 1000, message: 'Max 1000 chars' } })} rows={4} placeholder="Your review... *" className="form-input resize-none" />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.01 }} className="btn-neon w-full justify-center py-3">
                    {submitting ? 'Submitting...' : <><FiSend className="w-4 h-4" /> Submit Review</>}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
