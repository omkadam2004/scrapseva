
import React, { useState } from 'react';
import { Scale, Info, CheckCircle2 } from 'lucide-react';
import { ScrapItem, ScrapRate, ScrapType, Language } from '../types';
import { t } from '../utils/translations';

interface SmartScrapScannerProps {
  onItemsIdentified: (items: ScrapItem[]) => void;
  rates: ScrapRate[];
  language: Language;
}

const SmartScrapScanner: React.FC<SmartScrapScannerProps> = ({ onItemsIdentified, rates, language }) => {
  const [selectedType, setSelectedType] = useState<ScrapType | null>(null);
  const [weight, setWeight] = useState<string>('');

  const currentRate = rates.find(r => r.type === selectedType)?.pricePerKg || 0;
  const estimatedPrice = (parseFloat(weight) || 0) * currentRate;

  const handleAdd = () => {
    if (!selectedType || !weight || parseFloat(weight) <= 0) return;

    const newItem: ScrapItem = {
      type: selectedType,
      weightKg: parseFloat(weight),
      estimatedPrice: estimatedPrice,
      description: 'Inventory Item'
    };

    onItemsIdentified([newItem]);
    setWeight('');
    setSelectedType(null);
  };

  const scrapTypes = [
    { type: ScrapType.Paper, icon: '📰' },
    { type: ScrapType.Plastic, icon: '🧴' },
    { type: ScrapType.Metal, icon: '⚙️' },
    { type: ScrapType.E_Waste, icon: '💻' },
    { type: ScrapType.Glass, icon: '🧊' },
    { type: ScrapType.Other, icon: '📦' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 p-8 h-full relative overflow-hidden theme-transition animate-in fade-in duration-500">
       <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/30 rounded-bl-[4rem] -z-0"></div>

      <div className="mb-8 relative z-10">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Material Category</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Global Payout Standards</p>
      </div>
      
      <div className="space-y-8 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          {scrapTypes.map(({ type, icon }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all
                ${selectedType === type 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                  : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 hover:border-indigo-200'}
              `}
            >
              <span className="text-3xl mb-2">{icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{type}</span>
              {selectedType === type && <div className="mt-1"><CheckCircle2 size={12} /></div>}
            </button>
          ))}
        </div>

        {selectedType && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Estimated Weight</label>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded text-amber-700 dark:text-amber-400 font-bold">Rate: ₹{currentRate}/kg</span>
              </div>
              <div className="relative group">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={20} />
                <input
                  type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0 kg" min="0.1" step="0.1"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800 dark:text-white shadow-inner"
                />
              </div>
            </div>

            <div className="bg-indigo-600 p-6 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl shadow-indigo-900/10">
                <div className="text-center sm:text-left text-white">
                   <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Projected Payout</p>
                   <p className="text-4xl font-bold text-amber-400">₹{estimatedPrice.toFixed(2)}</p>
                </div>
                <button 
                  onClick={handleAdd}
                  disabled={!weight || parseFloat(weight) <= 0}
                  className="w-full sm:w-auto bg-white text-indigo-700 px-10 py-4 rounded-[1.2rem] font-bold hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                   Add to Cart
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartScrapScanner;
