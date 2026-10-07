import React, { useState, useEffect } from 'react';
import { IndianRupee, AlertCircle, Save, TrendingUp, CheckCircle } from 'lucide-react';
import { ScrapRate, ScrapType } from '../types';

interface RateManagerProps {
  rates: ScrapRate[];
  onUpdateRates: (rates: ScrapRate[]) => void;
}

const RateManager: React.FC<RateManagerProps> = ({ rates, onUpdateRates }) => {
  const [localRates, setLocalRates] = useState<ScrapRate[]>(rates);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  useEffect(() => {
    setLocalRates(rates);
  }, [rates]);

  const handleRateChange = (type: ScrapType, newPriceStr: string) => {
      const newPrice = newPriceStr === '' ? 0 : parseFloat(newPriceStr);
      const updatedRates = localRates.map(r => r.type === type ? {...r, pricePerKg: newPrice} : r);
      setLocalRates(updatedRates);
      setHasUnsavedChanges(true);
      setShowSavedMsg(false);
  };

  const handleSave = () => {
      onUpdateRates(localRates);
      setHasUnsavedChanges(false);
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const getIconColor = (type: ScrapType) => {
      switch (type) {
          case ScrapType.Paper: return 'bg-blue-600';
          case ScrapType.Plastic: return 'bg-orange-500';
          case ScrapType.Metal: return 'bg-slate-700';
          case ScrapType.E_Waste: return 'bg-purple-600';
          case ScrapType.Glass: return 'bg-cyan-600';
          case ScrapType.Other: return 'bg-gray-500';
          default: return 'bg-emerald-600';
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
       <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">My Buying Rates</h1>
            <p className="text-slate-500 mt-1">Sellers in your area will see these prices for their scrap items.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2 uppercase tracking-wider">
               <TrendingUp size={16} /> Marketplace Active
            </div>
            {hasUnsavedChanges && <span className="text-[10px] text-amber-600 font-bold uppercase animate-pulse">Unsaved Changes</span>}
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
               <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2 pb-4 border-b border-slate-50">
                   <IndianRupee size={20} className="text-emerald-500"/> 
                   Price Adjustment (INR/kg)
               </h3>
               
               <div className="space-y-4">
                   {localRates.map((rate) => (
                       <div key={rate.type} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all group">
                           <div className="flex items-center gap-4">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm ${getIconColor(rate.type)}`}>
                                   {rate.type.charAt(0)}
                               </div>
                               <div>
                                   <span className="font-bold text-slate-800 block">{rate.type}</span>
                                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rate per Kilogram</span>
                               </div>
                           </div>
                           <div className="flex items-center gap-3">
                               <span className="text-slate-400 font-bold text-lg">₹</span>
                               <input 
                                   type="number" 
                                   step="0.50"
                                   value={rate.pricePerKg}
                                   onChange={(e) => handleRateChange(rate.type, e.target.value)}
                                   className="w-24 px-4 py-3 bg-white border border-slate-200 rounded-xl text-right font-mono font-bold text-slate-800 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all shadow-sm"
                               />
                           </div>
                       </div>
                   ))}
               </div>

               <div className="mt-10 flex items-center justify-between">
                   <div className="transition-all duration-300">
                      {showSavedMsg && (
                          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-left-2">
                              <CheckCircle size={18} /> Rates saved successfully!
                          </div>
                      )}
                   </div>
                   <button 
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95"
                   >
                       <Save size={20} /> Apply Rates
                   </button>
               </div>
           </div>
           
           <div className="space-y-6">
                <div className="bg-indigo-900 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-900/20">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <AlertCircle size={20} className="text-indigo-300" /> Market Intelligence
                    </h3>
                    <p className="text-indigo-200/80 text-sm mb-6 leading-relaxed">
                        Competitive pricing attracts verified sellers. Use your unique rates to differentiate your service.
                    </p>
                    <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-4">
                        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Global Benchmarks</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-indigo-100">Paper (Premium)</span>
                                <span className="font-mono font-bold">₹15.5</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-indigo-100">Heavy Metals</span>
                                <span className="font-mono font-bold">₹44.0</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-indigo-100">Clean Plastic</span>
                                <span className="font-mono font-bold">₹19.0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100">
                    <h3 className="font-bold text-emerald-900 mb-4 uppercase text-xs tracking-widest">Best Practices</h3>
                    <ul className="space-y-3">
                        {['Update weekly', 'Check metal volatility', 'Offer E-Waste premium'].map((tip, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-emerald-800 font-medium">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
           </div>
       </div>
    </div>
  );
};

export default RateManager;