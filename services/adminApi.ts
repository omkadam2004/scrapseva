import axios from "axios";

const API_URL = "http://localhost:5000/api/admin"; // your backend URL

export const getCollectors = async (token: string) => {
  const res = await axios.get(`${API_URL}/collectors`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const verifyCollector = async (id: string, token: string) => {
  const res = await axios.put(`${API_URL}/verify-collector/${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const removeCollector = async (id: string, token: string) => {
  const res = await axios.delete(`${API_URL}/collector/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getSellers = async (token: string) => {
  const res = await axios.get(`${API_URL}/sellers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const removeSeller = async (id: string, token: string) => {
  const res = await axios.delete(`${API_URL}/seller/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getFeedbacks = async (token: string) => {
  const res = await axios.get(`${API_URL}/feedbacks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const removeFeedback = async (id: string, token: string) => {
  const res = await axios.delete(`${API_URL}/feedback/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
