import React, { useState } from 'react';
import {
  Package,
  History,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  Activity,
  ArrowRight,
  Heart,
  Leaf,
  Target,
  Sparkles,
  Award,
} from 'lucide-react';

import { User, PickupRequest, Language, ScrapType } from '../types';
import { t } from '../utils/translations';
import ImpactCard from './ImpactCard';

interface SellerDashboardProps {
  user: User;
  requests: PickupRequest[];
  language: Language;
  onNavigate: (view: any) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({
  user,
  requests,
  language,
  onNavigate,
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const acceptedRequests = requests.filter((r) => r.status === 'accepted');
  const completedRequests = requests.filter(
    (r) => r.status === 'completed'
  );

  const totalEarnings = completedRequests.reduce(
    (sum, r) => sum + r.totalPrice,
    0
  );

  const totalWeight = completedRequests.reduce(
    (sum, r) => sum + r.totalWeight,
    0
  );

  const marketRates = [
    { type: ScrapType.Paper, rate: 14.5, trend: '+0.5', status: 'up' },
    { type: ScrapType.Metal, rate: 42.0, trend: 'stable', status: 'stable' },
    { type: ScrapType.Plastic, rate: 18.0, trend: '+1.2', status: 'up' },
    { type: ScrapType.E_Waste, rate: 85.0, trend: '-0.4', status: 'down' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-black via-zinc-900 to-black p-8 sm:p-12 text-white shadow-xl border border-zinc-800">


        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold uppercase mb-4 backdrop-blur-sm">
              <Leaf size={14} /> Environmental Hero
              <span className="ml-1">🌱</span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-3 bg-gradient-to-r from-white via-emerald-200 to-emerald-300 bg-clip-text text-transparent">
              {t('welcome', language)},{' '}
              <span className="text-emerald-400 block">
                {user.name.split(' ')[0]}!
              </span>
            </h1>

            <div className="flex items-center gap-6 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Award className="text-emerald-400" size={20} />
                <p className="text-emerald-100">
                  You've saved{' '}
                  <span className="font-bold text-emerald-300">
                    {(user.impact?.treesSaved || 0).toFixed(1)}
                  </span>{' '}
                  trees
                </p>
              </div>
              <div className="h-6 w-px bg-emerald-500/30"></div>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-amber-400" size={20} />
                <p className="text-amber-100">
                  <span className="font-bold text-amber-300">
                    {requests.length}
                  </span>{' '}
                  total requests
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-stretch sm:items-end">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl min-w-[240px] hover:bg-white/15 transition-all duration-300">
              <p className="text-xs uppercase text-zinc-300 font-bold tracking-wide">Total Earnings</p>
              <p className="text-4xl font-bold text-emerald-300 mt-2">
                ₹{totalEarnings.toLocaleString()}
              </p>
              {completedRequests.length > 0 && (
                <p className="text-xs text-zinc-400 mt-2">
                  Average: ₹{(totalEarnings / completedRequests.length).toFixed(0)} per pickup
                </p>
              )}
            </div>

            <button
              onClick={() => onNavigate('schedule')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:scale-95"
            >
              <Plus size={22} />
              <span>{t('scheduleBtn', language)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-8 space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onMouseEnter={() => setHoveredCard('weight')}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase text-blue-600 dark:text-blue-400 font-bold tracking-wide">Total Weight</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                    {totalWeight.toFixed(1)}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">kg collected</p>
                </div>
                <div className={`p-3 bg-blue-500/20 rounded-xl transition-transform duration-300 ${hoveredCard === 'weight' ? 'scale-110 rotate-12' : ''}`}>
                  <Package className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
              </div>
            </div>

            <div
              onMouseEnter={() => setHoveredCard('pickups')}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase text-emerald-600 dark:text-emerald-400 font-bold tracking-wide">Completed Pickups</p>
                  <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-2">
                    {completedRequests.length}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">successfully completed</p>
                </div>
                <div className={`p-3 bg-emerald-500/20 rounded-xl transition-transform duration-300 ${hoveredCard === 'pickups' ? 'scale-110 rotate-12' : ''}`}>
                  <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={24} />
                </div>
              </div>
            </div>

            <div
              onMouseEnter={() => setHoveredCard('pending')}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase text-amber-600 dark:text-amber-400 font-bold tracking-wide">Pending / Active</p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">
                    {pendingRequests.length + acceptedRequests.length}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">waiting for pickup</p>
                </div>
                <div className={`p-3 bg-amber-500/20 rounded-xl transition-transform duration-300 ${hoveredCard === 'pending' ? 'scale-110 rotate-12' : ''}`}>
                  <Clock className="text-amber-600 dark:text-amber-400" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* HISTORY */}
          <div className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 rounded-3xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-700">
            <div className="p-6 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent">
              <h2 className="font-bold flex items-center gap-2 text-lg text-zinc-900 dark:text-white">
                <History size={20} className="text-emerald-600" /> Recent Activity
              </h2>
              <button
                onClick={() => onNavigate('my-requests')}
                className="text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 font-semibold transition-colors duration-200"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
              {requests.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-4">
                    <Sparkles className="text-zinc-400 dark:text-zinc-600" size={32} />
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">No requests yet</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Create your first scrap pickup to get started</p>
                </div>
              ) : (
                requests.slice(0, 5).map((req, idx) => (
                  <div
                    key={req._id || req.id}
                    className="p-6 hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 transition-colors duration-200 flex justify-between items-center group cursor-pointer"
                  >
                    <div className="flex gap-4 items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${req.status === 'completed'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110'
                          : req.status === 'accepted'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 group-hover:scale-110'
                          }`}
                      >
                        {req.status === 'completed' ? (
                          <CheckCircle2 size={20} />
                        ) : req.status === 'accepted' ? (
                          <Target size={20} />
                        ) : (
                          <Clock size={20} />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-bold text-zinc-900 dark:text-white text-sm">
                          {req.items.map((i) => i.type).join(', ')}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                          {new Date(req.scheduledTime).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                          {req.totalWeight.toFixed(1)}kg • {req.items.length} item{req.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-zinc-900 dark:text-white">
                        ₹{req.totalPrice.toFixed(2)}
                      </p>
                      <span className={`text-xs uppercase font-semibold mt-1 inline-block px-2 py-1 rounded-full ${req.status === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : req.status === 'accepted'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                        }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-4 space-y-8">
          {/* MARKET RATES */}
          <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 dark:from-black dark:to-zinc-950 text-white p-8 rounded-3xl border border-zinc-800/50 shadow-lg">
            <h3 className="font-bold mb-6 flex gap-2 items-center text-lg">
              <TrendingUp className="text-emerald-400" size={22} /> Market Rates
            </h3>

            <div className="space-y-4">
              {marketRates.map((item, idx) => (
                <div
                  key={item.type}
                  className="group p-4 bg-zinc-900/50 rounded-xl hover:bg-zinc-800 transition-all duration-300 border border-zinc-700/50 hover:border-emerald-500/50 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-zinc-100 text-sm">{item.type}</p>
                      <p className="text-xs text-zinc-500 mt-1">₹{item.rate}/kg</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-400">
                        ₹{item.rate}
                      </p>
                      <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${item.status === 'up' ? 'text-emerald-400' :
                        item.status === 'down' ? 'text-red-400' :
                          'text-zinc-400'
                        }`}>
                        {item.status === 'up' && <ArrowUpRight size={14} />}
                        {item.status === 'down' && <div className="rotate-180"><ArrowUpRight size={14} /></div>}
                        {item.trend}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTION CARDS */}
          <div className="space-y-4">
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 p-6 rounded-3xl border border-emerald-200 dark:border-emerald-800/50 hover:shadow-lg transition-all duration-300">
              <div className="flex gap-3 items-start mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Zap className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-100">Pro Tip</h3>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-2">
                    Sorting scrap improves efficiency by 30% and increases your earnings!
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('feedback')}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:shadow-lg"
              >
                <Heart size={18} /> Share Feedback
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/10 p-6 rounded-3xl border border-blue-200 dark:border-blue-800/50">
              <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm mb-4">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                  <span className="text-xs text-blue-800 dark:text-blue-200 font-medium">Total Requests</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">{requests.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                  <span className="text-xs text-blue-800 dark:text-blue-200 font-medium">Success Rate</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">
                    {requests.length > 0 ? Math.round((completedRequests.length / requests.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-white/5 rounded-lg">
                  <span className="text-xs text-blue-800 dark:text-blue-200 font-medium">Avg Weight/Pickup</span>
                  <span className="font-bold text-blue-900 dark:text-blue-100">
                    {completedRequests.length > 0 ? (totalWeight / completedRequests.length).toFixed(1) : 0} kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
