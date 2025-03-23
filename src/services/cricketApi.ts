
import { useQuery } from '@tanstack/react-query';

// Type definitions for cricket data
export interface Match {
  id: string;
  title: string;
  status: string;
  date: string;
  teams: {
    home: string;
    away: string;
  };
  score?: {
    home: string;
    away: string;
  };
}

export interface Player {
  id: string;
  name: string;
  team: string;
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    average: number;
  };
}

// Cricket API functions
const API_BASE_URL = 'https://cricket-api-endpoint.com/api/v1'; // Replace with actual cricket API URL

// Function to fetch matches
export const fetchMatches = async (): Promise<Match[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/matches`);
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// Function to fetch a single match by ID
export const fetchMatchById = async (id: string): Promise<Match> => {
  try {
    const response = await fetch(`${API_BASE_URL}/matches/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch match with ID: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching match with ID ${id}:`, error);
    throw error;
  }
};

// Function to fetch players
export const fetchPlayers = async (): Promise<Player[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/players`);
    if (!response.ok) {
      throw new Error('Failed to fetch players');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

// React Query hooks
export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  });
};

export const useMatch = (id: string) => {
  return useQuery({
    queryKey: ['match', id],
    queryFn: () => fetchMatchById(id),
    enabled: !!id,
  });
};

export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
  });
};
