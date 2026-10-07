// App.tsx
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashboard";
import SellerDashboard from "./components/SellerDashboard";
import CollectorDashboard from "./components/CollectorDashboard";
import CollectorList from "./components/CollectorList";
import CollectorRecords from "./components/CollectorRecords";
import UserRequests from "./components/UserRequests";
import SchedulePickup from "./components/SchedulePickup";
import FeedbackForm from "./components/FeedbackForm";

import {
  User,
  UserRole,
  AppView,
  Theme,
  Feedback,
  Language,
  PickupRequest,
} from "./types";

import { ScrapApi } from "./services/api";
import axios from "axios";

function App() {
  // ================= BASIC STATE =================
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>("dashboard");
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");

  // ================= DATA =================
  const [sellerRequests, setSellerRequests] = useState<PickupRequest[]>([]);
  const [collectorAvailableRequests, setCollectorAvailableRequests] = useState<PickupRequest[]>([]);
  const [collectorMyRequests, setCollectorMyRequests] = useState<PickupRequest[]>([]);
  const [registeredCollectors, setRegisteredCollectors] = useState<User[]>([]);
  const [registeredSellers, setRegisteredSellers] = useState<User[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const API_BASE = "http://localhost:5000/api/admin";

  // ================= FETCH FUNCTIONS =================
  const fetchSellerRequests = useCallback(async (userId: string) => {
    const requests = await ScrapApi.getUserRequests(userId);
    setSellerRequests(requests);
  }, []);

  const fetchCollectorRequests = useCallback(async () => {
    const requests = await ScrapApi.getAllRequests();
    setCollectorAvailableRequests(requests);
  }, []);

  const fetchCollectorMyRequests = useCallback(async (collectorId: string) => {
    const requests = await ScrapApi.getCollectorRequests(collectorId);
    setCollectorMyRequests(requests);
  }, []);

  const fetchAdminData = useCallback(async () => {
    const [c, s, f] = await Promise.all([
      axios.get(`${API_BASE}/collectors`),
      axios.get(`${API_BASE}/sellers`),
      axios.get(`${API_BASE}/feedbacks`),
    ]);
    setRegisteredCollectors(c.data);
    setRegisteredSellers(s.data);
    setFeedbacks(f.data);
  }, []);

  // ================= EFFECT =================
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") fetchAdminData();
    if (user.role === "seller") fetchSellerRequests(user._id);
    if (user.role === "collector") {
      fetchCollectorRequests();
      fetchCollectorMyRequests(user._id);
    }
  }, [
    user,
    fetchAdminData,
    fetchSellerRequests,
    fetchCollectorRequests,
    fetchCollectorMyRequests,
  ]);

  // ================= ACTIONS =================
  const handleAcceptRequest = async (requestId: string): Promise<void> => {
    if (!user) return;
    await ScrapApi.acceptRequest(requestId, user._id);
    fetchCollectorRequests();
    fetchCollectorMyRequests(user._id);
  };

  const handleClearCollectorData = () => {
    // Clear completed records
    setCollectorMyRequests(prev => prev.filter(r => r.status !== 'completed'));
  };

  const handleMarkAsCompleted = async (requestId: string) => {
    // Mark request as completed
    try {
      await ScrapApi.updateRequestStatus(requestId, 'completed');
      setCollectorMyRequests(prev =>
        prev.map(r => r._id === requestId ? { ...r, status: 'completed' } : r)
      );
      // Redirect to collection-logs after marking as completed
      setCurrentView('collection-logs');
    } catch (err) {
      console.error('Failed to mark request as completed:', err);
    }
  };

  // ================= FEEDBACK SUBMIT =================
  const handleFeedbackSubmit = async (data: { rating: number; category: string; comment: string }) => {
    if (!user) return;

    try {
      const feedback: Feedback = {
        _id: Date.now().toString(),
        rating: data.rating,
        category: data.category,
        comment: data.comment,
        userName: user.name,
        userRole: user.role,
        date: new Date().toISOString(),
      };

      await axios.post("http://localhost:5000/api/feedback", feedback);
      setCurrentView("dashboard");
    } catch (error) {
      console.error("❌ Feedback submit failed:", error);
    }
  };

  // ================= LOGIN =================
  const handleLogin = (
    role: UserRole,
    name: string,
    email: string,
    extraData?: any
  ) => {
    setUser({
      _id: extraData?.existingUser?._id || Date.now().toString(),
      name,
      email,
      role,
      impact: { treesSaved: 0, waterSaved: 0, energySaved: 0 },
      ...extraData?.existingUser,
    });
  };

  // ================= RENDER =================
  const renderContent = () => {
    if (!user) {
      return <Auth onLogin={handleLogin} language={language} theme={theme} />;
    }

    // ================= ADMIN =================
    if (user.role === "admin") {
      const handleVerifyCollector = async (id: string, status: boolean) => {
        try {
          console.log("🔄 Verifying collector:", id, status);
          await axios.patch(`${API_BASE}/collectors/${id}/verify`, { status });
          setRegisteredCollectors(prev =>
            prev.map(c => c._id === id ? { ...c, isVerified: status } : c)
          );
          console.log("✅ Collector verified successfully");
        } catch (err) {
          console.error('❌ Failed to verify collector:', err);
        }
      };

      const handleRemoveCollector = async (id: string) => {
        try {
          await axios.delete(`${API_BASE}/collectors/${id}`);
          setRegisteredCollectors(prev => prev.filter(c => c._id !== id));
        } catch (err) {
          console.error('Failed to remove collector:', err);
        }
      };

      const handleRemoveSeller = async (id: string) => {
        try {
          await axios.delete(`${API_BASE}/sellers/${id}`);
          setRegisteredSellers(prev => prev.filter(s => s._id !== id));
        } catch (err) {
          console.error('Failed to remove seller:', err);
        }
      };

      const handleRemoveFeedback = async (id: string) => {
        try {
          await axios.delete(`${API_BASE}/feedbacks/${id}`);
          setFeedbacks(prev => prev.filter(f => f._id !== id));
        } catch (err) {
          console.error('Failed to remove feedback:', err);
        }
      };

      return (
        <AdminDashboard
          collectors={registeredCollectors}
          sellers={registeredSellers}
          feedbacks={feedbacks}
          onVerifyCollector={handleVerifyCollector}
          onRemoveCollector={handleRemoveCollector}
          onRemoveSeller={handleRemoveSeller}
          onRemoveFeedback={handleRemoveFeedback}
        />
      );
    }

    // ================= COLLECTOR =================
    if (user.role === "collector") {
      // ================= COLLECTOR: COLLECTION LOGS =================
      if (currentView === "collection-logs") {
        return (
          <div className="space-y-6">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <CollectorRecords
              requests={collectorMyRequests.filter(r => r.status === 'completed')}
              onClearData={handleClearCollectorData}
            />
          </div>
        );
      }

      // ================= COLLECTOR: ROUTE =================
      if (currentView === "route") {
        const acceptedRequests = collectorMyRequests.filter(r => r.status === 'accepted');
        return (
          <div className="space-y-6">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">🚗</span> Today's Route ({acceptedRequests.length})
              </h2>
              {acceptedRequests.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-lg">No stops scheduled</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptedRequests.map((req, idx) => (
                    <div key={req._id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{req.sellerName}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{req.address}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">₹{req.totalPrice}</p>
                          <p className="text-sm text-slate-500">{req.totalWeight} kg</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMarkAsCompleted(req._id)}
                        className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        ✓ Mark as Completed
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      // ================= COLLECTOR: MANAGE RATES =================
      if (currentView === "manage-rates") {
        const scrapRates = [
          { type: 'Paper', rate: 14.5 },
          { type: 'Metal', rate: 42 },
          { type: 'Plastic', rate: 18 },
          { type: 'Glass', rate: 8 },
          { type: 'E-Waste', rate: 85 },
          { type: 'Other', rate: 5 },
        ];
        return (
          <div className="space-y-6">
            <button
              onClick={() => setCurrentView("dashboard")}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-2xl">💹</span> Current Market Rates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scrapRates.map((item) => (
                  <div key={item.type} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.type}</span>
                      <span className="text-lg font-bold text-emerald-600">₹{item.rate}/kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      return (
        <CollectorDashboard
          user={user}
          language={language}
          requests={collectorMyRequests}
          onNavigate={setCurrentView}
          onToggleStatus={() => { }}
          onAcceptRequest={handleAcceptRequest}
        />
      );
    }

    // ================= SELLER =================
    if (currentView === "schedule") {
      return (
        <SchedulePickup
          user={user}
          language={language}
          onClose={() => setCurrentView("dashboard")}
          onSuccess={() => fetchSellerRequests(user._id)}
        />
      );
    }

    if (currentView === "my-requests") {
      return <UserRequests requests={sellerRequests} language={language} />;
    }

    // ================= FEEDBACK =================
    if (currentView === "feedback") {
      return (
        <FeedbackForm
          language={language}
          onBack={() => setCurrentView("dashboard")}
          userName={user.name}
          userRole={user.role}
          onSubmit={handleFeedbackSubmit} // matches updated FeedbackForm props
        />
      );
    }

    return (
      <SellerDashboard
        user={user}
        language={language}
        requests={sellerRequests}
        onNavigate={setCurrentView}
      />
    );
  };

  // ================= LAYOUT =================
  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Navbar
        user={user}
        onLogout={() => setUser(null)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="max-w-7xl mx-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
