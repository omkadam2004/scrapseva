
import React from 'react';
import { Package, Calendar, Trash2, MapPin, User, ChevronRight, Scale, Info, CheckCircle2 } from 'lucide-react';
import { PickupRequest } from '../types';

interface CollectorRecordsProps {
  requests: PickupRequest[];
  onClearData: () => void;
}

const CollectorRecords: React.FC<CollectorRecordsProps> = ({ requests, onClearData }) => {
  const visibleRequests = requests.filter(r => r.status === 'completed' && !r.clearedByCollector);
  const totalWeight = visibleRequests.reduce((sum, item) => sum + item.totalWeight, 0);
  const totalItems = visibleRequests.reduce((sum, item) => sum + item.items.length, 0);

  return (
    <div className="space-y-6 theme-transition">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
           <div>
               <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                 <Package className="text-emerald-50" /> Collection Logs
               </h1>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Review materials collected from sellers and manage records.</p>
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  if (confirm("Are you sure you want to clear these collection logs? This action cannot be undone.")) {
                    onClearData();
                  }
                }}
                disabled={visibleRequests.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold"
              >
                  <Trash2 size={18} /> Clear Records
              </button>
           </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-emerald-600 dark:bg-emerald-700 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-900/10 flex items-center justify-between overflow-hidden relative">
               <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <Scale size={120} />
               </div>
               <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-1">Total Weight Managed</p>
                  <h3 className="text-4xl font-bold">{totalWeight.toFixed(1)} <span className="text-xl font-normal opacity-70">kg</span></h3>
               </div>
               <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                  <Scale size={24} />
               </div>
           </div>

           <div className="bg-slate-900 dark:bg-slate-800 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-900/10 flex items-center justify-between overflow-hidden relative">
               <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <Package size={120} />
               </div>
               <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Items Processed</p>
                  <h3 className="text-4xl font-bold">{totalItems} <span className="text-xl font-normal opacity-70">units</span></h3>
               </div>
               <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
                  <CheckCircle2 size={24} className="text-emerald-400" />
               </div>
           </div>
       </div>

       <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
           <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
               <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                 Recent Transactions
               </h3>
               <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{visibleRequests.length} Active Records</span>
           </div>
           
           <div className="divide-y divide-slate-100 dark:divide-slate-800">
               {visibleRequests.length === 0 ? (
                   <div className="p-20 text-center flex flex-col items-center justify-center">
                       <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                          <Info className="text-slate-300 dark:text-slate-600" size={32} />
                       </div>
                       <p className="text-slate-500 dark:text-slate-400 font-medium">No collection logs available.</p>
                       <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Complete pickups to see data here.</p>
                   </div>
               ) : (
                   visibleRequests.map((req) => (
                       <div key={req.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                 <User size={20} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-800 dark:text-slate-200">{req.sellerName}</h4>
                                 <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(req.scheduledTime).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><MapPin size={12}/> {req.address.slice(0, 25)}...</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-6">
                              <div className="text-right">
                                 <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{req.totalWeight} kg</p>
                                 <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{req.items.length} Materials</p>
                              </div>
                              <div className="hidden sm:flex flex-wrap gap-1 max-w-[200px] justify-end">
                                 {req.items.map((item, idx) => (
                                    <span key={idx} className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400 font-bold uppercase">
                                       {item.type}
                                    </span>
                                 ))}
                              </div>
                              <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500 hover:text-emerald-500 transition-colors">
                                 <ChevronRight size={20} />
                              </button>
                           </div>
                       </div>
                   ))
               )}
           </div>
       </div>
    </div>
  );
};

export default CollectorRecords;