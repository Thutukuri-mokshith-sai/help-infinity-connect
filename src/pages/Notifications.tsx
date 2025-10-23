import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser, getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/utils/storage';
import { Notification } from '@/types';
import { Bell, Gift, HandHeart, Award, CheckCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const notificationIcons = {
  donation: Gift,
  claim: HandHeart,
  request: HandHeart,
  certificate: Award,
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view notifications');
      navigate('/auth');
      return;
    }
    loadNotifications();
  }, [user, navigate]);

  const loadNotifications = () => {
    if (user) {
      setNotifications(getNotifications(user.id));
    }
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    if (user) {
      markAllNotificationsAsRead(user.id);
      loadNotifications();
      toast.success('All notifications marked as read');
    }
  };

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center">
              <Bell className="w-8 h-8 mr-2 text-primary" />
              Notifications
            </h1>
            <p className="text-muted-foreground mt-2">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground">We'll notify you when something important happens</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = notificationIcons[notification.type];
              
              return (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-medium animate-fade-in ${
                    !notification.read ? 'border-primary bg-primary/5' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        !notification.read ? 'bg-primary text-white' : 'bg-secondary text-primary'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.message}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Badge variant="default" className="shrink-0">New</Badge>
                        )}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCheck className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
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

export default Notifications;
