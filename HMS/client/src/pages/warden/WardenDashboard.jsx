import useAuthStore from '../../store/authStore';
import useAppStore from '../../store/appStore';
import { Users, ClipboardList, MessageSquare } from 'lucide-react';

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

const WardenDashboard = () => {
  const { user } = useAuthStore();
  const { users, leaves, complaints } = useAppStore();

  const blockStudents = users.filter(u => u.role === 'student'); // Mock: all for now
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const openComplaints = complaints.filter(c => c.status === 'open').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Warden Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.name}. Here is your block's status.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Students in Block" value={blockStudents.length} icon={Users} color="bg-indigo-500" />
        <StatCard title="Pending Leaves" value={pendingLeaves} icon={ClipboardList} color="bg-orange-500" />
        <StatCard title="Open Complaints" value={openComplaints} icon={MessageSquare} color="bg-red-500" />
      </div>
    </div>
  );
};

export default WardenDashboard;
