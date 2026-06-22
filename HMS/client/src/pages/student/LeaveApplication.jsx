import { useState } from 'react';
import useAppStore from '../../store/appStore';
import useAuthStore from '../../store/authStore';
import { Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

const LeaveApplication = () => {
  const { user } = useAuthStore();
  const { leaves, addLeave } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ startDate: '', endDate: '', reason: '' });

  const myLeaves = leaves.filter(l => l.studentRef === user.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addLeave({ ...formData, studentRef: user.uid });
    setIsModalOpen(false);
    setFormData({ startDate: '', endDate: '', reason: '' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Applications</h2>
          <p className="mt-1 text-sm text-gray-500">Apply for leave and track the status.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Apply Leave
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {myLeaves.length > 0 ? myLeaves.map((leave) => (
            <li key={leave.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{leave.reason}</h3>
                    <div className="flex items-center">
                      {getStatusIcon(leave.status)}
                      <span className={`ml-2 text-sm font-medium capitalize 
                        ${leave.status === 'approved' ? 'text-green-600' : 
                          leave.status === 'rejected' ? 'text-red-600' : 'text-orange-600'}`}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex space-x-4">
                    <span>From: {leave.startDate}</span>
                    <span>To: {leave.endDate}</span>
                  </div>
                </div>
              </div>
            </li>
          )) : (
            <li className="p-6 text-center text-gray-500">No leave applications found.</li>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Apply for Leave</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="date" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reason</label>
                      <textarea required rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Submit Application
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApplication;
