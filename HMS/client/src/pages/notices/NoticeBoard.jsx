import { useState } from 'react';
import useAppStore from '../../store/appStore';
import useAuthStore from '../../store/authStore';
import { Plus, Trash2, Bell, X } from 'lucide-react';

const AUDIENCES = ['all', 'student', 'warden'];

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const audienceBadge = (aud) => {
  const map = { all: 'bg-blue-100 text-blue-700', student: 'bg-green-100 text-green-700', warden: 'bg-purple-100 text-purple-700' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[aud] || 'bg-gray-100 text-gray-600'}`}>{aud}</span>;
};

const NoticeBoard = () => {
  const { notices, addNotice, deleteNotice } = useAppStore();
  const { user } = useAuthStore();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterAud, setFilterAud] = useState('all');
  const [form, setForm] = useState({ title: '', content: '', targetAudience: 'all' });

  const canCreate = user?.role === 'admin' || user?.role === 'warden';
  const filtered = filterAud === 'all' ? notices : notices.filter((n) => n.targetAudience === filterAud || n.targetAudience === 'all');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addNotice({ ...form, authorRef: user.uid });
      setModal(false);
      setForm({ title: '', content: '', targetAudience: 'all' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => { if (window.confirm('Delete this notice?')) await deleteNotice(id); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notice Board</h2>
          <p className="text-sm text-gray-500 mt-1">
            {canCreate ? 'Publish and manage hostel notices.' : 'View all published notices.'}
          </p>
        </div>
        {canCreate && (
          <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <Plus className="w-4 h-4" /> Post Notice
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...AUDIENCES.filter((a) => a !== 'all')].map((a) => (
          <button key={a} onClick={() => setFilterAud(a)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filterAud === a ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{a}</button>
        ))}
      </div>

      {/* Notices Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm flex flex-col items-center justify-center py-20 text-gray-400">
          <Bell className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">No notices found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((notice) => (
            <div key={notice.id} className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-primary-500 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                  {audienceBadge(notice.targetAudience)}
                </div>
                {canCreate && (
                  <button onClick={() => handleDelete(notice.id)} className="text-red-400 hover:text-red-600 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{notice.content}</p>
              <p className="text-xs text-gray-400">{typeof notice.createdAt === 'string' ? notice.createdAt : new Date().toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal title="Post New Notice" onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Notice title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Write notice content..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}>
                {AUDIENCES.map((a) => <option key={a} value={a} className="capitalize">{a}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-60">{loading ? 'Posting...' : 'Post Notice'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default NoticeBoard;
