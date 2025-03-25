
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
    },
    {
      userId,
      title: 'Match Result',
      message: 'Australia beat England by 5 wickets in the 3rd ODI.',
      type: 'info' as const,
      isRead: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    },
    {
      userId,
      title: 'Player Milestone',
      message: 'Virat Kohli scored his 50th century in international cricket!',
      type: 'success' as const,
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
      userId,
      title: 'Tournament Registration',
      message: 'Registration for the World Cup 2023 fantasy league is now open.',
      type: 'info' as const,
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    }
  ];

  // Add each notification to Firebase
  const promises = sampleNotifications.map(notification => addNotification(notification));
  return Promise.all(promises);
};

// Function to store match data in Firebase
export const storeMatchData = async (userId: string, matchId: string, matchData: any) => {
  try {
    await addNotification({
      userId,
      title: 'Match Data Saved',
      message: `Match data for ${matchData.title || matchId} has been saved.`,
      type: 'success',
      isRead: false,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error storing match data:', error);
    return false;
  }
};

// Function to generate notifications for cricket events
export const notifyUserAboutMatch = async (userId: string, matchId: string, eventType: 'start' | 'end' | 'update') => {
  try {
    const messages = {
      start: 'A match you are following is about to start. Don\'t miss it!',
      end: 'A match you are following has ended. Check the results!',
      update: 'There has been an important update in a match you are following.'
    };
    
    await addNotification({
      userId,
      title: 'Match Update',
      message: messages[eventType],
      type: 'info',
      isRead: false,
      createdAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error notifying user about match:', error);
    return false;
  }
};
