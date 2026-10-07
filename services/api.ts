import { PickupRequest } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

interface Collector {
  _id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
}

/**
 * Service for communicating with the MongoDB backend.
 * Provides methods for fetching and persisting pickup data.
 */
export const ScrapApi = {
  /**
   * Fetches all available collectors
   */
  async getCollectors(): Promise<Collector[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/collectors/list`);
      if (!response.ok) throw new Error('Failed to fetch collectors');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Failed to fetch collectors:', error);
      return [];
    }
  },

  /**
   * Fetches all pickup requests from the database.
   */
  async getAllRequests(): Promise<PickupRequest[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/collectors/requests`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // Map MongoDB _id to frontend id if necessary
      return data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        _id: item._id
      }));
    } catch (error) {
      console.warn('API Fetch failed, using local fallback:', error);
      throw error;
    }
  },

  /**
   * Fetches requests for a specific user (seller)
   */
  async getUserRequests(userId: string): Promise<PickupRequest[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/scrap/${userId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Failed to fetch requests (${response.status})`);
      }
      const data = await response.json();
      // Data is already an array
      return Array.isArray(data) ? data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        _id: item._id
      })) : [];
    } catch (error) {
      console.warn('Fetch user requests failed:', error);
      throw error;
    }
  },

  /**
   * Fetches pending requests for a specific collector
   */
  async getCollectorRequests(collectorId: string): Promise<PickupRequest[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/collectors/requests/${collectorId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
        _id: item._id
      }));
    } catch (error) {
      console.warn('Fetch collector requests failed:', error);
      throw error;
    }
  },

  /**
   * Persists a new pickup request to MongoDB.
   */
  async createRequest(request: Partial<PickupRequest>): Promise<PickupRequest> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/scrap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to create request (${response.status})`);
      }

      // Handle both nested and flat response structures
      const requestData = data.data || data;
      return {
        ...requestData,
        id: requestData._id || requestData.id,
        _id: requestData._id
      };
    } catch (error) {
      console.error('Create request failed:', error);
      throw error;
    }
  },

  /**
   * Accept a scrap request as a collector
   */
  async acceptRequest(requestId: string, collectorId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/collectors/accept-request/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectorId }),
      });

      if (!response.ok) throw new Error('Failed to accept request');
    } catch (error) {
      console.error('Accept request failed:', error);
      throw error;
    }
  },

  /**
   * Updates the status of an existing request.
   */
  async updateRequestStatus(id: string, status: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/collectors/request/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update request status');
    } catch (error) {
      console.error('Update request status failed:', error);
      throw error;
    }
  }
};
