import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiTrash2, FiEye, FiCheck, FiX, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../../config/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  new: 'bg-blue-500/15 text-blue-400',
  read: 'bg-slate-500/15 text-slate-400',
  replied: 'bg-green-500/15 text-green-400',
  archived: 'bg-gray-500/15 text-gray-400',
  spam: 'bg-red-500/15 text-red-400',
};

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchMessages = async () => {
    const { data } = await api.get('/contact');
    setMessages(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/contact/${id}/status`, { status });
    toast.success(`Marked as ${status}`);
    fetchMessages();
    if (selectedMessage?._id === id) setSelectedMessage((m) => ({ ...m, status }));
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    await api.delete(`/contact/${id}`);
    toast.success('Message deleted');
    setSelectedMessage(null);
    fetchMessages();
  };

  const openMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'new') await updateStatus(msg._id, 'read');
  };

  const filtered = messages.filter((m) => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.subject?.toLowerCase().includes(search.toLowerCase()) && !m.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-white">Messages</h1>
          <p className="text-slate-400 text-sm mt-0.5">{messages.filter((m) => m.status === 'new').length} new messages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Message List */}
        <div className="glass-card rounded-2xl overflow-hidden flex flex-col xl:col-span-1">
          {/* Filters */}
          <div className="p-4 border-b border-white/5 space-y-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="form-input pl-9 text-sm py-2" />
            </div>
            <div className="flex gap-1 flex-wrap">
              {['all', 'new', 'read', 'replied', 'archived'].map((s) => (
                <button key={s} onClick={() => setFilter(s)} className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-neon-blue/20 text-neon-blue' : 'text-slate-500 hover:text-white'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" /></div> : (
              filtered.map((msg) => (
                <button key={msg._id} onClick={() => openMessage(msg)}
                  className={`w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/3 ${selectedMessage?._id === msg._id ? 'bg-neon-blue/5' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {msg.status === 'new' && <span className="w-2 h-2 rounded-full bg-neon-blue shrink-0 animate-pulse" />}
                      <p className={`text-sm font-medium ${msg.status === 'new' ? 'text-white' : 'text-slate-300'} truncate`}>{msg.name}</p>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[msg.status] || STATUS_COLORS.read}`}>{msg.status}</span>
                  </div>
                  <p className="text-slate-400 text-xs truncate">{msg.subject}</p>
                  <p className="text-slate-600 text-xs mt-0.5">{new Date(msg.createdAt).toLocaleDateString()}</p>
                </button>
              ))
            )}
            {!loading && filtered.length === 0 && <p className="text-center text-slate-500 text-sm py-8">No messages found</p>}
          </div>
        </div>

        {/* Message Detail */}
        <div className="glass-card rounded-2xl xl:col-span-2 overflow-hidden flex flex-col">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">{selectedMessage.subject || '(No subject)'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-slate-400 text-sm">{selectedMessage.name}</p>
                    <span className="text-slate-600">•</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-neon-blue text-sm hover:underline">{selectedMessage.email}</a>
                  </div>
                  {selectedMessage.phone && <p className="text-slate-500 text-xs mt-0.5">📞 {selectedMessage.phone}</p>}
                </div>
                <div className="flex gap-2">
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} onClick={() => updateStatus(selectedMessage._id, 'replied')} className="btn-neon text-xs px-3 py-1.5">Reply</a>
                  <button onClick={() => updateStatus(selectedMessage._id, 'archived')} className="btn-neon-outline text-xs px-3 py-1.5">Archive</button>
                  <button onClick={() => deleteMessage(selectedMessage._id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {/* Meta info */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {selectedMessage.projectType && <div className="glass-card p-3 rounded-xl"><p className="text-slate-500 text-xs">Project Type</p><p className="text-white text-sm capitalize">{selectedMessage.projectType}</p></div>}
                  {selectedMessage.budget && <div className="glass-card p-3 rounded-xl"><p className="text-slate-500 text-xs">Budget</p><p className="text-white text-sm">{selectedMessage.budget}</p></div>}
                  {selectedMessage.timeline && <div className="glass-card p-3 rounded-xl"><p className="text-slate-500 text-xs">Timeline</p><p className="text-white text-sm">{selectedMessage.timeline}</p></div>}
                  <div className="glass-card p-3 rounded-xl"><p className="text-slate-500 text-xs">Received</p><p className="text-white text-sm">{new Date(selectedMessage.createdAt).toLocaleString()}</p></div>
                </div>
                {/* Message body */}
                <div className="bg-white/3 rounded-xl p-4">
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                {selectedMessage.attachment?.url && (
                  <a href={selectedMessage.attachment.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-3 text-neon-blue text-sm hover:underline">
                    📎 View Attachment
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FiMail className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
