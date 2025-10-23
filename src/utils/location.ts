// Calculate distance between two locations (simplified version using string comparison)
// In a real app, you'd use geocoding and actual distance calculation
export const calculateDistance = (location1: string, location2: string): number => {
  const loc1 = location1.toLowerCase().trim();
  const loc2 = location2.toLowerCase().trim();
  
  // Exact match
  if (loc1 === loc2) return 0;
  
  // Same state/city partial match
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

// Get popular US cities for autocomplete
export const getPopularCities = (): string[] => {
  return [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose',
    'Austin',
    'Jacksonville',
    'Fort Worth',
    'Columbus',
    'Charlotte',
    'San Francisco',
    'Indianapolis',
    'Seattle',
    'Denver',
    'Boston',
    'Miami',
    'Atlanta',
    'Las Vegas',
    'Portland',
    'Detroit',
  ];
};
