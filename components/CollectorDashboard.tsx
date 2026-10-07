import React, { useState, useEffect } from 'react';
import {
  Truck, TrendingUp, MapPin, Scale, Star,
  ArrowRight, IndianRupee, Zap, Navigation,
  CheckCircle2, Settings, List, Package, Radar
} from 'lucide-react';
import { User, PickupRequest, Language } from '../types';

interface CollectorDashboardProps {
  user: User;
  requests: PickupRequest[];
  language: Language;
  onNavigate: (view: any) => void;
  onToggleStatus: () => void;
  onAcceptRequest?: (requestId: string) => Promise<void>;
}

const CollectorDashboard: React.FC<CollectorDashboardProps> = ({
  user,
  requests,
  onNavigate,
  onToggleStatus,
  onAcceptRequest
}) => {
  // ------------------ LOCAL STATE ------------------
  const [pendingRequests, setPendingRequests] = useState<PickupRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<PickupRequest[]>([]);
  const [completedToday, setCompletedToday] = useState<PickupRequest[]>([]);
  const [isOnline, setIsOnline] = useState(user.isOnline);
  const [showRates, setShowRates] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  // Initialize requests
  useEffect(() => {
    setPendingRequests(requests.filter(r => r.status === 'pending'));
    setAcceptedRequests(requests.filter(r => r.status === 'accepted'));
    setCompletedToday(requests.filter(r => r.status === 'completed'));
  }, [requests]);

  // Dummy rates for display
  const dummyRates = [
    { type: 'Paper', pricePerKg: 8 },
    { type: 'Plastic', pricePerKg: 12 },
    { type: 'Metal', pricePerKg: 25 },
    { type: 'Glass', pricePerKg: 5 },
    { type: 'E-Waste', pricePerKg: 45 },
    { type: 'Other', pricePerKg: 3 }
  ];

  const totalWeightToday = completedToday.reduce((sum, r) => sum + r.totalWeight, 0);
  const totalEarningsToday = completedToday.reduce((sum, r) => sum + r.totalPrice, 0);

  // ------------------ HANDLERS ------------------
  const handleAcceptRequest = async (reqId: string) => {
    if (!onAcceptRequest) return;

    const request = pendingRequests.find(r => r._id === reqId);
    if (!request) return;

    // Update UI immediately
    setPendingRequests(prev => prev.filter(r => r._id !== reqId));
    setAcceptedRequests(prev => [...prev, { ...request, status: 'accepted' }]);

    // Call API
    try {
      await onAcceptRequest(reqId);
    } catch (err) {
      // Rollback if API fails
      setPendingRequests(prev => [...prev, request]);
      setAcceptedRequests(prev => prev.filter(r => r._id !== reqId));
      console.error('Failed to accept request:', err);
    }
  };

  const toggleOnlineStatus = () => {
    setIsOnline(prev => !prev);
    onToggleStatus(); // Notify parent
  };

  // Handler functions for navigation
  const handleOpenRoute = () => {
    setShowRoute(true);
  };

  const handleCloseRoute = () => {
    setShowRoute(false);
  };

  const handleOpenRates = () => {
    setShowRates(true);
  };

  const handleCloseRates = () => {
    setShowRates(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ------------------ HEADER ------------------ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif-custom text-zinc-900 dark:text-white mb-1">
            Operations <span className="text-emerald-600 italic">Center</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-2">
            <MapPin size={16} className="text-emerald-500" /> Sector: {user.operationalArea}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {acceptedRequests.length > 0 && (
            <button
              onClick={handleOpenRoute}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
            >
              <Navigation size={18} />
              <span className="font-bold">Route ({acceptedRequests.length})</span>
              <ArrowRight size={16} />
            </button>
          )}
          <button
            onClick={handleOpenRates}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
          >
            <TrendingUp size={18} />
            <span className="font-bold">Rates</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="bg-zinc-900 p-2 pl-6 rounded-3xl border border-zinc-800 shadow-xl flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Job Availability
            </span>

          </div>

        </div>
      </div>

      {/* ------------------ KPI GRID ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl">
              <IndianRupee size={28} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase">Today's Volume</p>
              <h3 className="text-4xl font-bold">₹{totalEarningsToday.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm">
          <Scale size={20} className="text-emerald-600 mb-4" />
          <h3 className="text-4xl font-bold">
            {totalWeightToday.toFixed(1)} <span className="text-sm opacity-40">kg</span>
          </h3>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-sm">
          <Star size={20} className="text-amber-500 mb-4" />
          <h3 className="text-4xl font-bold">{user.rating || '5.0'}</h3>
        </div>
      </div>

      {/* ------------------ PENDING QUEUE ------------------ */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-8 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <List size={20} /> Pending Queue
          </h2>
          <span className="text-xs font-bold">{pendingRequests.length} Signals</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="py-24 text-center text-zinc-400">
            <Radar size={32} className="mx-auto mb-4 animate-pulse" />
            No pending requests
          </div>
        ) : (
          pendingRequests.map((req) => (
            <div
              key={req._id}
              className="p-6 border-b flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
            >
              <div>
                <h4 className="font-bold">{req.sellerName}</h4>
                <p className="text-xs text-zinc-500">{req.address}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-emerald-600">₹{req.totalPrice}</p>
                  <p className="text-xs">{req.totalWeight} kg</p>
                </div>
                <button
                  onClick={() => handleAcceptRequest(req._id)}
                  className="p-3 rounded-xl bg-zinc-100 hover:bg-emerald-500 hover:text-white transition-colors"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ------------------ ACCEPTED ROUTE ------------------ */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-8 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <Navigation size={20} /> My Route
          </h2>
          <span className="text-xs font-bold">{acceptedRequests.length} Accepted</span>
        </div>

        {acceptedRequests.length === 0 ? (
          <div className="py-24 text-center text-zinc-400">
            <Truck size={32} className="mx-auto mb-4 opacity-50" />
            <p>No accepted requests yet</p>
            <p className="text-xs mt-2">Accept requests from the pending queue to see them here</p>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {acceptedRequests.slice(0, 3).map((req, idx) => (
              <div key={req._id} className="p-4 border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl transition-transform hover:scale-[1.01]">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-zinc-900 dark:text-white">{req.sellerName}</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2 mt-1">
                      <MapPin size={14} /> {req.address}
                    </p>
                    <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                      <p>Items: {req.items?.map(i => `${i.type}`).join(', ')}</p>
                      <p>Weight: {req.totalWeight} kg | Earning: ₹{req.totalPrice}</p>
                    </div>
                  </div>
                  <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0" />
                </div>
              </div>
            ))}
            {acceptedRequests.length > 3 && (
              <div className="p-4 text-center text-zinc-500 text-sm">
                + {acceptedRequests.length - 3} more stops...
              </div>
            )}
          </div>
        )}
      </div>

      {/* GRID FOR RATES AND ACTIVITY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RATES SECTION */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <TrendingUp size={20} className="text-amber-500" /> Market Rates
            </h2>
          </div>

          <div className="p-6 space-y-3">
            {user.rates && user.rates.length > 0 ? (
              user.rates.slice(0, 4).map((rate) => (
                <div key={rate.type} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{rate.type}</span>
                  <span className="font-bold text-amber-600">₹{rate.pricePerKg}/kg</span>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-400 py-6">
                <Package size={24} className="mx-auto mb-2 opacity-50" />
                No rates configured
              </div>
            )}
          </div>
        </div>

        {/* ACTIVITY LOGS */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Zap size={20} className="text-yellow-500" /> Activity Today
            </h2>
          </div>

          <div className="p-6 space-y-3">
            {completedToday.length > 0 ? (
              completedToday.slice(0, 4).map((req) => (
                <div key={req._id} className="flex justify-between items-start p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">{req.sellerName}</p>
                    <p className="text-xs text-zinc-500 mt-1">{req.totalWeight} kg</p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">✓ Picked</span>
                </div>
              ))
            ) : (
              <div className="text-center text-zinc-400 py-6">
                <CheckCircle2 size={24} className="mx-auto mb-2 opacity-50" />
                No pickups completed today
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RATES MODAL */}
      {showRates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-8 border-b flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <TrendingUp size={24} className="text-amber-500" /> Market Rates
              </h2>
              <button
                onClick={handleCloseRates}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-4">
              {(user.rates && user.rates.length > 0 ? user.rates : dummyRates).map((rate) => (
                <div key={rate.type} className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-900/30">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{rate.type}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Per kilogram</p>
                  </div>
                  <span className="text-3xl font-bold text-amber-600">₹{rate.pricePerKg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROUTE MODAL */}
      {showRoute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-8 border-b flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Truck size={24} className="text-emerald-600" /> Today's Route
              </h2>
              <button
                onClick={handleCloseRoute}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-8">
              {acceptedRequests.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <Truck size={32} className="mx-auto mb-4 opacity-50" />
                  <p>No stops scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptedRequests.map((req, idx) => (
                    <div key={req._id} className="p-6 border-2 border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold">
                            {idx + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{req.sellerName}</h3>
                          <p className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2 mt-2">
                            <MapPin size={16} /> {req.address}
                          </p>
                          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                            <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg">
                              <p className="text-xs text-zinc-500 uppercase">Items</p>
                              <p className="font-bold">{req.items?.length || 0}</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg">
                              <p className="text-xs text-zinc-500 uppercase">Weight</p>
                              <p className="font-bold">{req.totalWeight} kg</p>
                            </div>
                            <div className="p-3 bg-white dark:bg-zinc-800 rounded-lg">
                              <p className="text-xs text-zinc-500 uppercase">Earning</p>
                              <p className="font-bold text-emerald-600">₹{req.totalPrice}</p>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-white dark:bg-zinc-800 rounded-lg">
                            <p className="text-xs text-zinc-500 uppercase mb-2">Items to Pick</p>
                            <div className="space-y-2">
                              {req.items?.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span>{item.type}</span>
                                  <span className="font-medium">{item.weightKg} kg</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorDashboard;
