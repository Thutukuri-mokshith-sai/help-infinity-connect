import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getCurrentUser, setCurrentUser, getNotifications } from '@/utils/storage';
import { Infinity, Home, Heart, Search, HandHeart, LayoutDashboard, Bell, Award, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleStorage = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const notifications = getNotifications(currentUser.id);
        setUnreadCount(notifications.filter(n => !n.read).length);
      }
    };

    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    window.location.href = '/';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b shadow-soft animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent hover:scale-105 transition-smooth">
            <Infinity className="w-8 h-8 text-primary" />
            HelpInfinity
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-2 font-medium transition-smooth ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link 
              to="/donate" 
              className={`flex items-center gap-2 font-medium transition-smooth ${
                isActive('/donate') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Heart className="w-4 h-4" />
              Donate
            </Link>
            <Link 
              to="/browse" 
              className={`flex items-center gap-2 font-medium transition-smooth ${
                isActive('/browse') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Search className="w-4 h-4" />
              Browse
            </Link>
            <Link 
              to="/request" 
              className={`flex items-center gap-2 font-medium transition-smooth ${
                isActive('/request') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <HandHeart className="w-4 h-4" />
              Request
            </Link>
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-2 font-medium transition-smooth ${
                isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link to="/notifications" className="relative">
                  <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link to="/certificates">
                  <Button variant="ghost" size="icon">
                    <Award className="w-5 h-5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
                  <span className="font-medium text-sm">{user.username}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
