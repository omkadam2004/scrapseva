
import React from 'react';
import { PickupRequest } from '../types';
import { MapPin, Truck, ChevronRight, Package, Clock, IndianRupee } from 'lucide-react';

interface CollectorListProps {
    collectors: PickupRequest[];
    onSelectCollector: (request: PickupRequest) => void;
    language?: string;
}

const CollectorList: React.FC<CollectorListProps> = ({ collectors, onSelectCollector }) => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Available Requests</h1>
                <p className="text-slate-500">Browse pending scrap pickup requests in your area.</p>
            </div>

            {collectors.length === 0 ? (
                <div className="bg-white p-12 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Package className="text-slate-400" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No Requests Available</h3>
                    <p className="text-slate-500 max-w-md mb-6">
                        There are currently no pending requests in your area.
                        <br />
                        <span className="text-sm mt-2 block text-slate-400">Check back later or expand your service area.</span>
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {collectors.map((request) => (
                        <div key={request._id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800 mb-1">
                                            {request.sellerName}
                                        </h3>
                                        <p className="text-sm text-slate-600 flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-400" />
                                            {request.address}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                            <Clock size={12} /> Scheduled: {new Date(request.scheduledTime).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-emerald-600 flex items-center justify-end gap-1">
                                            <IndianRupee size={20} />
                                            {request.totalPrice}
                                        </div>
                                        <p className="text-xs text-slate-500">{request.totalWeight} kg</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {request.items?.slice(0, 3).map((item, idx) => (
                                            <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                                                {item.type}: {item.weightKg}kg
                                            </span>
                                        ))}
                                        {request.items && request.items.length > 3 && <span className="text-[10px] text-slate-400 px-1 py-1">+ {request.items.length - 3} more</span>}
                                    </div>
                                </div>

                                <button
                                    onClick={() => onSelectCollector(request)}
                                    className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    Accept Request <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CollectorList;
