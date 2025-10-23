import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { notificationsApi, NotificationResponse } from '@/utils/api';
import { Bell, Gift, HandHeart, Award, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

const notificationIcons = {
  success: Gift,
  info: HandHeart,
  warning: HandHeart,
  error: Award,
};

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view notifications');
      navigate('/auth');
      return;
    }
    loadNotifications();
  }, [user, navigate]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationsApi.getAll();
      setNotifications(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      loadNotifications();
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAsRead();
      loadNotifications();
      toast.success('All notifications marked as read');
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark all as read');
    }
  };

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.is_read).length;

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

        {isLoading ? (
          <Card className="p-12 text-center animate-fade-in">
            <p className="text-muted-foreground">Loading notifications...</p>
          </Card>
        ) : notifications.length === 0 ? (
          <Card className="p-12 text-center animate-fade-in">
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground">We'll notify you when something important happens</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = notificationIcons[notification.type] || Bell;
              
              return (
                <Card
                  key={notification.notification_id}
                  className={`transition-all hover:shadow-medium animate-fade-in ${
                    !notification.is_read ? 'border-primary bg-primary/5' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${
                        !notification.is_read ? 'bg-primary text-white' : 'bg-secondary text-primary'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`${!notification.is_read ? 'font-semibold' : ''}`}>
                          {notification.message}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(notification.date_created).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <Badge variant="default" className="shrink-0">New</Badge>
                        )}
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMarkAsRead(notification.notification_id)}
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
