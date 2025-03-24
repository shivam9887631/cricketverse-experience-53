
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Bell, Check, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import useRequireAuth from '@/hooks/useRequireAuth';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  Notification
} from '@/services/notificationService';

const Notifications = () => {
  const { currentUser } = useRequireAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userNotifications = await getUserNotifications();
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load notifications. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser, toast]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      toast({
        title: 'Success',
        description: 'Notification marked as read',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser) return;
    
    try {
      await markAllNotificationsAsRead(currentUser.uid);
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <Bell className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <Bell className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest activities
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} size="sm" variant="outline">
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-medium">No notifications yet</p>
              <p className="text-muted-foreground mt-1">
                We'll let you know when something new arrives
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={notification.isRead ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.createdAt instanceof Date 
                              ? format(notification.createdAt, 'MMM dd, yyyy • HH:mm')
                              : format(notification.createdAt.toDate(), 'MMM dd, yyyy • HH:mm')}
                          </p>
                        </div>
                      </div>
                      {!notification.isRead && notification.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id!)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
