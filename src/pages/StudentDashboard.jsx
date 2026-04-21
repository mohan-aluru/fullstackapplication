import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import EventCard from '../components/EventCard';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Map } from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('registered');
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [studentName, setStudentName] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      navigate('/login');
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'ROLE_STUDENT') {
        navigate('/admin');
        return;
      }
      setStudentName(user.name?.split(' ')[0] || 'Student');
    } catch (e) {
      navigate('/login');
      return;
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allEventsRes, myRegRes] = await Promise.all([
        api.get('/events'),
        api.get('/student/my-events', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      setEvents(allEventsRes.data);
      setRegisteredEvents(myRegRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    setProcessingId(eventId);
    try {
      await api.post(`/student/register/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Successfully registered!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnregister = async (eventId) => {
    setProcessingId(eventId);
    try {
      await api.delete(`/student/unregister/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Successfully unregistered.');
      fetchData();
    } catch (err) {
      toast.error('Failed to unregister.');
    } finally {
      setProcessingId(null);
    }
  };

  const registeredEventIds = new Set(registeredEvents.map(r => r.event.id));

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex items-center mb-10">
        <div className="bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)] p-3 rounded-2xl mr-5 border border-indigo-500/30">
          <LayoutDashboard className="h-8 w-8 text-indigo-300" />
        </div>
        <div>
          <p className="text-indigo-300 font-medium tracking-wide text-sm mb-1 uppercase">Welcome back, {studentName}</p>
          <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
          <p className="text-indigo-200 mt-1">Manage your event registrations and discover new opportunities.</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl p-1 rounded-xl w-full sm:w-max mb-8">
        <button
          onClick={() => setActiveTab('registered')}
          className={`flex-1 sm:w-48 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center ${
            activeTab === 'registered' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <CalendarCheck className="h-4 w-4 mr-2" />
          My Registrations
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 sm:w-48 py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center ${
            activeTab === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Map className="h-4 w-4 mr-2" />
          Campus Events
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
          {activeTab === 'registered' ? (
            registeredEvents.length > 0 ? (
              registeredEvents.map(reg => (
                <EventCard 
                  key={reg.event.id}
                  event={reg.event}
                  registrationStatus="REGISTERED"
                  onUnregister={handleUnregister}
                  isBusy={processingId === reg.event.id}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl">
                <p className="text-lg text-slate-300 font-medium">You haven't registered for any events yet!</p>
                <button onClick={() => setActiveTab('all')} className="mt-4 text-indigo-400 font-bold hover:text-indigo-300 underline">
                  Browse Campus Events
                </button>
              </div>
            )
          ) : (
            events.map(event => (
              <EventCard 
                key={event.id}
                event={event}
                registrationStatus={registeredEventIds.has(event.id) ? 'REGISTERED' : null}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
                isBusy={processingId === event.id}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
