import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';
import { donationsApi, DonationResponse } from '@/utils/api';
import { Category } from '@/types';
import { toast } from 'sonner';
import { Search, Filter, MapPin, User, Calendar, Shirt, Utensils, Book, Laptop, Sofa, Package, HandHeart } from 'lucide-react';

const categories: Category[] = ['Clothes', 'Food', 'Books', 'Electronics', 'Furniture', 'Others'];

const categoryIcons = {
  Clothes: Shirt,
  Food: Utensils,
  Books: Book,
  Electronics: Laptop,
  Furniture: Sofa,
  Others: Package,
};

const Browse = () => {
  const [donations, setDonations] = useState<DonationResponse[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDonations();
  }, [categoryFilter, statusFilter]);

  const loadDonations = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (categoryFilter && categoryFilter !== 'all') filters.category = categoryFilter;
      if (statusFilter && statusFilter !== 'all') filters.status = statusFilter;
      
      const data = await donationsApi.getAll(filters);
      setDonations(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async (donationId: number) => {
    if (!user) {
      toast.error('Please login to claim donations');
      return;
    }

    try {
      await donationsApi.claim(donationId);
      toast.success('Donation claimed successfully! Check notifications for details.');
      loadDonations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to claim donation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            <Search className="w-8 h-8 inline mr-2" />
            Browse Available Donations
          </h1>
          <p className="text-muted-foreground">
            {user ? `Welcome, ${user.name}!` : 'Login to claim donations'}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-soft animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">
                  <Filter className="w-4 h-4 inline mr-2" />
                  Category
                </Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label className="text-sm font-medium mb-2 block">
                  <Filter className="w-4 h-4 inline mr-2" />
                  Status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Claimed">Claimed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(categoryFilter || statusFilter) && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCategoryFilter('');
                      setStatusFilter('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Donations Grid */}
        {isLoading ? (
          <Card className="p-12 text-center animate-fade-in">
            <p className="text-muted-foreground">Loading donations...</p>
          </Card>
        ) : donations.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No donations found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or check back later</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation, index) => {
              const Icon = categoryIcons[donation.category as Category] || Package;
              
              return (
                <Card
                  key={donation.donation_id}
                  className="overflow-hidden hover:shadow-medium transition-all hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-40 bg-gradient-primary flex items-center justify-center">
                    <Icon className="w-20 h-20 text-white" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{donation.title}</h3>
                    <Badge className="mb-3">
                      <Icon className="w-3 h-3 mr-1" />
                      {donation.category}
                    </Badge>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{donation.description}</p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {donation.location}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {donation.Donor?.name || 'Anonymous'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(donation.date_posted).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant={donation.status === 'Available' ? 'default' : 'secondary'}>
                        {donation.status}
                      </Badge>
                      {donation.status === 'Available' && user && donation.donor_id !== user.user_id && (
                        <Button size="sm" onClick={() => handleClaim(donation.donation_id)}>
                          <HandHeart className="w-4 h-4" />
                          Claim
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
