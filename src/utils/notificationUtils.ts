
import { addNotification } from '@/services/notificationService';

export const generateSampleNotifications = async (userId: string) => {
  const sampleNotifications = [
    {
      userId,
      title: 'Welcome to Cricket App',
      message: 'Thank you for joining our cricket community. Explore matches and players.',
      type: 'info' as const,
      isRead: false,
      createdAt: new Date()
    },
    {
      userId,
      title: 'Match Reminder',
      message: 'Royal Challengers vs Mumbai Indians match starts in 2 hours.',
      type: 'info' as const,
      isRead: false,
      createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
    },
    {
      userId,
      title: 'Profile Updated',
      message: 'Your profile information has been updated successfully.',
      type: 'success' as const,
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      userId,
      title: 'New Tournament Added',
      message: 'A new tournament "Summer Cup 2023" has been added.',
      type: 'info' as const,
      isRead: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      userId,
      title: 'Reminder',
      message: 'Update your preferred notification settings in your profile.',
      type: 'warning' as const,
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
  ];

  // Add each notification to Firebase
  const promises = sampleNotifications.map(notification => addNotification(notification));
  return Promise.all(promises);
};
