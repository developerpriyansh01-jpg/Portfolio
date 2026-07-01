import { useEffect, useState } from 'react';
import { FiActivity, FiUser, FiClock } from 'react-icons/fi';
import api from '../../config/api';

const ACTION_COLORS = {
  create: 'bg-green-500/15 text-green-400',
  update: 'bg-blue-500/15 text-blue-400',
  delete: 'bg-red-500/15 text-red-400',
  login: 'bg-purple-500/15 text-purple-400',
  logout: 'bg-gray-500/15 text-gray-400',
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings/logs?limit=100').then(({ data }) => { setLogs(data.data || []); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl text-white">Activity Logs</h1>
        <p className="text-slate-400 text-sm mt-0.5">Full audit trail of admin actions</p>
      </div>

      {loading ? <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" /></div> : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs text-slate-500 px-5 py-3">Action</th>
                  <th className="text-left text-xs text-slate-500 px-3 py-3">Entity</th>
                  <th className="text-left text-xs text-slate-500 px-3 py-3">Description</th>
                  <th className="text-left text-xs text-slate-500 px-3 py-3">IP Address</th>
                  <th className="text-right text-xs text-slate-500 px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log._id || i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${ACTION_COLORS[log.action] || 'bg-white/10 text-slate-400'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-300 text-sm capitalize">{log.entity}</td>
                    <td className="px-3 py-3 text-slate-400 text-sm max-w-xs truncate">{log.description}</td>
                    <td className="px-3 py-3 text-slate-500 text-xs font-mono">{log.ipAddress || '—'}</td>
                    <td className="px-5 py-3 text-right text-slate-500 text-xs">
                      {new Date(log.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {logs.length === 0 && <div className="flex flex-col items-center py-12 text-slate-500"><FiActivity className="w-8 h-8 mb-2" /><p>No activity yet</p></div>}
          </div>
        </div>
      )}
    </div>
  );
}
