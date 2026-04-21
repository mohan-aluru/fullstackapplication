import React from 'react';
import { Calendar, MapPin, Users, Info } from 'lucide-react';
import { format } from 'date-fns';

export default function EventCard({ event, onRegister, onUnregister, registrationStatus, isBusy }) {
  const isFull = event.registeredCount >= event.capacity;
  const isRegistered = registrationStatus === 'REGISTERED';
  
  const getBadgeColor = () => {
    switch(event.type?.toLowerCase()) {
      case 'workshop': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'seminar': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'cultural': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="group bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-xl border-none hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
      <div className={`h-2 w-full ${isRegistered ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor()}`}>
            {event.type}
          </span>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-800/80 rounded-full text-slate-300 border border-slate-700">
            {event.department}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-slate-300 text-sm mb-6 line-clamp-3 flex-1 flex items-start">
          <Info className="h-4 w-4 min-w-[16px] mr-2 inline mt-0.5" />
          {event.description}
        </p>

        <div className="space-y-3 mb-6 bg-black/20 p-4 rounded-xl border border-white/5">
          <div className="flex items-center text-slate-300 text-sm">
            <Calendar className="h-4 w-4 mr-3 text-indigo-400" />
            <span className="font-medium">
              {event.date ? format(new Date(event.date), "MMM d, yyyy h:mm a") : 'TBA'}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-300 text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-3 text-indigo-400" />
              <span>Spots: <strong>{event.registeredCount || 0}</strong> / {event.capacity}</span>
            </div>
            {isFull && !isRegistered && (
              <span className="text-red-400 text-xs font-bold bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded">FULL</span>
            )}
          </div>
        </div>

        <div className="mt-auto">
          {isRegistered ? (
            <button
              onClick={() => onUnregister(event.id)}
              disabled={isBusy}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 hover:shadow-md transition-all flex items-center justify-center disabled:opacity-70"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Registered (Click to Undo)
            </button>
          ) : (
            <button
              onClick={() => onRegister(event.id)}
              disabled={isFull || isBusy}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-white shadow-sm transition-all focus:ring-2 focus:ring-offset-2 flex justify-center items-center ${
                isFull 
                ? 'bg-slate-300 cursor-not-allowed opacity-80' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md focus:ring-indigo-500 active:scale-[0.98]'
              }`}
            >
              {isFull ? 'Registration Closed' : 'Register Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
