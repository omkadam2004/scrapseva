import React from 'react';
import { IndianRupee, TrendingUp, Calendar, ArrowUpRight, Download, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PickupRequest } from '../types';

interface CollectorEarningsProps {
  requests: PickupRequest[];
  walletBalance: number;
}

const CollectorEarnings: React.FC<CollectorEarningsProps> = ({ requests, walletBalance }) => {
  const completedRequests = requests.filter(r => r.status === 'completed');
  const totalEarnings = completedRequests.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalWeight = completedRequests.reduce((sum, item) => sum + item.totalWeight, 0);

  const getDailyRevenue = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueMap = new Map<string, number>();
    days.forEach(d => revenueMap.set(d, 0));

    completedRequests.forEach(req => {
      const day = days[new Date(req.scheduledTime).getDay()];
      revenueMap.set(day, (revenueMap.get(day) || 0) + req.totalPrice);
    });

    return days.map(day => ({ name: day, amount: revenueMap.get(day) || 0 }));
  };

  const chartData = getDailyRevenue();

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <h1 className="text-2xl font-bold text-slate-800">Earnings Dashboard</h1>
               <p className="text-slate-500">Track your completed collections and revenue</p>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium">
               <Download size={16} /> Export Report
           </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-4">
                   <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                       <IndianRupee size={24} />
                   </div>
                   <div>
                       <p className="text-sm text-slate-500 font-medium">Wallet Balance</p>
                       <h3 className="text-2xl font-bold text-slate-800">₹{walletBalance.toLocaleString()}</h3>
                   </div>
               </div>
               <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                   <TrendingUp size={14} />
                   <span>Platform Profit: ₹{totalEarnings.toFixed(2)}</span>
               </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-4">
                   <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                       <Package size={24} />
                   </div>
                   <div>
                       <p className="text-sm text-slate-500 font-medium">Jobs Completed</p>
                       <h3 className="text-2xl font-bold text-slate-800">{completedRequests.length}</h3>
                   </div>
               </div>
               <p className="mt-4 text-xs text-slate-400">Total Collected: {totalWeight.toFixed(1)}kg</p>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <div className="flex items-center gap-4">
                   <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                       <ArrowUpRight size={24} />
                   </div>
                   <div>
                       <p className="text-sm text-slate-500 font-medium">Avg. per Job</p>
                       <h3 className="text-2xl font-bold text-slate-800">₹{completedRequests.length > 0 ? (totalEarnings / completedRequests.length).toFixed(0) : '0'}</h3>
                   </div>
               </div>
                <p className="mt-4 text-xs text-slate-400">Based on recent activity</p>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-semibold text-slate-800 mb-6">Weekly Revenue Breakdown</h3>
               <div className="h-64 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={chartData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `₹${value}`} />
                           <Tooltip 
                               cursor={{fill: '#f8fafc'}}
                               contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                               formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Revenue']}
                           />
                           <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                       </BarChart>
                   </ResponsiveContainer>
               </div>
           </div>

           <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
               <div className="p-4 border-b border-slate-100 bg-slate-50">
                   <h3 className="font-semibold text-slate-800">Completed Transactions</h3>
               </div>
               <div className="overflow-y-auto max-h-[320px] flex-1">
                   {completedRequests.length === 0 ? (
                       <div className="p-8 text-center text-slate-400 italic text-sm">
                           No completed transactions yet.
                       </div>
                   ) : (
                       completedRequests.map((req) => (
                           <div key={req.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                               <div className="flex justify-between items-start mb-1">
                                   <span className="font-medium text-slate-800">{req.sellerName}</span>
                                   <span className="font-bold text-emerald-600">₹{req.totalPrice.toFixed(2)}</span>
                               </div>
                               <div className="flex justify-between text-xs text-slate-500">
                                   <span className="truncate max-w-[150px]">{req.items.map(i => i.type).join(', ')}</span>
                                   <span className="flex items-center gap-1 whitespace-nowrap"><Calendar size={10} /> {new Date(req.scheduledTime).toLocaleDateString()}</span>
                               </div>
                               <div className="text-[10px] text-slate-400 mt-1">Weight: {req.totalWeight}kg</div>
                           </div>
                       ))
                   )}
               </div>
               {completedRequests.length > 0 && (
                   <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                       <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">View All History</button>
                   </div>
               )}
           </div>
       </div>
    </div>
  );
};

export default CollectorEarnings;