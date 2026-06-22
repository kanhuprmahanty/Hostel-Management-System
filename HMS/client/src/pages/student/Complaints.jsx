import { useState } from 'react';
import useAppStore from '../../store/appStore';
import useAuthStore from '../../store/authStore';
import { Plus, CheckCircle, Clock, Check, X } from 'lucide-react';

const Complaints = () => {
  const { user } = useAuthStore();
  const { complaints, addComplaint } = useAppStore();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ type: 'plumbing', description: '' });

  const myComplaints = complaints.filter(c => c.studentRef === user.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addComplaint({ ...form, studentRef: user.uid });
      setModal(false);
      setForm({ type: 'plumbing', description: '' });
    } finally { setLoading(false); }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-orange-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Complaints</h2>
          <p className="text-sm text-gray-500 mt-1">Raise and track issues regarding your room or hostel.</p>
        </div>
        <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> Raise Complaint
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {myComplaints.length === 0 ? (
            <li className="p-12 text-center text-gray-400">No complaints raised.</li>
          ) : myComplaints.map(complaint => (
            <li key={complaint.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="capitalize text-sm font-medium text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-100">{complaint.type}</span>
                    <span className="text-xs text-gray-400">{complaint.createdAt}</span>
                  </div>
                  <p className="text-gray-800 text-sm mt-2">{complaint.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(complaint.status)}
                    <span className={`text-sm font-semibold capitalize ${complaint.status === 'resolved' ? 'text-green-600' : complaint.status === 'in-progress' ? 'text-orange-600' : 'text-gray-500'}`}>
                      {complaint.status}
                    </span>
                  </div>
                  {complaint.resolvedAt && (
                    <span className="text-xs text-gray-400 mt-1">Resolved: {complaint.resolvedAt}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Raise Complaint</h3>
              <button onClick={() => setModal(false)} className="p-1 rounded-full hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="cleaning">Cleaning / Housekeeping</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="internet">Internet / WiFi</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Explain the issue..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-60">{loading ? 'Submitting...' : 'Submit Complaint'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
