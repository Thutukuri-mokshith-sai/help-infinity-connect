export interface User {
  id: string;
  username: string;
  email: string;
  location: string;
  donationCount: number;
  createdAt: string;
}

export interface Donation {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'Available' | 'Claimed';
  donor: string;
  donorId: string;
  date: string;
  imageUrl?: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  requester: string;
  requesterId: string;
  date: string;
  fulfilled: boolean;
}

export interface Notification {
  id: string;
  type: 'donation' | 'claim' | 'request' | 'certificate';
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
}

export type Category = 'Clothes' | 'Food' | 'Books' | 'Electronics' | 'Furniture' | 'Others';
