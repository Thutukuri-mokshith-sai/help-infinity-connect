// Calculate distance between two locations (simplified version using string comparison)
// In a real app, you'd use geocoding and actual distance calculation
export const calculateDistance = (location1: string, location2: string): number => {
  const loc1 = location1.toLowerCase().trim();
  const loc2 = location2.toLowerCase().trim();
  
  // Exact match
  if (loc1 === loc2) return 0;
  
  // Same district/city partial match
  if (loc1.includes(loc2) || loc2.includes(loc1)) return 5;
  
  // Different locations
  return 100;
};

export const sortByLocation = <T extends { location: string }>(
  items: T[],
  userLocation: string
): T[] => {
  return [...items].sort((a, b) => {
    const distA = calculateDistance(a.location, userLocation);
    const distB = calculateDistance(b.location, userLocation);
    return distA - distB;
  });
};

// Get popular Andhra Pradesh cities for autocomplete
export const getPopularCities = (): string[] => {
  return [
    'Madanapalle',
    'Visakhapatnam',
    'Vijayawada',
    'Guntur',
    'Nellore',
    'Kurnool',
    'Tirupati',
    'Rajahmundry',
    'Kakinada',
    'Anantapur',
    'Kadapa',
    'Eluru',
    'Ongole',
    'Chittoor',
    'Srikakulam',
    'Nandyal',
    'Machilipatnam',
    'Proddatur',
    'Tenali',
    'Adoni',
    'Hindupur',
    'Bhimavaram',
    'Amaravati',
    'Tadepalligudem',
    'Dharmavaram',
    'Gudivada',
    'Narasaraopet',
  ];
};
