import React from 'react';
import { Medal } from 'lucide-react';
import { LeaderboardEntry } from '../types';

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, name: "EcoWarrior99", points: 2540, avatar: "https://picsum.photos/32/32?random=1" },
    { rank: 2, name: "GreenGiant", points: 2100, avatar: "https://picsum.photos/32/32?random=2" },
    { rank: 3, name: "RecycleQueen", points: 1950, avatar: "https://picsum.photos/32/32?random=3" },
    { rank: 4, name: "PlanetSaver", points: 1800, avatar: "https://picsum.photos/32/32?random=4" },
    { rank: 5, name: "You", points: 1250, avatar: "https://picsum.photos/32/32?random=5" },
];

const Leaderboard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
        <Medal className="text-amber-500" size={20} />
        <h3 className="font-semibold text-slate-800">Local Top Recyclers</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {MOCK_LEADERBOARD.map((entry) => (
            <div key={entry.rank} className={`flex items-center justify-between p-4 ${entry.name === 'You' ? 'bg-emerald-50/50' : ''}`}>
                <div className="flex items-center gap-4">
                    <span className={`
                        w-6 h-6 flex items-center justify-center text-sm font-bold rounded-full
                        ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                          entry.rank === 2 ? 'bg-gray-100 text-gray-700' : 
                          entry.rank === 3 ? 'bg-orange-100 text-orange-700' : 'text-slate-500'}
                    `}>
                        {entry.rank}
                    </span>
                    <img src={entry.avatar} alt={entry.name} className="w-8 h-8 rounded-full bg-slate-200" />
                    <span className={`font-medium ${entry.name === 'You' ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {entry.name} {entry.name === 'You' && '(Me)'}
                    </span>
                </div>
                <span className="font-bold text-slate-600">{entry.points} pts</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;