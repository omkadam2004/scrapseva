import React, { useState, useEffect } from 'react';
import {
    Plus,
    X,
    MapPin,
    Calendar,
    Package,
    IndianRupee,
    AlertCircle,
    Users,
    Zap,
    CheckCircle2,
} from 'lucide-react';
import { ScrapType, User, Language, ScrapRate } from '../types';
import { ScrapApi } from '../services/api';
import SmartScrapScanner from './SmartScrapScanner';

interface SchedulePickupProps {
    user: User;
    language: Language;
    onSuccess?: () => void;
    onClose?: () => void;
}

interface ScrapItem {
    type: ScrapType;
    weightKg: number;
    estimatedPrice: number;
    description?: string;
}

interface Collector {
    _id: string;
    name: string;
    email: string;
    phone: string;
    area: string;
}

const SchedulePickup: React.FC<SchedulePickupProps> = ({
    user,
    language,
    onSuccess,
    onClose,
}) => {
    const [items, setItems] = useState<ScrapItem[]>([]);
    const [scheduledTime, setScheduledTime] = useState('');
    const [address, setAddress] = useState(user.address || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [collectors, setCollectors] = useState<Collector[]>([]);
    const [selectedCollectorId, setSelectedCollectorId] = useState<string>('');
    const [useScannerMode, setUseScannerMode] = useState(false);

    const [currentItem, setCurrentItem] = useState<Partial<ScrapItem>>({
        type: ScrapType.Paper,
        weightKg: 0,
    });

    // Fetch collectors on component mount
    useEffect(() => {
        const fetchCollectors = async () => {
            try {
                const data = await ScrapApi.getCollectors();
                setCollectors(data);
            } catch (err) {
                console.error('Failed to fetch collectors:', err);
            }
        };
        fetchCollectors();
    }, []);

    const scrapRates: Record<ScrapType, number> = {
        [ScrapType.Paper]: 14.5,
        [ScrapType.Metal]: 42,
        [ScrapType.Plastic]: 18,
        [ScrapType.Glass]: 8,
        [ScrapType.E_Waste]: 85,
        [ScrapType.Other]: 5,
    };

    const scrapRatesArray: ScrapRate[] = Object.entries(scrapRates).map(([type, pricePerKg]) => ({
        type: type as ScrapType,
        pricePerKg,
    }));

    const handleAddItem = () => {
        if (!currentItem.type || !currentItem.weightKg || currentItem.weightKg <= 0) {
            setError('Please select scrap type and valid weight');
            return;
        }

        const estimatedPrice =
            currentItem.weightKg * scrapRates[currentItem.type];

        setItems([
            ...items,
            {
                type: currentItem.type,
                weightKg: currentItem.weightKg,
                estimatedPrice,
                description: currentItem.description,
            },
        ]);

        setCurrentItem({ type: ScrapType.Paper, weightKg: 0 });
        setError(null);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemsFromScanner = (scannedItems: ScrapItem[]) => {
        // Add scanned items to the existing items list
        scannedItems.forEach(item => {
            setItems(prev => [...prev, item]);
        });
        setError(null);
    };

    const totalWeight = items.reduce((s, i) => s + i.weightKg, 0);
    const totalPrice = items.reduce((s, i) => s + i.estimatedPrice, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!items.length) return setError('Add at least one item');
        if (!scheduledTime) return setError('Select pickup date & time');
        if (!address) return setError('Enter pickup address');

        setLoading(true);

        try {
            const payload = {
                userId: user._id,
                sellerName: user.name,
                items: items.map((i) => ({
                    scrapType: i.type,
                    weight: i.weightKg,
                    price: i.estimatedPrice,
                    description: i.description || '',
                })),
                totalWeight,
                totalPrice,
                address,
                scheduledTime: new Date(scheduledTime).toISOString(),
                assignedCollectorId: selectedCollectorId || null,
                assignedCollectorName: selectedCollectorId
                    ? collectors.find(c => c._id === selectedCollectorId)?.name
                    : null,
            };

            await ScrapApi.createRequest(payload as any);

            setSuccess(true);
            setTimeout(() => {
                setItems([]);
                setScheduledTime('');
                setAddress(user.address || '');
                setSuccess(false);
                onSuccess?.();
                onClose?.();
            }, 1500);
        } catch (err) {
            console.error(err);
            setError('Failed to schedule pickup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-2">Schedule a Pickup</h1>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                    Add your scrap items and schedule a collection
                </p>

                {success && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
                        ✅ Pickup scheduled successfully
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex gap-2">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* MODE SELECTOR: Manual Entry vs Smart Scanner */}
                    <div className="flex gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setUseScannerMode(false)}
                            className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${!useScannerMode
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                                }`}
                        >
                            <Package size={18} /> Manual Entry
                        </button>
                        <button
                            type="button"
                            onClick={() => setUseScannerMode(true)}
                            className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${useScannerMode
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                                }`}
                        >
                            <Zap size={18} /> Smart Scanner
                        </button>
                    </div>

                    {/* SMART SCANNER MODE */}
                    {useScannerMode && (
                        <div className="mb-8 border-b pb-8">
                            <h2 className="text-xl font-bold mb-4 flex gap-2 items-center">
                                <Zap size={20} className="text-indigo-600" /> Smart Scrap Scanner
                            </h2>
                            <SmartScrapScanner
                                onItemsIdentified={handleItemsFromScanner}
                                rates={scrapRatesArray}
                                language={language}
                            />
                        </div>
                    )}

                    {/* MANUAL ENTRY MODE */}
                    {!useScannerMode && (
                        <div className="border-b pb-8">
                            <h2 className="text-xl font-bold mb-4 flex gap-2">
                                <Package /> Add Scrap Items Manually
                            </h2>

                            <select
                                value={currentItem.type}
                                onChange={(e) =>
                                    setCurrentItem({ ...currentItem, type: e.target.value as ScrapType })
                                }
                                className="w-full p-3 border border-zinc-300 rounded-lg mb-3 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            >
                                {Object.values(ScrapType).map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Weight (kg)"
                                value={currentItem.weightKg || ''}
                                onChange={(e) =>
                                    setCurrentItem({
                                        ...currentItem,
                                        weightKg: Number(e.target.value),
                                    })
                                }
                                className="w-full p-3 border border-zinc-300 rounded-lg mb-3 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            />

                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Plus size={18} /> Add Item
                            </button>
                        </div>
                    )}

                    {/* ITEMS LIST SUMMARY */}
                    {items.length > 0 && (
                        <div className="border-b pb-8">
                            <h3 className="text-lg font-bold mb-4 flex gap-2 items-center">
                                <Package size={20} className="text-emerald-600" /> Added Items ({items.length})
                            </h3>
                            <div className="space-y-3">
                                {items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                {item.type}
                                            </p>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                {item.weightKg} kg × ₹{scrapRates[item.type]}/kg = <span className="font-bold text-emerald-600">₹{item.estimatedPrice.toFixed(2)}</span>
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(i)}
                                            className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* TOTALS */}
                            <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-zinc-700 dark:text-zinc-300">Total Weight:</span>
                                    <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{totalWeight.toFixed(2)} kg</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-700 dark:text-zinc-300">Estimated Payout:</span>
                                    <span className="font-bold text-2xl text-emerald-600">₹{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PICKUP DETAILS */}
                    <div className="border-b pb-8">
                        <h2 className="text-xl font-bold mb-4 flex gap-2 items-center">
                            <Calendar size={20} /> Pickup Details
                        </h2>

                        <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">
                            Select Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full p-3 border border-zinc-300 rounded-lg mb-4 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        />

                        <label className="block text-sm font-semibold mb-2 text-zinc-700 dark:text-zinc-300">
                            Pickup Address
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-3 border border-zinc-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                            placeholder="Enter your full pickup address"
                            rows={3}
                        />
                    </div>

                    {/* COLLECTOR SELECTION */}
                    <div className="border-b pb-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Users size={20} /> Select Collector (Optional)
                        </h2>

                        {collectors.length > 0 ? (
                            <div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                    Choose a collector for this request
                                </p>
                                {/* COLLECTOR CARDS */}
                                <div className="grid grid-cols-1 gap-3">
                                    {collectors.map((collector) => (
                                        <button
                                            key={collector._id}
                                            type="button"
                                            onClick={() => setSelectedCollectorId(collector._id)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-start gap-4 text-left ${selectedCollectorId === collector._id
                                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                                                : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-emerald-400 hover:shadow-md'
                                                }`}
                                        >
                                            <div className={`p-3 rounded-lg font-bold flex-shrink-0 ${selectedCollectorId === collector._id
                                                ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                                                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                                                }`}>
                                                {collector.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold truncate ${selectedCollectorId === collector._id
                                                    ? 'text-emerald-900 dark:text-emerald-100'
                                                    : 'text-zinc-900 dark:text-zinc-100'
                                                    }`}>
                                                    {collector.name}
                                                </p>
                                                <p className={`text-xs mt-1 ${selectedCollectorId === collector._id
                                                    ? 'text-emerald-700 dark:text-emerald-300'
                                                    : 'text-zinc-600 dark:text-zinc-400'
                                                    }`}>
                                                    📍 {collector.area}
                                                </p>
                                                <p className={`text-xs mt-1 ${selectedCollectorId === collector._id
                                                    ? 'text-emerald-700 dark:text-emerald-300'
                                                    : 'text-zinc-600 dark:text-zinc-400'
                                                    }`}>
                                                    📱 {collector.phone}
                                                </p>
                                            </div>
                                            {selectedCollectorId === collector._id && (
                                                <div className="text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-400">
                                <p className="font-semibold">No collectors available</p>
                                <p className="text-sm mt-1">Your request will be sent to the pending queue and assigned automatically.</p>
                            </div>
                        )}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading || items.length === 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-400 text-white py-3 rounded-lg font-bold text-lg transition-colors"
                    >
                        {loading ? 'Scheduling Pickup...' : 'Schedule Pickup'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SchedulePickup;
