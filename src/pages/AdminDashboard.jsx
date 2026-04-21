import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Users, X } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('');
  
  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  // Event Form State
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', department: '', type: 'Workshop', capacity: 50
  });

  // Attendees State
  const [attendees, setAttendees] = useState([]);
  const [activeEventTitle, setActiveEventTitle] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      window.location.href = '/login';
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'ROLE_ADMIN') {
        toast.error('Unauthorized Access! You must be an admin.');
        window.location.href = '/dashboard';
        return;
      }
      setAdminName(user.name?.split(' ')[0] || 'Mohan'); // Use first name or fallback
    } catch (e) {
      window.location.href = '/login';
      return;
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEventModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date.slice(0, 16),
        department: event.department,
        type: event.type,
        capacity: event.capacity
      });
    } else {
      setEditingEvent(null);
      setFormData({ title: '', description: '', date: '', department: '', type: 'Workshop', capacity: 50 });
    }
    setIsEventModalOpen(true);
  };

  const handleCreateOrUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent.id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Event updated successfully');
      } else {
        await api.post('/admin/events', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Event created successfully');
      }
      setIsEventModalOpen(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Event deleted');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  const handleViewAttendees = async (event) => {
    try {
      setActiveEventTitle(event.title);
      const res = await api.get(`/admin/events/${event.id}/registrations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAttendees(res.data);
      setIsAttendeesModalOpen(true);
    } catch (err) {
      toast.error('Failed to load attendees');
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-indigo-300 font-medium tracking-wide text-sm mb-1 uppercase">Welcome back, {adminName}</p>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <button 
          onClick={() => handleOpenEventModal()}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 shadow-sm flex items-center font-medium transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Event
        </button>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/20 border-b border-white/10 text-slate-300 font-medium">
              <tr>
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-center">Registrations</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Loading events...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">No events found. Start by creating one!</td>
                </tr>
              ) : (
                events.map(event => (
                  <tr key={event.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-100 max-w-[200px] truncate">{event.title}</td>
                    <td className="px-6 py-4 text-slate-300">{format(new Date(event.date), 'MMM d, yyyy h:mm a')}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-xs font-semibold border border-slate-700">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${event.registeredCount >= event.capacity ? 'text-red-400' : 'text-indigo-400'}`}>
                        {event.registeredCount || 0}
                      </span>
                      <span className="text-white/40 mx-1">/</span>
                      <span className="text-slate-300">{event.capacity}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => handleViewAttendees(event)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Attendees"
                      >
                        <Users className="h-5 w-5 inline" />
                      </button>
                      <button 
                        onClick={() => handleOpenEventModal(event)}
                        className="text-orange-500 hover:text-orange-700 p-1"
                        title="Edit Event"
                      >
                        <Edit2 className="h-5 w-5 inline" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Event"
                      >
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EVENT FORM MODAL */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl bg-slate-900/90 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h3 className="text-lg font-bold text-white">{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Event Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded-lg px-4 py-2 bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-lg px-4 py-2 bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Date & Time</label>
                  <input required type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full rounded-lg px-4 py-2 bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md text-white" style={{colorScheme: 'dark'}} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Capacity</label>
                  <input required type="number" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full rounded-lg px-4 py-2 bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Department</label>
                  <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full rounded-lg px-4 py-2 bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full rounded-lg px-4 py-2 bg-black/20 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none backdrop-blur-md [&>option]:bg-slate-800">
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-5 py-2 text-slate-300 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium shadow-sm transition-colors">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ATTENDEES MODAL */}
      {isAttendeesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl bg-slate-900/90 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <div>
                <h3 className="text-lg font-bold text-white">Registration List</h3>
                <p className="text-sm text-slate-400">{activeEventTitle}</p>
              </div>
              <button onClick={() => setIsAttendeesModalOpen(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-0 overflow-y-auto flex-1">
              {attendees.length === 0 ? (
                <div className="p-10 text-center text-slate-400 font-medium">No one has registered for this event yet.</div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {attendees.map((reg, index) => (
                    <li key={reg.id} className="p-4 flex items-center hover:bg-white/5 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-100">{reg.user.name}</p>
                        <p className="text-sm text-slate-400">{reg.user.email}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${reg.status === 'REGISTERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                          {reg.status}
                        </span>
                        <p className="text-xs text-slate-400 mt-1">{format(new Date(reg.registrationDate), 'MMM d, h:mm a')}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
