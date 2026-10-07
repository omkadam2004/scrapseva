import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Droplets, TreePine, Zap, Trophy } from 'lucide-react';
import { User, Language } from '../types';
import { t } from '../utils/translations';

interface ImpactCardProps {
  user: User;
  language: Language;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ user, language }) => {
  const data = [
    { name: 'Trees', value: user.impact.treesSaved, fill: '#10b981', icon: '🌲' },
    { name: 'Water (kL)', value: user.impact.waterSaved / 1000, fill: '#3b82f6', icon: '💧' },
    { name: 'Energy (MWh)', value: user.impact.energySaved / 1000, fill: '#f59e0b', icon: '⚡' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       <StatBox 
          icon={<TreePine className="text-emerald-500" />} 
          value={user.impact.treesSaved.toFixed(1)} 
          label={t('treesSaved', language)} 
          bg="bg-emerald-50"
          border="border-emerald-100"
       />
       <StatBox 
          icon={<Droplets className="text-blue-500" />} 
          value={user.impact.waterSaved.toLocaleString()} 
          label={t('waterSaved', language)} 
           bg="bg-blue-50"
          border="border-blue-100"
       />
       <StatBox 
          icon={<Zap className="text-amber-500" />} 
          value={`${user.impact.energySaved} kWh`} 
          label={t('energySaved', language)} 
           bg="bg-amber-50"
          border="border-amber-100"
       />

       <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
          <img 
             src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals%20Nature/Potted%20Plant.png" 
             alt="Nature" 
             className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 pointer-events-none"
          />
          <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('impactOverview', language)}</h3>
          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
       </div>

        <div className="md:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">{t('yourBadges', language)}</h3>
                <Trophy className="text-amber-400" size={20} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                {user.badges.map((badge, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm mb-2">
                            {badge.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-slate-700">{badge}</span>
                    </div>
                ))}
                <div className="flex flex-col items-center justify-center p-3 border border-dashed border-slate-300 rounded-lg text-center opacity-60">
                    <div className="w-10 h-10 bg-slate-200 rounded-full mb-2"></div>
                    <span className="text-xs text-slate-500">Locked</span>
                </div>
            </div>
        </div>
    </div>
  );
};

const StatBox = ({ icon, value, label, bg, border }: any) => (
    <div className={`rounded-xl p-6 shadow-sm border ${bg} ${border} flex items-center gap-4`}>
        <div className="p-3 bg-white rounded-lg shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-600">{label}</p>
        </div>
    </div>
)

export default ImpactCard;