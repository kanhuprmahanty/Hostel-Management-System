import { useState } from 'react';
import useAppStore from '../../store/appStore';
import { MessageSquare, CheckCircle, Clock } from 'lucide-react';

const WardenComplaints = () => {
  const { complaints, users, updateComplaintStatus } = useAppStore();
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter based on status
  const filtered = filterStatus === 'all' ? complaints : complaints.filter(c => c.status === filterStatus);

  const getStudentDetails = (uid) => {
    const student = users.find(u => u.uid === uid);
    return student ? `${student.name} (${student.roomRef || 'No Room'})` : 'Unknown Student';
  };

  const handleStatusChange = async (id, status) => {
    await updateComplaintStatus(id, status);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Complaint Management</h2>
        <p className="mt-1 text-sm text-gray-500">Review and resolve student complaints.</p>
      </div>

      <div className="flex gap-2">
        {['all', 'open', 'in-progress', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filterStatus === s ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filtered.length === 0 ? (
            <li className="p-12 text-center text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No complaints found.</p>
            </li>
          ) : filtered.map(complaint => (
            <li key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="capitalize text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">{complaint.type}</span>
                    <span className="text-xs text-gray-400">{complaint.createdAt}</span>
                    <span className={`capitalize text-xs font-semibold px-2 py-0.5 rounded ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : complaint.status === 'in-progress' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">From: {getStudentDetails(complaint.studentRef)}</p>
                  <p className="text-gray-700 text-sm bg-white p-3 rounded-lg border border-gray-100">{complaint.description}</p>
                </div>
                
                {complaint.status !== 'resolved' && (
                  <div className="flex sm:flex-col gap-2 min-w-[120px]">
                    {complaint.status === 'open' && (
                      <button onClick={() => handleStatusChange(complaint.id, 'in-progress')} className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors border border-orange-100">
                        <Clock className="w-3.5 h-3.5" /> Mark In Progress
                      </button>
                    )}
                    <button onClick={() => handleStatusChange(complaint.id, 'resolved')} className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors border border-green-100">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WardenComplaints;
