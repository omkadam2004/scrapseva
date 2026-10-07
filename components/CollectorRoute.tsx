import React, { useState } from 'react';
import { MapPin, Navigation, Check, Phone, Clock } from 'lucide-react';
import { PickupRequest } from '../types';

interface CollectorRouteProps {
  requests: PickupRequest[];
  onUpdateStatus: (id: string, status: 'accepted' | 'completed') => void;
}

const CollectorRoute: React.FC<CollectorRouteProps> = ({ requests, onUpdateStatus }) => {
  const [isAvailable, setIsAvailable] = useState(true);

  const myRoute = [...requests]
    .filter(r => r.status !== 'completed')
    .sort((a, b) => {
        if (a.status === 'accepted' && b.status !== 'accepted') return -1;
        if (a.status !== 'accepted' && b.status === 'accepted') return 1;
        return (a.distance || 0) - (b.distance || 0);
    });

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-slate-800">Collector Dashboard</h2>
            <p className="text-sm text-slate-500">Logistics Panel</p>
        </div>
        <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                {isAvailable ? 'Available for Jobs' : 'Offline'}
            </span>
            <button 
                onClick={() => setIsAvailable(!isAvailable)}
                className={`w-12 h-6 rounded-full p-1 ${isAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm ${isAvailable ? 'translate-x-6' : ''}`} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center justify-between">
                New Requests Nearby
                <span className="text-xs font-normal text-slate-500">{pendingRequests.length} active</span>
            </h3>
            
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {pendingRequests.map(req => (
                    <div key={req.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-medium text-slate-900">{req.sellerName}</h4>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <MapPin size={12} /> {req.distance?.toFixed(1) || '2.5'} km away
                                </p>
                            </div>
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-md font-medium">
                                ₹{req.totalPrice.toFixed(2)}
                            </span>
                        </div>
                        <div className="text-sm text-slate-600 mb-3">
                            <p className="line-clamp-2">
                                {req.items.map(i => `${i.type} (${i.weightKg}kg)`).join(', ')}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Total: {req.totalWeight}kg</p>
                        </div>
                        <button 
                            onClick={() => onUpdateStatus(req.id, 'accepted')}
                            className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 shadow-sm"
                        >
                            Accept Pickup
                        </button>
                    </div>
                ))}
                {pendingRequests.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center">
                         <img 
                            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Compass.png"
                            alt="Compass"
                            className="w-16 h-16 mb-2 opacity-60"
                         />
                        <p>No new requests in your area.</p>
                    </div>
                )}
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                        <Navigation size={18} className="text-indigo-500" />
                        My Route
                    </h3>
                </div>
                
                <div className="p-6 flex-1 bg-slate-50/50 relative">
                    <div className="relative pl-8 border-l-2 border-indigo-100 space-y-8 z-10">
                        {myRoute.map((req, idx) => (
                            <div key={req.id} className="relative group">
                                <div className={`absolute -left-[41px] w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${req.status === 'accepted' ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                                    <span className="text-[10px] text-white font-bold">{idx + 1}</span>
                                </div>

                                <div className={`p-4 rounded-lg border ${req.status === 'accepted' ? 'bg-white border-indigo-100 shadow-md' : 'bg-slate-100 border-slate-200 opacity-60 grayscale'}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-800">{req.sellerName}</h4>
                                                {idx === 0 && req.status === 'accepted' && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">NEXT STOP</span>}
                                            </div>
                                            <p className="text-sm text-slate-600 flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {req.address}</p>
                                            <p className="text-xs text-indigo-500 mt-1 font-medium flex items-center gap-1">
                                                <Clock size={12} /> Scheduled: {new Date(req.scheduledTime).toLocaleString([], {weekday: 'short', hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {req.status === 'accepted' ? (
                                                <button 
                                                    onClick={() => onUpdateStatus(req.id, 'completed')}
                                                    className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 shadow-sm" 
                                                    title="Mark as Completed"
                                                >
                                                    <Check size={20} />
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic px-2">Pending</span>
                                            )}
                                            <button className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200">
                                                <Phone size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {myRoute.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                <div className="w-24 h-24 mb-4 opacity-50">
                                    <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Map.png" alt="Map" className="w-full h-full"/>
                                </div>
                                <p className="italic">Your route is currently empty.</p>
                                <p className="text-xs mt-1">Accept pending requests to build your route.</p>
                            </div>
                        )}
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default CollectorRoute;