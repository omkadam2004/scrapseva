
import React from 'react';
import { Clock, CheckCircle, MapPin, Package, Calendar, Truck, IndianRupee } from 'lucide-react';
import { PickupRequest, Language } from '../types';
import { t } from '../utils/translations';

interface UserRequestsProps {
  requests: PickupRequest[];
  language: Language;
}

const UserRequests: React.FC<UserRequestsProps> = ({ requests, language }) => {
  
  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'accepted': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
        case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        default: return 'bg-slate-50 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
      return t(status as any, language) || status;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">{t('myRequests', language)}</h1>
            <p className="text-slate-500">Track the status of your scrap pickup jobs.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {requests.length === 0 ? (
           <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="text-slate-300" size={32} />
               </div>
               <h3 className="text-lg font-medium text-slate-700">No Requests Found</h3>
               <p className="text-slate-500">You haven't scheduled any pickups yet.</p>
           </div>
        ) : (
           requests.map(req => (
             <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4 border-b border-slate-50 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-1 ${getStatusStyle(req.status)}`}>
                                 {req.status === 'pending' && <Clock size={12} />}
                                 {req.status === 'accepted' && <Truck size={12} />}
                                 {req.status === 'completed' && <CheckCircle size={12} />}
                                 {getStatusLabel(req.status)}
                             </span>
                             <span className="text-xs text-slate-400">ID: {req.id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm mt-2">
                            <Calendar size={14} />
                            <span>{new Date(req.scheduledTime).toLocaleDateString()} at {new Date(req.scheduledTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <IndianRupee size={20} strokeWidth={2.5} />
                            {req.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">Estimated Value</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Package size={14} /> Items Listed
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {req.items.map((item, idx) => (
                                <span key={idx} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-xs text-slate-700">
                                    {item.type} ({item.weightKg}kg)
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="sm:w-1/3">
                         <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <MapPin size={14} /> Pickup Location
                        </h4>
                        <p className="text-sm text-slate-600 line-clamp-2">
                            {req.address}
                        </p>
                    </div>
                </div>
             </div>
           ))
        )}
      </div>
    </div>
  );
}

export default UserRequests;