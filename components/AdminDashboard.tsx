import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  Trash2,
  AlertCircle,
  MapPin,
  Search,
  Users,
  MessageSquare,
  Star,
} from "lucide-react";
import { User, Feedback } from "../types";

interface Props {
  collectors: User[];
  sellers: User[];
  feedbacks: Feedback[];
  onVerifyCollector: (id: string, status: boolean) => void;
  onRemoveCollector: (id: string) => void;
  onRemoveSeller: (id: string) => void;
  onRemoveFeedback: (id: string) => void;
}

interface ConfirmDialog {
  type: 'approve' | 'reject' | 'remove-collector' | 'remove-seller' | 'remove-feedback';
  id: string;
  name?: string;
}

const AdminDashboard: React.FC<Props> = ({
  collectors,
  sellers,
  feedbacks,
  onVerifyCollector,
  onRemoveCollector,
  onRemoveSeller,
  onRemoveFeedback,
}) => {
  const [activeTab, setActiveTab] = useState<'collectors' | 'sellers' | 'feedback'>('collectors');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(null);

  const pendingCollectors = collectors.filter(c => !c.isVerified);
  const verifiedCollectors = collectors.filter(c => c.isVerified);

  // Search filtering
  const filteredVerifiedCollectors = useMemo(() => {
    return verifiedCollectors.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [verifiedCollectors, searchTerm]);

  const filteredSellers = useMemo(() => {
    return sellers.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sellers, searchTerm]);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(f =>
      f.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [feedbacks, searchTerm]);

  const setLoading = (id: string, isLoading: boolean) => {
    setLoadingIds(prev => {
      const newSet = new Set(prev);
      if (isLoading) newSet.add(id);
      else newSet.delete(id);
      return newSet;
    });
  };

  const handleApprove = async (id: string, name: string) => {
    setConfirmDialog({ type: 'approve', id, name });
  };

  const handleReject = async (id: string, name: string) => {
    setConfirmDialog({ type: 'reject', id, name });
  };

  const confirmAction = async () => {
    if (!confirmDialog) return;

    setLoading(confirmDialog.id, true);
    try {
      if (confirmDialog.type === 'approve') {
        onVerifyCollector(confirmDialog.id, true);
      } else if (confirmDialog.type === 'reject') {
        onVerifyCollector(confirmDialog.id, false);
      } else if (confirmDialog.type === 'remove-collector') {
        onRemoveCollector(confirmDialog.id);
      } else if (confirmDialog.type === 'remove-seller') {
        onRemoveSeller(confirmDialog.id);
      } else if (confirmDialog.type === 'remove-feedback') {
        onRemoveFeedback(confirmDialog.id);
      }
    } finally {
      setLoading(confirmDialog.id, false);
      setConfirmDialog(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage collectors, sellers, and feedback
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase">Pending</p>
            <p className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingCollectors.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase">Verified</p>
            <p className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">{verifiedCollectors.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase">Sellers</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{sellers.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold uppercase">Feedback</p>
            <p className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">{feedbacks.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => { setActiveTab('collectors'); setSearchTerm(''); }}
              className={`flex-1 py-4 px-4 font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'collectors'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <Users size={18} /> Collectors
            </button>
            <button
              onClick={() => { setActiveTab('sellers'); setSearchTerm(''); }}
              className={`flex-1 py-4 px-4 font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'sellers'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <Users size={18} /> Sellers
            </button>
            <button
              onClick={() => { setActiveTab('feedback'); setSearchTerm(''); }}
              className={`flex-1 py-4 px-4 font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'feedback'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              <MessageSquare size={18} /> Feedback
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Search Bar */}
            {(activeTab !== 'feedback' || feedbacks.length > 0) && (
              <div className="mb-6 relative">
                <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                />
              </div>
            )}

            {/* COLLECTORS TAB */}
            {activeTab === 'collectors' && (
              <div className="space-y-6">
                {/* Pending Section */}
                {pendingCollectors.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <AlertCircle size={20} /> Pending Approvals ({pendingCollectors.length})
                    </h3>
                    <div className="space-y-3">
                      {pendingCollectors.map(c => (
                        <div
                          key={c._id}
                          className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-5 hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{c.name}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{c.email}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                License: <span className="font-mono">{c.licenseNumber || "N/A"}</span>
                              </p>
                            </div>
                            <span className="text-xs font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full">
                              {c.operationalArea || "N/A"}
                            </span>
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleApprove(c._id, c.name)}
                              disabled={loadingIds.has(c._id)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                            >
                              {loadingIds.has(c._id) ? (
                                <>
                                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={16} />
                                  Approve
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReject(c._id, c.name)}
                              disabled={loadingIds.has(c._id)}
                              className="flex-1 border-2 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 text-red-600 dark:text-red-400 py-2 px-4 rounded-lg text-sm font-bold transition-all"
                            >
                              {loadingIds.has(c._id) ? 'Processing...' : 'Reject'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verified Section */}
                <div>
                  <h3 className="font-bold text-lg mb-4 text-emerald-600 dark:text-emerald-400">
                    ✓ Verified Collectors ({filteredVerifiedCollectors.length})
                  </h3>
                  {filteredVerifiedCollectors.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 py-8 text-center">
                      {searchTerm ? 'No verified collectors match your search' : 'No verified collectors'}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {filteredVerifiedCollectors.map(c => (
                        <div
                          key={c._id}
                          className="bg-white dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-all flex justify-between items-center"
                        >
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{c.email}</p>
                            <p className="text-xs flex items-center gap-1 text-slate-500 dark:text-slate-500 mt-1">
                              <MapPin size={12} /> {c.operationalArea || "N/A"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setConfirmDialog({ type: 'remove-collector', id: c._id, name: c.name })}
                            disabled={loadingIds.has(c._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                            title="Remove collector"
                          >
                            {loadingIds.has(c._id) ? (
                              <span className="inline-block w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SELLERS TAB */}
            {activeTab === 'sellers' && (
              <div>
                <h3 className="font-bold text-lg mb-4">Sellers ({filteredSellers.length})</h3>
                {filteredSellers.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 py-8 text-center">
                    {searchTerm ? 'No sellers match your search' : 'No sellers registered'}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {filteredSellers.map(s => (
                      <div
                        key={s._id}
                        className="bg-white dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-all flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{s.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{s.email}</p>
                          {s.phone && (
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">📱 {s.phone}</p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setConfirmDialog({ type: 'remove-seller', id: s._id, name: s.name })}
                          disabled={loadingIds.has(s._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                          title="Remove seller"
                        >
                          {loadingIds.has(s._id) ? (
                            <span className="inline-block w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FEEDBACK TAB */}
            {activeTab === 'feedback' && (
              <div>
                <h3 className="font-bold text-lg mb-4">Feedback ({filteredFeedbacks.length})</h3>
                {filteredFeedbacks.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 py-8 text-center">
                    {searchTerm ? 'No feedback matches your search' : 'No feedback received'}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredFeedbacks.map(f => (
                      <div
                        key={f._id}
                        className="bg-white dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{f.userName}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                              {f.userRole} • {new Date(f.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < f.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 italic">"{f.comment}"</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                            {f.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => setConfirmDialog({ type: 'remove-feedback', id: f._id, name: f.userName })}
                            disabled={loadingIds.has(f._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
                            title="Remove feedback"
                          >
                            {loadingIds.has(f._id) ? (
                              <span className="inline-block w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full p-6 animate-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Action</h3>
            </div>

            <p className="text-slate-700 dark:text-slate-300 mb-6">
              {confirmDialog.type === 'approve' && `Approve ${confirmDialog.name} as a collector?`}
              {confirmDialog.type === 'reject' && `Reject ${confirmDialog.name} as a collector?`}
              {confirmDialog.type === 'remove-collector' && `Remove collector "${confirmDialog.name}"? This cannot be undone.`}
              {confirmDialog.type === 'remove-seller' && `Remove seller "${confirmDialog.name}"? This cannot be undone.`}
              {confirmDialog.type === 'remove-feedback' && `Remove feedback from ${confirmDialog.name}? This cannot be undone.`}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
              >
                {confirmDialog.type === 'approve' ? 'Approve' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
