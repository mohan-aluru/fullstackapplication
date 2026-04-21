import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 font-sans selection:bg-indigo-500/30 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        {/* Global Toast Notifications */}
        <ToastContainer 
          position="bottom-right" 
          autoClose={4000} 
          hideProgressBar={false} 
          pauseOnHover 
          toastClassName="rounded-xl shadow-xl font-medium"
        />
        
        <footer className="bg-slate-950/50 backdrop-blur-md border-t border-white/10 py-8 text-center text-slate-400 text-sm relative z-50">
          &copy; {new Date().getFullYear()} Smart Campus Events System. All rights reserved.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
