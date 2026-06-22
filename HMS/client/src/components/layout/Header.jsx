import { Menu, Bell } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Header = ({ onMenuClick }) => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none p-2 -ml-2 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {user?.role} Portal
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-gray-500 relative p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          <Bell className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
