import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CalendarDays, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ id: res.data.id, name: res.data.name, email: res.data.email, role: res.data.role }));
      
      toast.success('Successfully logged in!');
      if (res.data.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl px-8 py-10 rounded-3xl">
          <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-indigo-500/20 text-indigo-300 flex items-center justify-center rounded-2xl mb-4 shadow-sm border border-indigo-500/30">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-slate-300">
              Sign in to manage your campus events
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="appearance-none block w-full pl-10 px-3 py-3 rounded-xl sm:text-sm bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md"
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="appearance-none block w-full pl-10 px-3 py-3 rounded-xl sm:text-sm bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in to account'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1f3c] text-slate-400 rounded-md">New to Smart Campus?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                Create a free account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
