import useAppStore from '../../store/appStore';
import { Users, Home, ClipboardList, CreditCard } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
    <div className={`p-4 rounded-full ${color} text-white mr-4`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { users, rooms, leaves, fees } = useAppStore();

  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalRooms = rooms.length;
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const totalFeesCollected = fees.filter(f => f.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Overview</h2>
        <p className="mt-1 text-sm text-gray-500">A high-level view of the entire hostel system.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={totalStudents} icon={Users} color="bg-blue-500" />
        <StatCard title="Total Rooms" value={totalRooms} icon={Home} color="bg-indigo-500" />
        <StatCard title="Pending Leaves" value={pendingLeaves} icon={ClipboardList} color="bg-orange-500" />
        <StatCard title="Fees Collected" value={`$${totalFeesCollected}`} icon={CreditCard} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">No recent activity.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
