import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { 
  LayoutDashboard, Users, Home, ClipboardList, 
  MessageSquare, Bell, CreditCard, LogOut, Menu, X
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'Hostels & Rooms', path: '/admin/hostels', icon: Home },
          { name: 'Fees', path: '/admin/fees', icon: CreditCard },
          { name: 'Notices', path: '/admin/notices', icon: Bell },
        ];
      case 'warden':
        return [
          { name: 'Dashboard', path: '/warden', icon: LayoutDashboard },
          { name: 'Attendance', path: '/warden/attendance', icon: ClipboardList },
          { name: 'Leaves', path: '/warden/leaves', icon: Home }, // Using Home as placeholder for leave
          { name: 'Complaints', path: '/warden/complaints', icon: MessageSquare },
          { name: 'Notices', path: '/warden/notices', icon: Bell },
        ];
      case 'student':
        return [
          { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
          { name: 'My Room', path: '/student/room', icon: Home },
          { name: 'Leave Application', path: '/student/leave', icon: ClipboardList },
          { name: 'Complaints', path: '/student/complaints', icon: MessageSquare },
          { name: 'Fees', path: '/student/fees', icon: CreditCard },
          { name: 'Notices', path: '/student/notices', icon: Bell },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 bg-primary-600 text-white">
          <span className="text-xl font-bold">HMS Portal</span>
          <button className="lg:hidden text-white hover:text-gray-200" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/admin' || link.path === '/warden' || link.path === '/student'}
                  className={({ isActive }) => clsx(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                    isActive 
                      ? "bg-primary-50 text-primary-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={clsx(
                        "flex-shrink-0 w-5 h-5 mr-3 transition-colors",
                        isActive ? "text-primary-700" : "text-gray-400 group-hover:text-gray-500"
                      )} />
                      {link.name}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
