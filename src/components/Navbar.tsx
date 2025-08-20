import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, FolderIcon, CogIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Projects', href: '/', icon: FolderIcon },
    { name: 'Users', href: '/users', icon: HomeIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">IT</span>
                </div>
                <span className="ml-3 text-xl font-semibold text-gray-900">Issue Tracker</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
