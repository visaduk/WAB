import { MessageSquare, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: MessageSquare, label: 'Conversations', path: '/' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-16 bg-gray-900 flex flex-col items-center py-4 gap-2">
      {/* Logo */}
      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4">
        W
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            title={label}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
              location.pathname === path
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Icon size={22} />
          </button>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-medium">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <button
          onClick={logout}
          title="Logout"
          className="w-12 h-12 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
