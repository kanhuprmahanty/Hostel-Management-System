import { useState } from 'react';
import useAppStore from '../../store/appStore';
import { Plus, Trash2, CreditCard, CheckCircle, Clock, X, DollarSign } from 'lucide-react';

const FEE_TYPES = ['hostel', 'mess', 'electricity', 'maintenance', 'other'];

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

const FeeManagement = () => {
  const { fees, users, addFee, payFee, deleteFee } = useAppStore();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [form, setForm] = useState({ studentRef: '', amount: '', dueDate: '', type: 'hostel', description: '' });

  const students = users.filter((u) => u.role === 'student');
  const getStudentName = (uid) => students.find((s) => s.uid === uid)?.name || 'Unknown';

  const filtered = fees.filter((f) => filterStatus === 'all' || f.status === filterStatus);
  const totalPaid = fees.filter((f) => f.status === 'paid').reduce((s, f) => s + Number(f.amount), 0);
  const totalPending = fees.filter((f) => f.status === 'pending').reduce((s, f) => s + Number(f.amount), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addFee({ ...form, amount: Number(form.amount) });
      setModal(false);
      setForm({ studentRef: '', amount: '', dueDate: '', type: 'hostel', description: '' });
    } finally { setLoading(false); }
  };

  const handlePay = async (id) => { setLoading(true); try { await payFee(id); } finally { setLoading(false); } };
  const handleDelete = async (id) => { if (window.confirm('Delete this fee record?')) await deleteFee(id); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fee Management</h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage all student fee records.</p>
        </div>
        <button onClick={() => setModal(true)} className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Fee Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
          <div><p className="text-sm text-gray-500">Total Collected</p><p className="text-2xl font-bold text-gray-900">₹{totalPaid.toLocaleString()}</p></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6 text-orange-500" /></div>
          <div><p className="text-sm text-gray-500">Total Pending</p><p className="text-2xl font-bold text-gray-900">₹{totalPending.toLocaleString()}</p></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center"><CreditCard className="w-6 h-6 text-primary-600" /></div>
          <div><p className="text-sm text-gray-500">Total Records</p><p className="text-2xl font-bold text-gray-900">{fees.length}</p></div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'paid'].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filterStatus === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{s}</button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Student', 'Type', 'Description', 'Amount', 'Due Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No fee records found.</td></tr>
              ) : filtered.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">{getStudentName(fee.studentRef).charAt(0)}</div>
                      <span className="text-sm font-medium text-gray-900">{getStudentName(fee.studentRef)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="capitalize text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{fee.type}</span></td>
                  <td className="px-5 py-3 text-sm text-gray-500 max-w-xs truncate">{fee.description || '—'}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900">₹{Number(fee.amount).toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{fee.dueDate || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${fee.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{fee.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {fee.status === 'pending' && (
                        <button onClick={() => handlePay(fee.id)} disabled={loading} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> Pay
                        </button>
                      )}
                      <button onClick={() => handleDelete(fee.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title="Add Fee Record" onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
              <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={form.studentRef} onChange={(e) => setForm({ ...form, studentRef: e.target.value })}>
                <option value="">-- Select Student --</option>
                {students.map((s) => <option key={s.uid} value={s.uid}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {FEE_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input type="number" min="1" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Hostel fee for May 2026" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-60">{loading ? 'Saving...' : 'Add Fee'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FeeManagement;
