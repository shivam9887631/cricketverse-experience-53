
import { useQuery, useMutation } from '@tanstack/react-query';

// Type definitions for custom API data
export interface UserData {
  id: string;
  username: string;
  email: string;
  preferences: {
    theme: string;
    notifications: boolean;
    favoriteTeams: string[];
  };
}

export interface FeedbackData {
  id?: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

// Custom API functions
const API_BASE_URL = 'https://your-custom-api.com/api'; // Replace with your actual API URL

// Function to fetch user data
export const fetchUserData = async (userId: string): Promise<UserData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user data for ID: ${userId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user data for ID ${userId}:`, error);
    throw error;
  }
};

// Function to update user preferences
export const updateUserPreferences = async (userId: string, preferences: UserData['preferences']): Promise<UserData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });
    if (!response.ok) {
      throw new Error(`Failed to update preferences for user ID: ${userId}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating preferences for user ID ${userId}:`, error);
    throw error;
  }
};

// Function to submit feedback
export const submitFeedback = async (feedback: FeedbackData): Promise<FeedbackData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }
    return await response.json();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// React Query hooks
export const useUserData = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserData(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserPreferences = () => {
  return useMutation({
    mutationFn: ({ userId, preferences }: { userId: string; preferences: UserData['preferences'] }) => 
      updateUserPreferences(userId, preferences)
  });
};

export const useSubmitFeedback = () => {
  return useMutation({
    mutationFn: (feedback: FeedbackData) => submitFeedback(feedback)
  });
};
