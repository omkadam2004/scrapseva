import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import { User, Feedback } from "../types";
import axios from "axios";

const AdminPage: React.FC = () => {
  const [collectors, setCollectors] = useState<User[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ---------------- FETCH FUNCTIONS ----------------

  const fetchCollectors = async () => {
    try {
      const res = await axios.get<User[]>("/api/admin/collectors");
      setCollectors(res.data);
    } catch (error: unknown) {
      console.error("Error fetching collectors:", error);
    }
  };

  const fetchSellers = async () => {
    try {
      const res = await axios.get<User[]>("/api/admin/sellers");
      setSellers(res.data);
    } catch (error: unknown) {
      console.error("Error fetching sellers:", error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get<Feedback[]>("/api/admin/feedbacks");
      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchCollectors(),
          fetchSellers(),
          fetchFeedbacks(),
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ---------------- ACTIONS ----------------

  // ✅ APPROVE / REJECT COLLECTOR
  const handleVerifyCollector = async (id: string, status: boolean) => {
    try {
      console.log("🔄 Attempting to verify collector:", { id, status });
      const endpoint = `/api/admin/collectors/${id}/verify`;
      console.log("📤 Sending PATCH to:", endpoint);

      const response = await axios.patch(endpoint, { status });
      console.log("✅ Response received:", response.data);

      await fetchCollectors();
      console.log("🔃 Collectors refetched");

      alert(
        status
          ? "Collector approved successfully!"
          : "Collector rejected successfully!"
      );
    } catch (error: unknown) {
      console.error("❌ Verify collector error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to verify collector: ${errorMessage}`);
    }
  };

  // ❌ REMOVE COLLECTOR
  const handleRemoveCollector = async (id: string) => {
    try {
      await axios.delete(`/api/admin/collectors/${id}`);
      await fetchCollectors();
      alert("Collector removed successfully!");
    } catch (error: unknown) {
      console.error("Remove collector error:", error);
      alert("Failed to remove collector");
    }
  };

  // ❌ REMOVE SELLER
  const handleRemoveSeller = async (id: string) => {
    try {
      await axios.delete(`/api/admin/sellers/${id}`);
      await fetchSellers();
      alert("Seller removed successfully!");
    } catch (error: unknown) {
      console.error("Remove seller error:", error);
      alert("Failed to remove seller");
    }
  };

  // ❌ REMOVE FEEDBACK
  const handleRemoveFeedback = async (id: string) => {
    try {
      await axios.delete(`/api/admin/feedbacks/${id}`);
      await fetchFeedbacks();
      alert("Feedback removed successfully!");
    } catch (error: unknown) {
      console.error("Remove feedback error:", error);
      alert("Failed to remove feedback");
    }
  };

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <AdminDashboard
      collectors={collectors}
      sellers={sellers}
      feedbacks={feedbacks}
      onVerifyCollector={handleVerifyCollector}
      onRemoveCollector={handleRemoveCollector}
      onRemoveSeller={handleRemoveSeller}
      onRemoveFeedback={handleRemoveFeedback}
    />
  );
};

export default AdminPage;
