import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CalendarDays, Mail, Lock, User, GraduationCap } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl px-8 py-10 rounded-3xl">
          <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
            <div className="h-16 w-16 bg-indigo-500/20 text-indigo-300 flex items-center justify-center rounded-2xl mb-4 shadow-sm border border-indigo-500/30">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
              Create Account
            </h2>
            <p className="mt-2 text-center text-sm text-slate-300">
              Join the campus community
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="appearance-none block w-full pl-10 px-3 py-3 rounded-xl sm:text-sm bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} minLength={6}
                  className="appearance-none block w-full pl-10 px-3 py-3 rounded-xl sm:text-sm bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Account Type</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-slate-400" />
                </div>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="appearance-none block w-full pl-10 px-3 py-3 rounded-xl sm:text-sm bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md [&>option]:bg-slate-800"
                >
                  <option value="student">Student</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/20">
            <p className="text-sm text-slate-300">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
