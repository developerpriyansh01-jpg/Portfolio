import { useEffect, useState } from 'react';
import { FiCheck, FiX, FiStar, FiTrash2, FiEye } from 'react-icons/fi';
import { HiStar, HiOutlineStar } from 'react-icons/hi';
import api from '../../config/api';
import toast from 'react-hot-toast';

const StarDisplay = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((s) => s <= rating ? <HiStar key={s} className="w-3.5 h-3.5 text-yellow-400" /> : <HiOutlineStar key={s} className="w-3.5 h-3.5 text-slate-600" />)}
  </div>
);

const STATUS_MAP = {
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  approved: { color: 'text-green-400', bg: 'bg-green-500/10' },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function ReviewsManagePage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchReviews = () => api.get('/reviews/admin/all').then(({ data }) => { setReviews(data.data); setLoading(false); });
  useEffect(() => { fetchReviews(); }, []);

  const approve = async (id) => { await api.patch(`/reviews/${id}/approve`); toast.success('Review approved!'); fetchReviews(); };
  const reject = async (id) => { await api.patch(`/reviews/${id}/reject`); toast.success('Review rejected'); fetchReviews(); };
  const feature = async (id) => { await api.patch(`/reviews/${id}/feature`); toast.success('Featured status toggled'); fetchReviews(); };
  const deleteReview = async (id) => { if (!confirm('Delete?')) return; await api.delete(`/reviews/${id}`); toast.success('Deleted'); fetchReviews(); };

  const filtered = filter === 'all' ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Reviews Management</h1>
          <p className="text-slate-400 text-sm mt-0.5">{reviews.filter(r => r.status === 'pending').length} pending approval</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'glass-card text-slate-400 hover:text-white'}`}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" /></div> : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review._id} className="glass-card p-4 rounded-2xl flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-sm shrink-0">
                {review.avatar?.url ? <img src={review.avatar.url} alt="" className="w-full h-full object-cover rounded-full" /> : review.name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-white text-sm font-medium">{review.name}</p>
                    <p className="text-slate-500 text-xs">{review.email} {review.company ? `• ${review.company}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarDisplay rating={review.rating} />
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_MAP[review.status]?.bg || ''} ${STATUS_MAP[review.status]?.color || ''} capitalize`}>{review.status}</span>
                    {review.isFeatured && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">⭐ Featured</span>}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">"{review.message}"</p>
                <p className="text-slate-600 text-xs mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                {review.status === 'pending' && (
                  <>
                    <button onClick={() => approve(review._id)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-green-400 bg-green-500/10 hover:bg-green-500/20 transition-colors">
                      <FiCheck className="w-3 h-3" /> Approve
                    </button>
                    <button onClick={() => reject(review._id)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors">
                      <FiX className="w-3 h-3" /> Reject
                    </button>
                  </>
                )}
                <button onClick={() => feature(review._id)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors">
                  <FiStar className="w-3 h-3" /> {review.isFeatured ? 'Unfeature' : 'Feature'}
                </button>
                <button onClick={() => deleteReview(review._id)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors">
                  <FiTrash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-slate-500 py-12">No reviews found</p>}
        </div>
      )}
    </div>
  );
}
