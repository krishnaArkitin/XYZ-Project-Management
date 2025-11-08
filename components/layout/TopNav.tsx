import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BellIcon, LogoutIcon, SearchIcon, SettingsIcon } from '../icons/Icons';

const TopNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) return null;

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center">
        <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full md:w-80 pl-10 pr-4 py-2.5 text-sm bg-slate-100 border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
            />
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 focus:outline-none p-1 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="User avatar" />
             <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role}</p>
              </div>
          </button>
          {dropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-3 border-b border-slate-200">
                     <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                     <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                <a href="#" className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200">
                    <SettingsIcon />
                    <span className="ml-2">Account Settings</span>
                </a>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogoutIcon />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;