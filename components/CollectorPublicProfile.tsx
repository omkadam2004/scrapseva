
import React from 'react';
import { User } from '../types';
import { BadgeCheck, MapPin, Star, Truck, IndianRupee, Calendar, ShieldCheck } from 'lucide-react';

interface CollectorPublicProfileProps {
  collector: User;
  onBookPickup: () => void;
  onBack: () => void;
}

const CollectorPublicProfile: React.FC<CollectorPublicProfileProps> = ({ collector, onBookPickup, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1">
         ← Back to List
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-32"></div>
         <div className="px-8 pb-8">
            <div className="relative -top-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                    <div className="w-24 h-24 bg-white p-1 rounded-xl shadow-md">
                        <div className="w-full h-full bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                            {collector.avatar ? (
                                <img src={collector.avatar} alt={collector.name} className="w-full h-full object-cover"/>
                            ) : (
                                <span className="text-3xl font-bold text-slate-400">{collector.name.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                    <div className="mb-1">
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            {collector.name}
                            {collector.isVerified && <BadgeCheck className="text-blue-500" fill="white" />}
                        </h1>
                        <p className="text-slate-500 flex items-center gap-2">
                            <MapPin size={16} /> Servicing {collector.operationalArea}
                        </p>
                    </div>
                </div>
                <div className="mb-1 flex gap-3">
                     <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                         <p className="text-xs text-slate-500 uppercase font-bold">Rating</p>
                         <div className="flex items-center gap-1 font-bold text-slate-800">
                             {collector.rating || 4.5} <Star size={14} className="text-yellow-400 fill-yellow-400"/>
                         </div>
                     </div>
                     <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                         <p className="text-xs text-slate-500 uppercase font-bold">License</p>
                         <div className="flex items-center gap-1 font-bold text-slate-800">
                             <ShieldCheck size={14} className="text-emerald-500"/> Verified
                         </div>
                     </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <IndianRupee size={18} className="text-emerald-600"/> Buying Rates
                    </h3>
                    <div className="space-y-3">
                        {collector.rates?.map((rate) => (
                            <div key={rate.type} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="font-medium text-slate-700">{rate.type}</span>
                                <span className="font-bold text-emerald-600">₹{rate.pricePerKg}/kg</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                        <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                            <Truck size={18} /> Collection Policy
                        </h3>
                        <ul className="text-sm text-indigo-700 space-y-2 list-disc list-inside">
                            <li>Available Mon - Sat (9 AM - 6 PM)</li>
                            <li>Minimum pickup weight: 5kg</li>
                            <li>Instant digital payment available</li>
                        </ul>
                    </div>

                    <button 
                        onClick={onBookPickup}
                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-emerald-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <Calendar size={20} /> Request Pickup from {collector.name.split(' ')[0]}
                    </button>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CollectorPublicProfile;
