import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useAppStore from './store/appStore';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './components/layout/MainLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersList from './pages/admin/UsersList';
import WardenDashboard from './pages/warden/WardenDashboard';
import LeaveManagement from './pages/warden/LeaveManagement';
import StudentDashboard from './pages/student/StudentDashboard';
import LeaveApplication from './pages/student/LeaveApplication';
import ComingSoon from './components/ComingSoon';
import HostelsRooms from './pages/admin/HostelsRooms';
import FeeManagement from './pages/admin/FeeManagement';
import NoticeBoard from './pages/notices/NoticeBoard';

import WardenAttendance from './pages/warden/WardenAttendance';
import WardenComplaints from './pages/warden/WardenComplaints';
import StudentRoom from './pages/student/StudentRoom';
import StudentComplaints from './pages/student/Complaints';
import StudentFees from './pages/student/StudentFees';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, authInitialized } = useAuthStore();

  if (!authInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />; // Redirect to their own dashboard
  }

  return children;
};

const RoleBasedRedirect = () => {
  const { user, authInitialized } = useAuthStore();
  
  if (!authInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'warden') return <Navigate to="/warden" replace />;
  if (user?.role === 'student') return <Navigate to="/student" replace />;
  
  return <Navigate to="/login" replace />;
};

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initializeAppData = useAppStore((state) => state.initializeAppData);

  useEffect(() => {
    initializeAuth();
    initializeAppData();
  }, [initializeAuth, initializeAppData]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="hostels" element={<HostelsRooms />} />
          <Route path="fees" element={<FeeManagement />} />
          <Route path="notices" element={<NoticeBoard />} />
        </Route>

        {/* Warden Routes */}
        <Route path="/warden" element={
          <ProtectedRoute allowedRoles={['warden']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<WardenDashboard />} />
          <Route path="leaves" element={<LeaveManagement />} />
          <Route path="attendance" element={<WardenAttendance />} />
          <Route path="complaints" element={<WardenComplaints />} />
          <Route path="notices" element={<NoticeBoard />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['student']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<StudentDashboard />} />
          <Route path="leave" element={<LeaveApplication />} />
          <Route path="room" element={<StudentRoom />} />
          <Route path="complaints" element={<StudentComplaints />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="notices" element={<NoticeBoard />} />
        </Route>

        <Route path="/" element={<RoleBasedRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
