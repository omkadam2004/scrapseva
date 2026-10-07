export type UserRole = 'seller' | 'collector' | 'admin';
export type Language = 'en' | 'hi' | 'mr';
export type Theme = 'light' | 'dark';

export enum ScrapType {
  Paper = 'Paper',
  Plastic = 'Plastic',
  Metal = 'Metal',
  Glass = 'Glass',
  E_Waste = 'E-Waste',
  Other = 'Other',
}

/* ================= ADMIN TYPES ================= */

export interface ScrapRate {
  type: ScrapType;
  pricePerKg: number;
}

export interface RevenueLog {
  _id: string;
  date: string;
  orderId: string;
  collectorName: string;
  transactionAmount: number;
  commissionRate: number;
  profitEarned: number;
}

export interface Feedback {
  _id: string;
  userName: string;
  userRole: UserRole;
  rating: number;
  category: string;
  comment: string;
  date: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatar: string;
}

/* ================= USER ================= */

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;

  // Seller
  address?: string;
  phone?: string;

  // Impact
  impact?: {
    treesSaved?: number;
    waterSaved?: number;
    energySaved?: number;
  };

  // Collector
  licenseNumber?: string;
  operationalArea?: string;
  isVerified?: boolean;
  isOnline?: boolean;
  rates?: ScrapRate[];
  rating?: number;
  businessName?: string;
  experienceYears?: number;
}

/* ================= SCRAP ================= */

export interface ScrapItem {
  type: ScrapType;
  weightKg: number;
  estimatedPrice: number;
  description?: string;
}

export interface PickupRequest {
  _id: string;               // MongoDB ID
  id?: string;               // Alias for _id
  userId: string;            // REQUIRED
  sellerName: string;

  collectorId?: string;
  items: ScrapItem[];

  totalWeight: number;
  totalPrice: number;
  address: string;

  coordinates?: {
    lat: number;
    lng: number;
  };

  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  scheduledTime: string | Date;

  distance?: number;
  clearedByCollector?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

/* ================= APP ================= */

export type AppView =
  | 'dashboard'
  | 'collection-logs'
  | 'schedule'
  | 'route'
  | 'manage-rates'
  | 'profile'
  | 'admin'
  | 'my-requests'
  | 'find-collectors'
  | 'collector-profile'
  | 'booking-success'
  | 'feedback';
