
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Match } from '@/services/cricketApi';

export interface MatchActivity {
  userId: string;
  matchId: string;
  matchTitle: string;
  activityType: 'view' | 'favorite' | 'note' | 'share';
  details?: string;
  timestamp: Date | Timestamp;
}

// Log user activity with matches
export const logMatchActivity = async (
  userId: string,
  matchId: string,
  matchTitle: string,
  activityType: MatchActivity['activityType'],
  details?: string
): Promise<string> => {
  try {
    const matchActivityCollection = collection(db, 'matchActivities');
    const activityData: MatchActivity = {
      userId,
      matchId,
      matchTitle,
      activityType,
      details,
      timestamp: Timestamp.now()
    };
    
    const docRef = await addDoc(matchActivityCollection, activityData);
    return docRef.id;
  } catch (error) {
    console.error('Error logging match activity:', error);
    throw error;
  }
};

// Get user's match activity history
export const getUserMatchActivity = async (userId: string): Promise<MatchActivity[]> => {
  try {
    const matchActivityCollection = collection(db, 'matchActivities');
    const q = query(
      matchActivityCollection,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const activities: MatchActivity[] = [];
    
    querySnapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() } as MatchActivity & { id: string });
    });
    
    return activities;
  } catch (error) {
    console.error('Error getting user match activity:', error);
    throw error;
  }
};

// Sync match data to Firebase
export const syncMatchToFirebase = async (userId: string, match: Match): Promise<string> => {
  try {
    const matchesCollection = collection(db, 'matches');
    const matchData = {
      ...match,
      syncedBy: userId,
      syncedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(matchesCollection, matchData);
    
    // Log this activity
    await logMatchActivity(
      userId,
      match.id,
      match.title,
      'share',
      'Synced match data to Firebase'
    );
    
    return docRef.id;
  } catch (error) {
    console.error('Error syncing match to Firebase:', error);
    throw error;
  }
};
