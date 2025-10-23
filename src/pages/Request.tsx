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
import { getCurrentUser, addRequest, addNotification } from '@/utils/storage';
import { Request as RequestType, Category } from '@/types';
import { HandHeart, Tag, FileText, List, MapPin, Send } from 'lucide-react';

const categories: Category[] = ['Clothes', 'Food', 'Books', 'Electronics', 'Furniture', 'Others'];

const Request = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = getCurrentUser();

  if (!user) {
    toast.error('Please login to post a request');
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const request: RequestType = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      location: formData.get('location') as string,
      requester: user.username,
      requesterId: user.id,
      date: new Date().toISOString(),
      fulfilled: false,
    };

    setTimeout(() => {
      addRequest(request);
      
      // Add notification
      addNotification({
        id: Date.now().toString(),
        type: 'request',
        message: `Your request "${request.title}" has been posted successfully!`,
        timestamp: new Date().toISOString(),
        read: false,
        userId: user.id,
      });

      toast.success('Request posted successfully! We hope you find help soon!');
      setIsLoading(false);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-medium animate-fade-in">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4">
              <HandHeart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
              Post a Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  <Tag className="w-4 h-4 inline mr-2" />
                  What do you need?
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="e.g., School supplies for children"
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
                  placeholder="Explain your need in detail..."
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                <Send className="w-4 h-4" />
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Request;
