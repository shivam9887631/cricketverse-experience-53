
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  doc,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Timestamp | Date;
}

// Get all notifications for the current user
export const getUserNotifications = async (): Promise<Notification[]> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    
    const userId = auth.currentUser.uid;
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const notifications: Notification[] = [];
    
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      } as Notification);
    });
    
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

// Add a new notification
export const addNotification = async (notification: Omit<Notification, 'id'>): Promise<string> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const docRef = await addDoc(notificationsRef, {
      ...notification,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      isRead: true
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef, 
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    
    const updatePromises = querySnapshot.docs.map(async (document) => {
      const notificationRef = doc(db, 'notifications', document.id);
      return updateDoc(notificationRef, { isRead: true });
    });
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};
