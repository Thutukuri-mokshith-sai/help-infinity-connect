import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { donationsApi } from '@/utils/api';
import { Category } from '@/types';
import { Gift, Tag, FileText, List, MapPin, Send, Phone } from 'lucide-react';

const categories: Category[] = ['Clothes', 'Food', 'Books', 'Electronics', 'Furniture', 'Others'];

const Donate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    toast.error('Please login to donate');
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      await donationsApi.create({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        location: formData.get('location') as string,
        latitude: 0, // You can implement geolocation later
        longitude: 0,
        contact: formData.get('contact') as string,
      });

      toast.success('Donation listed successfully! Thank you for your generosity!');
      navigate('/browse');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create donation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-medium animate-fade-in">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
              Add Your Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="e.g., Winter Clothes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Describe your donation in detail..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  <List className="w-4 h-4 inline mr-2" />
                  Category
                </Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  required
                  defaultValue={user.location}
                  placeholder="e.g., New York"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Contact Number
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  required
                  defaultValue={user.phone_number}
                  placeholder="Your contact number"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                <Send className="w-4 h-4" />
                {isLoading ? 'Submitting...' : 'Submit Donation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donate;
