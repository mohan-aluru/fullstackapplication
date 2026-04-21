import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import EventCard from '../components/EventCard';
import { Search, Compass } from 'lucide-react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  let userRole = null;
  if (token) {
    try {
      userRole = jwtDecode(token).role;
    } catch (e) {
      localStorage.removeItem('token');
    }
  }

  useEffect(() => {
    fetchEvents();
    if (isLoggedIn && userRole === 'ROLE_STUDENT') {
      fetchMyRegistrations();
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const savedToken = localStorage.getItem('token');
      const res = await api.get('/student/my-events', {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      const ids = new Set(res.data.map(reg => reg.event.id));
      setRegisteredIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (eventId) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (userRole === 'ROLE_ADMIN') {
      toast.info('Admins manage events from the dashboard.');
      return;
    }

    setProcessingId(eventId);
    try {
      await api.post(`/student/register/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Successfully registered for the event!');
      setRegisteredIds(prev => new Set(prev).add(eventId));
      fetchEvents(); // update counts
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register.');
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
      const updated = new Set(registeredIds);
      updated.delete(eventId);
      setRegisteredIds(updated);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to unregister.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || e.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Empower Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">College Journey</span>
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 mb-10 leading-relaxed">
              Discover workshops, seminars, and cultural festivals happening around campus. Connect, learn, and grow with Smart Campus.
            </p>
            <div className="flex justify-center max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search for events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-5 pr-12 py-4 rounded-full text-slate-800 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transition-shadow text-lg"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 p-3 rounded-full hover:bg-indigo-700 transition duration-200 shadow-md">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 space-y-4 sm:space-y-0">
          <h2 className="text-3xl font-bold text-slate-900 flex items-center">
            <Compass className="h-8 w-8 text-indigo-600 mr-3" />
            Upcoming Events
          </h2>
          
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {['All', 'Workshop', 'Seminar', 'Cultural'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-5 py-2 rounded-full font-medium transition-all whitespace-nowrap shadow-sm ${
                  filterType === type 
                  ? 'bg-indigo-600 text-white shadow-indigo-200' 
                  : 'bg-white text-slate-600 hover:bg-indigo-50 border border-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onRegister={handleRegister}
                onUnregister={handleUnregister}
                registrationStatus={registeredIds.has(event.id) ? 'REGISTERED' : null}
                isBusy={processingId === event.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Compass className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No events found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              We couldn't find any events matching your search or filters. Try adjusting your criteria.
            </p>
            <button 
              onClick={() => {setSearchTerm(''); setFilterType('All');}}
              className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

      </section>
    </div>
  );
}
