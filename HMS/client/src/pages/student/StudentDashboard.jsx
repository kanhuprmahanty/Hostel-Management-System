import useAuthStore from '../../store/authStore';
import useAppStore from '../../store/appStore';
import { Home, CreditCard, Bell } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { rooms, fees, notices } = useAppStore();

  const myRoom = rooms.find(r => r.id === user?.roomRef);
  const myFees = fees.filter(f => f.studentRef === user?.uid);
  const totalDue = myFees.filter(f => f.status !== 'paid').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Welcome, {user?.name}. Here is your overview.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border-l-4 border-indigo-500">
          <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">My Room</p>
            <p className="text-xl font-bold text-gray-900">{myRoom ? `Room ${myRoom.roomNumber}` : 'Not Allocated'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border-l-4 border-red-500">
          <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Fees</p>
            <p className="text-xl font-bold text-gray-900">${totalDue}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <Bell className="w-5 h-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Recent Notices</h3>
        </div>
        <div className="space-y-4">
          {notices.length > 0 ? notices.map(notice => (
            <div key={notice.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <h4 className="font-medium text-gray-900">{notice.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{notice.content}</p>
              <span className="text-xs text-gray-400 mt-2 block">{notice.createdAt}</span>
            </div>
          )) : (
            <p className="text-sm text-gray-500">No new notices.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
