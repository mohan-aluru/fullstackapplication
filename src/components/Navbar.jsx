import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, CalendarDays, Settings } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch {
      user = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/50 backdrop-blur-md border-b shadow-sm border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-8 w-8 text-indigo-400" />
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
              Smart Campus
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-slate-300 hover:text-white font-medium transition-colors">
              Discover Events
            </Link>
            
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-slate-300 hover:text-indigo-400 focus:outline-none">
                  <div className="bg-indigo-500/20 p-2 rounded-full border border-indigo-500/30">
                    <UserIcon className="h-5 w-5 text-indigo-300" />
                  </div>
                  <span className="font-medium hidden sm:block">{user.sub || 'Account'}</span>
                </button>

                <div className="absolute right-0 w-48 mt-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl rounded-xl shadow-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div className="px-4 py-3 border-b border-white/10 bg-black/20 rounded-t-xl">
                    <p className="text-sm font-medium text-white truncate">{user.sub}</p>
                    <p className="text-xs text-slate-400 capitalize">{user.role?.replace('ROLE_', '')?.toLowerCase()}</p>
                  </div>
                  <div className="py-1">
                    <Link to={user.role === 'ROLE_ADMIN' ? '/admin' : '/dashboard'} 
                          className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 text-left">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="px-4 py-2 font-medium text-slate-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="px-4 py-2 font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
