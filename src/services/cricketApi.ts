
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
  venue?: string;
  series?: string;
  matchType?: 'ODI' | 'Test' | 'T20' | 'Other';
  result?: string;
  highlights?: string[];
}

export interface Player {
  id: string;
  name: string;
  team: string;
  role?: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    average: number;
    strikeRate?: number;
    economyRate?: number;
    highestScore?: number;
    bestBowling?: string;
  };
  country?: string;
  dateOfBirth?: string;
  imageUrl?: string;
}

export interface Series {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  teams: string[];
  matches: string[];
  winner?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

// Cricket API functions
// We're using a mock API for now, but this could be replaced with a real cricket API
const API_BASE_URL = 'https://cricket-api-endpoint.com/api/v1'; 

// Mock data generator (simulating API responses)
const generateMockMatch = (id: string): Match => {
  const teams = ['India', 'Australia', 'England', 'South Africa', 'New Zealand', 'Pakistan', 'Sri Lanka', 'West Indies'];
  const statuses = ['Scheduled', 'Live', 'Completed'];
  const homeTeam = teams[Math.floor(Math.random() * teams.length)];
  let awayTeam = teams[Math.floor(Math.random() * teams.length)];
  
  // Make sure we don't have the same team playing itself
  while (awayTeam === homeTeam) {
    awayTeam = teams[Math.floor(Math.random() * teams.length)];
  }
  
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 30) - 15); // Random date ±15 days from today
  
  const match: Match = {
    id,
    title: `${homeTeam} vs ${awayTeam}`,
    status,
    date: date.toISOString().split('T')[0],
    teams: {
      home: homeTeam,
      away: awayTeam
    },
    venue: ['MCG', 'Lord\'s', 'Eden Gardens', 'Wankhede', 'SCG'][Math.floor(Math.random() * 5)],
    series: ['World Cup', 'IPL', 'Ashes', 'Bilateral Series'][Math.floor(Math.random() * 4)],
    matchType: ['ODI', 'Test', 'T20', 'Other'][Math.floor(Math.random() * 4)] as any
  };
  
  // Add scores for live or completed matches
  if (status !== 'Scheduled') {
    const homeRuns = Math.floor(Math.random() * 350) + 150;
    const homeWickets = Math.floor(Math.random() * 10);
    const awayRuns = status === 'Completed' ? Math.floor(Math.random() * 350) + 150 : Math.floor(Math.random() * homeRuns);
    const awayWickets = status === 'Completed' ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 10);
    
    match.score = {
      home: `${homeRuns}/${homeWickets}`,
      away: `${awayRuns}/${awayWickets}`
    };
    
    if (status === 'Completed') {
      const homeWon = homeRuns > awayRuns;
      const difference = Math.abs(homeRuns - awayRuns);
      match.result = homeWon 
        ? `${homeTeam} won by ${difference} runs` 
        : `${awayTeam} won by ${10 - awayWickets} wickets`;
    }
  }
  
  return match;
};

const generateMockPlayer = (id: string): Player => {
  const names = ['Virat Kohli', 'Joe Root', 'Steve Smith', 'Kane Williamson', 'Babar Azam', 
                 'Jasprit Bumrah', 'Pat Cummins', 'Ben Stokes', 'Kagiso Rabada', 'Rashid Khan'];
  const teams = ['India', 'England', 'Australia', 'New Zealand', 'Pakistan', 'South Africa', 'Afghanistan'];
  const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];
  
  const randomNameIndex = Math.floor(Math.random() * names.length);
  const name = id === '1' ? 'Virat Kohli' : names[randomNameIndex]; // Ensure Virat Kohli is always player 1
  const team = id === '1' ? 'India' : teams[Math.floor(Math.random() * teams.length)];
  const role = roles[Math.floor(Math.random() * roles.length)] as any;
  
  // Generate statistics based on role
  const matches = Math.floor(Math.random() * 150) + 50;
  let runs, wickets, average, strikeRate, economyRate, highestScore, bestBowling;
  
  if (role === 'Batsman' || role === 'All-rounder' || role === 'Wicket-keeper') {
    runs = Math.floor(Math.random() * 10000) + 1000;
    average = +(runs / matches).toFixed(2);
    strikeRate = +(Math.random() * 50 + 70).toFixed(2);
    highestScore = Math.floor(Math.random() * 200) + 50;
  } else {
    runs = Math.floor(Math.random() * 1000);
    average = +(Math.random() * 20 + 10).toFixed(2);
  }
  
  if (role === 'Bowler' || role === 'All-rounder') {
    wickets = Math.floor(Math.random() * 300) + 50;
    economyRate = +(Math.random() * 2 + 3).toFixed(2);
    const bestWickets = Math.floor(Math.random() * 7) + 3;
    const bestRuns = Math.floor(Math.random() * 50) + 10;
    bestBowling = `${bestWickets}/${bestRuns}`;
  } else {
    wickets = Math.floor(Math.random() * 20);
  }
  
  return {
    id,
    name,
    team,
    role,
    stats: {
      matches,
      runs: runs || 0,
      wickets: wickets || 0,
      average,
      ...(strikeRate && { strikeRate }),
      ...(economyRate && { economyRate }),
      ...(highestScore && { highestScore }),
      ...(bestBowling && { bestBowling })
    },
    country: team,
    dateOfBirth: `${1980 + Math.floor(Math.random() * 20)}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
    imageUrl: `https://placekitten.com/200/${200 + Math.floor(Math.random() * 100)}` // Placeholder images
  };
};

// Function to fetch matches
export const fetchMatches = async (): Promise<Match[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data
    const mockMatches: Match[] = [];
    for (let i = 1; i <= 10; i++) {
      mockMatches.push(generateMockMatch(i.toString()));
    }
    
    return mockMatches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// Function to fetch a single match by ID
export const fetchMatchById = async (id: string): Promise<Match> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate consistent mock data for the same ID
    return generateMockMatch(id);
  } catch (error) {
    console.error(`Error fetching match with ID ${id}:`, error);
    throw error;
  }
};

// Function to fetch players
export const fetchPlayers = async (): Promise<Player[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Generate mock data
    const mockPlayers: Player[] = [];
    for (let i = 1; i <= 20; i++) {
      mockPlayers.push(generateMockPlayer(i.toString()));
    }
    
    return mockPlayers;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

// Function to fetch a player by ID
export const fetchPlayerById = async (id: string): Promise<Player> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate consistent mock data for the same ID
    return generateMockPlayer(id);
  } catch (error) {
    console.error(`Error fetching player with ID ${id}:`, error);
    throw error;
  }
};

// React Query hooks
export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMatch = (id: string) => {
  return useQuery({
    queryKey: ['match', id],
    queryFn: () => fetchMatchById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePlayer = (id: string) => {
  return useQuery({
    queryKey: ['player', id],
    queryFn: () => fetchPlayerById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
