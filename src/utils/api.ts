// API Base URL - Update this to your backend URL
export const API_BASE_URL = 'http://localhost:3000/api';

// Token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// API call helper
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  location: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user_details: {
    user_id: number;
    name: string;
    email: string;
    location: string;
    phone_number?: string;
  };
}

export const authApi = {
  register: (data: RegisterData) => apiCall<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data: LoginData) => apiCall<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMe: () => apiCall<any>('/users/me'),
};

// Donations API
export interface CreateDonationData {
  title: string;
  description: string;
  category: string;
  location: string;
  latitude: number;
  longitude: number;
  contact: string;
}

export interface DonationResponse {
  donation_id: number;
  donor_id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude: string;
  longitude: string;
  contact_number: string;
  status: 'Available' | 'Claimed' | 'Completed' | 'Canceled';
  date_posted: string;
  claimed_by_id?: number;
  date_claimed?: string;
  Donor?: {
    name: string;
    phone_number?: string;
  };
  Claimant?: {
    name: string;
  };
}

export interface DonationFilters {
  category?: string;
  status?: string;
  location_search?: string;
  user_lat?: number;
  user_lng?: number;
}

export const donationsApi = {
  create: (data: CreateDonationData) => apiCall<DonationResponse>('/donations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getAll: (filters?: DonationFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.location_search) params.append('location_search', filters.location_search);
    if (filters?.user_lat) params.append('user_lat', filters.user_lat.toString());
    if (filters?.user_lng) params.append('user_lng', filters.user_lng.toString());
    
    return apiCall<DonationResponse[]>(`/donations?${params.toString()}`);
  },

  getById: (id: number) => apiCall<DonationResponse>(`/donations/${id}`),

  claim: (id: number) => apiCall<{ message: string }>(`/donations/${id}/claim`, {
    method: 'POST',
  }),

  getMyDonations: () => apiCall<DonationResponse[]>('/users/me/donations'),
};

// Requests API
export interface CreateRequestData {
  title: string;
  description: string;
  category: string;
  location: string;
  latitude: number;
  longitude: number;
  contact: string;
}

export interface RequestResponse {
  request_id: number;
  requester_id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude: string;
  longitude: string;
  contact_number: string;
  status: 'Active' | 'Fulfilled' | 'Canceled';
  date_posted: string;
  Requester?: {
    name: string;
  };
}

export interface RequestFilters {
  category?: string;
  status?: string;
  location_search?: string;
}

export const requestsApi = {
  create: (data: CreateRequestData) => apiCall<RequestResponse>('/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getAll: (filters?: RequestFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.location_search) params.append('location_search', filters.location_search);
    
    return apiCall<RequestResponse[]>(`/requests?${params.toString()}`);
  },

  getMyRequests: () => apiCall<RequestResponse[]>('/users/me/requests'),
};

// Dashboard API
export interface DashboardStats {
  totalDonations: number;
  claimedDonations: number;
  totalRequests: number;
  activeUsers: number;
}

export interface RecentItemsResponse {
  recentDonations: DonationResponse[];
  recentRequests: RequestResponse[];
}

export const dashboardApi = {
  getStats: () => apiCall<DashboardStats>('/dashboard/stats'),
  getRecent: () => apiCall<RecentItemsResponse>('/dashboard/recent'),
};

// Notifications API
export interface NotificationResponse {
  notification_id: number;
  user_id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  is_read: boolean;
  date_created: string;
  related_entity_id?: number;
  related_entity_type?: string;
}

export const notificationsApi = {
  getAll: () => apiCall<NotificationResponse[]>('/notifications'),
  
  markAsRead: (id?: number) => apiCall<{ message: string }>('/notifications/mark-read', {
    method: 'POST',
    body: JSON.stringify(id ? { id } : {}),
  }),
};
