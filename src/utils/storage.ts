import { User, Donation, Request, Notification } from '@/types';

const STORAGE_KEYS = {
  USER: 'helpinfinity_user',
  USERS: 'helpinfinity_users',
  DONATIONS: 'helpinfinity_donations',
  REQUESTS: 'helpinfinity_requests',
  NOTIFICATIONS: 'helpinfinity_notifications',
};

// User operations
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export const getAllUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const addUser = (user: User): void => {
  const users = getAllUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const updateUser = (userId: string, updates: Partial<User>): void => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  }
};

// Donation operations
export const getDonations = (): Donation[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DONATIONS);
  return data ? JSON.parse(data) : [];
};

export const addDonation = (donation: Donation): void => {
  const donations = getDonations();
  donations.unshift(donation);
  localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
};

export const updateDonation = (id: string, updates: Partial<Donation>): void => {
  const donations = getDonations();
  const index = donations.findIndex(d => d.id === id);
  if (index !== -1) {
    donations[index] = { ...donations[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
  }
};

// Request operations
export const getRequests = (): Request[] => {
  const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  return data ? JSON.parse(data) : [];
};

export const addRequest = (request: Request): void => {
  const requests = getRequests();
  requests.unshift(request);
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
};

// Notification operations
export const getNotifications = (userId: string): Notification[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const all: Notification[] = data ? JSON.parse(data) : [];
  return all.filter(n => n.userId === userId).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const addNotification = (notification: Notification): void => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifications: Notification[] = data ? JSON.parse(data) : [];
  notifications.push(notification);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const markNotificationAsRead = (id: string): void => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifications: Notification[] = data ? JSON.parse(data) : [];
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }
};

export const markAllNotificationsAsRead = (userId: string): void => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  const notifications: Notification[] = data ? JSON.parse(data) : [];
  notifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

// Initialize with sample data
export const initializeSampleData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
    const sampleDonations: Donation[] = [
      {
        id: Date.now().toString() + '1',
        title: 'Winter Clothes Collection',
        description: 'Warm jackets, sweaters, and blankets in excellent condition.',
        category: 'Clothes',
        location: 'New York',
        status: 'Available',
        donor: 'Sarah Johnson',
        donorId: 'sample1',
        date: new Date().toISOString(),
      },
      {
        id: Date.now().toString() + '2',
        title: 'Study Books - High School',
        description: 'Mathematics, Science, and English textbooks for grades 9-12.',
        category: 'Books',
        location: 'Los Angeles',
        status: 'Available',
        donor: 'Michael Chen',
        donorId: 'sample2',
        date: new Date().toISOString(),
      },
      {
        id: Date.now().toString() + '3',
        title: 'Laptop for Students',
        description: 'Working laptop with charger, suitable for online learning.',
        category: 'Electronics',
        location: 'Chicago',
        status: 'Available',
        donor: 'Emily Rodriguez',
        donorId: 'sample3',
        date: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(sampleDonations));
  }

  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    const sampleRequests: Request[] = [
      {
        id: Date.now().toString() + '100',
        title: 'Need School Supplies',
        description: 'Looking for notebooks, pens, and basic stationery for children.',
        category: 'Others',
        location: 'Boston',
        requester: 'Community Member',
        requesterId: 'sample4',
        date: new Date().toISOString(),
        fulfilled: false,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(sampleRequests));
  }
};
