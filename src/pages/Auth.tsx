import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getAllUsers, addUser, setCurrentUser } from '@/utils/storage';
import { User } from '@/types';
import { UserCircle, Mail, Lock, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPopularCities } from '@/utils/location';

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('login-username') as string;
    const password = formData.get('login-password') as string;

    const users = getAllUsers();
    const user = users.find(u => u.username === username);

    setTimeout(() => {
      if (user) {
        setCurrentUser(user);
        toast.success(`Welcome back, ${user.username}!`);
        navigate('/');
      } else {
        toast.error('Invalid username or password');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('register-username') as string;
    const email = formData.get('register-email') as string;
    const password = formData.get('register-password') as string;
    const location = formData.get('register-location') as string;

    const users = getAllUsers();
    const existingUser = users.find(u => u.username === username || u.email === email);

    setTimeout(() => {
      if (existingUser) {
        toast.error('Username or email already exists');
        setIsLoading(false);
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        location,
        donationCount: 0,
        createdAt: new Date().toISOString(),
      };

      addUser(newUser);
      setCurrentUser(newUser);
      toast.success(`Account created successfully! Welcome, ${username}!`);
      navigate('/');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-strong animate-zoom-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
            Welcome to HelpInfinity
          </CardTitle>
          <CardDescription>Join our community of kindness</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">
                    <UserCircle className="w-4 h-4 inline mr-2" />
                    Username
                  </Label>
                  <Input
                    id="login-username"
                    name="login-username"
                    required
                    placeholder="Enter your username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    name="login-password"
                    type="password"
                    required
                    placeholder="Enter your password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">
                    <UserCircle className="w-4 h-4 inline mr-2" />
                    Username
                  </Label>
                  <Input
                    id="register-username"
                    name="register-username"
                    required
                    placeholder="Choose a username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    name="register-email"
                    type="email"
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    name="register-password"
                    type="password"
                    required
                    placeholder="Create a password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-location">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </Label>
                  <Select name="register-location" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {getPopularCities().map(city => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
