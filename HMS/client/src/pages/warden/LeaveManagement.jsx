import useAppStore from '../../store/appStore';
import useAuthStore from '../../store/authStore';
import { CheckCircle, XCircle } from 'lucide-react';

const LeaveManagement = () => {
  const { user } = useAuthStore();
  const { leaves, users, updateLeaveStatus } = useAppStore();

  // In a real app, we'd filter leaves by students in the warden's hostel
  // For mock data, we just show all leaves
  
  const getStudentName = (uid) => {
    const student = users.find(u => u.uid === uid);
    return student ? student.name : 'Unknown Student';
  };

  const handleStatusChange = async (id, status) => {
    await updateLeaveStatus(id, status, user.uid);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
        <p className="mt-1 text-sm text-gray-500">Review and approve student leave requests.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {leaves.length > 0 ? leaves.map((leave) => (
            <li key={leave.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{getStudentName(leave.studentRef)}</h3>
                      <p className="text-sm font-medium text-gray-900 mt-1">Reason: {leave.reason}</p>
                    </div>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full h-fit
                      ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                      {leave.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex space-x-4">
                    <span>From: {leave.startDate}</span>
                    <span>To: {leave.endDate}</span>
                  </div>
                </div>
                
                {leave.status === 'pending' && (
                  <div className="ml-6 flex items-center space-x-3">
                    <button 
                      onClick={() => handleStatusChange(leave.id, 'approved')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      title="Approve"
                    >
                      <CheckCircle className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleStatusChange(leave.id, 'rejected')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Reject"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            </li>
          )) : (
            <li className="p-6 text-center text-gray-500">No leave requests to review.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LeaveManagement;
