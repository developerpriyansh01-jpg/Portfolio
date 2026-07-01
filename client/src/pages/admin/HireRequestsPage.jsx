import { useEffect, useState } from 'react';
import { FiUsers, FiTrash2 } from 'react-icons/fi';
import api from '../../config/api';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  new: 'bg-blue-500/15 text-blue-400',
  reviewing: 'bg-yellow-500/15 text-yellow-400',
  accepted: 'bg-green-500/15 text-green-400',
  rejected: 'bg-red-500/15 text-red-400',
  negotiating: 'bg-purple-500/15 text-purple-400',
};

export default function HireRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchRequests = () => api.get('/hire').then(({ data }) => { setRequests(data.data); setLoading(false); });
  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/hire/${id}/status`, { status });
    toast.success(`Status → ${status}`);
    fetchRequests();
    if (selected?._id === id) setSelected((r) => ({ ...r, status }));
  };

  const deleteRequest = async (id) => {
    if (!confirm('Delete this hire request?')) return;
    await api.delete(`/hire/${id}`);
    toast.success('Deleted');
    setSelected(null);
    fetchRequests();
  };

  const STATUSES = ['new', 'reviewing', 'accepted', 'rejected', 'negotiating'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Hire Requests</h1>
        <p className="text-slate-400 text-sm mt-0.5">{requests.filter((r) => r.status === 'new').length} new requests</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* List */}
        <div className="glass-card rounded-2xl overflow-hidden xl:col-span-1">
          <div className="p-3 border-b border-white/5">
            <p className="text-slate-400 text-xs font-medium">ALL REQUESTS ({requests.length})</p>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {loading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" /></div> : (
              requests.map((req) => (
                <button key={req._id} onClick={() => setSelected(req)}
                  className={`w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/3 ${selected?._id === req._id ? 'bg-neon-blue/5' : ''}`}>
                  <div className="flex items-start justify-between">
                    <p className="text-white text-sm font-medium">{req.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${STATUS_MAP[req.status] || ''} capitalize`}>{req.status}</span>
                  </div>
                  <p className="text-slate-400 text-xs truncate mt-0.5">{req.email}</p>
                  <div className="flex gap-3 mt-1 text-slate-600 text-[10px]">
                    <span className="capitalize">{req.projectType?.replace('-', ' ')}</span>
                    {req.budget && <><span>•</span><span>{req.budget}</span></>}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="glass-card rounded-2xl xl:col-span-2 overflow-hidden">
          {selected ? (
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-bold text-white text-lg">{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} className="text-neon-blue text-sm">{selected.email}</a>
                  {selected.phone && <p className="text-slate-500 text-xs mt-0.5">📞 {selected.phone}</p>}
                  {selected.company && <p className="text-slate-400 text-sm mt-0.5">🏢 {selected.company}</p>}
                </div>
                <button onClick={() => deleteRequest(selected._id)} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3 rounded-xl"><p className="text-slate-500 text-xs">Project Type</p><p className="text-white text-sm capitalize">{selected.projectType?.replace('-', ' ')}</p></div>
                <div className="glass-card p-3 rounded-xl"><p className="text-slate-500 text-xs">Budget</p><p className="text-white text-sm">{selected.budget || 'Not specified'}</p></div>
                <div className="glass-card p-3 rounded-xl"><p className="text-slate-500 text-xs">Timeline</p><p className="text-white text-sm">{selected.timeline || 'Not specified'}</p></div>
                <div className="glass-card p-3 rounded-xl"><p className="text-slate-500 text-xs">Received</p><p className="text-white text-sm">{new Date(selected.createdAt).toLocaleDateString()}</p></div>
              </div>

              <div className="bg-white/3 rounded-xl p-4">
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div>
                <p className="text-slate-400 text-xs mb-2">Update Status:</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => updateStatus(selected._id, s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${selected.status === s ? `${STATUS_MAP[s]} border border-current` : 'glass-card text-slate-400 hover:text-white'}`}>
                      {s}
                    </button>
                  ))}
                  <a href={`mailto:${selected.email}`} className="btn-neon text-xs px-3 py-1.5">📧 Reply</a>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center"><FiUsers className="w-12 h-12 text-slate-700 mx-auto mb-3" /><p className="text-slate-500">Select a request to view details</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
