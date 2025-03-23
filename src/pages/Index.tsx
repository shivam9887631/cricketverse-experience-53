
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import Layout from '@/components/Layout';

// Mock data for initial render
const liveMatches = [
  {
    id: 1,
    team1: { name: 'Chennai Super Kings', score: '186/4', overs: 20, logo: '🏏' },
    team2: { name: 'Mumbai Indians', score: '142/7', overs: 16.3, logo: '🏏' },
    status: 'Live',
    venue: 'M.A. Chidambaram Stadium',
  },
  {
    id: 2,
    team1: { name: 'Royal Challengers', score: '201/6', overs: 20, logo: '🏏' },
    team2: { name: 'Rajasthan Royals', score: '165/9', overs: 20, logo: '🏏' },
    status: 'Completed',
    venue: 'M. Chinnaswamy Stadium',
  },
];

const upcomingMatches = [
  {
    id: 3,
    team1: { name: 'Delhi Capitals', logo: '🏏' },
    team2: { name: 'Punjab Kings', logo: '🏏' },
    date: '2023-09-12T14:00:00Z',
    venue: 'Arun Jaitley Stadium',
  },
  {
    id: 4,
    team1: { name: 'Kolkata Knight Riders', logo: '🏏' },
    team2: { name: 'Sunrisers Hyderabad', logo: '🏏' },
    date: '2023-09-13T18:00:00Z',
    venue: 'Eden Gardens',
  },
];

const topPlayers = [
  {
    id: 1,
    name: 'Virat Kohli',
    team: 'Royal Challengers',
    stats: { runs: 568, matches: 12, average: 47.33 },
    category: 'Batsman',
    image: 'https://placehold.co/200x300/3B82F6/FFFFFF/png?text=VK',
  },
  {
    id: 2,
    name: 'Jasprit Bumrah',
    team: 'Mumbai Indians',
    stats: { wickets: 22, matches: 14, economy: 6.58 },
    category: 'Bowler',
    image: 'https://placehold.co/200x300/10B981/FFFFFF/png?text=JB',
  },
  {
    id: 3,
    name: 'MS Dhoni',
    team: 'Chennai Super Kings',
    stats: { runs: 342, matches: 14, stumpings: 14 },
    category: 'Wicketkeeper',
    image: 'https://placehold.co/200x300/3B82F6/FFFFFF/png?text=MSD',
  },
];

const tournaments = [
  {
    id: 1,
    name: 'Mumbai Premier League',
    teams: 8,
    status: 'Ongoing',
    currentMatch: 'Semi Finals',
  },
  {
    id: 2,
    name: 'Bengal T20 Challenge',
    teams: 6,
    status: 'Upcoming',
    startDate: '2023-09-15',
  },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button 
          onClick={handleRefresh} 
          className="flex items-center px-3 py-2 text-sm bg-secondary rounded-lg hover:bg-secondary/70 transition-all"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="h-40 rounded-xl bg-white/50 dark:bg-white/5 animate-pulse" 
            />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Live Matches Section */}
          <motion.section variants={item} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Live Matches
              </h2>
              <Link to="/match" className="text-sm text-primary flex items-center hover:underline">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveMatches.map((match) => (
                <Link key={match.id} to={`/match/${match.id}`}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="match-card hover:shadow-md"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        match.status === 'Live'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-green-500/10 text-green-500'
                      }`}>
                        {match.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{match.venue}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                          {match.team1.logo}
                        </div>
                        <div>
                          <h3 className="font-medium">{match.team1.name}</h3>
                          <p className="text-sm font-semibold">{match.team1.score}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">VS</div>
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-medium text-right">{match.team2.name}</h3>
                          <p className="text-sm font-semibold text-right">{match.team2.score}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                          {match.team2.logo}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Upcoming Matches */}
          <motion.section variants={item} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Upcoming Matches
              </h2>
              <Link to="/match" className="text-sm text-primary flex items-center hover:underline">
                View Schedule <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingMatches.map((match) => (
                <motion.div 
                  key={match.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="match-card"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500">
                      Upcoming
                    </span>
                    <span className="text-xs text-muted-foreground">{match.venue}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                        {match.team1.logo}
                      </div>
                      <h3 className="font-medium">{match.team1.name}</h3>
                    </div>
                    <div className="text-sm font-medium">VS</div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium">{match.team2.name}</h3>
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                        {match.team2.logo}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-center text-muted-foreground">
                    {new Date(match.date).toLocaleString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Top Players */}
          <motion.section variants={item} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Top Players
              </h2>
              <Link to="/players" className="text-sm text-primary flex items-center hover:underline">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {topPlayers.map((player) => (
                <Link key={player.id} to={`/players/${player.id}`}>
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="player-card"
                  >
                    <div className="h-40 bg-gray-100 overflow-hidden">
                      <img 
                        src={player.image} 
                        alt={player.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary mb-2 inline-block">
                        {player.category}
                      </span>
                      <h3 className="font-semibold text-lg">{player.name}</h3>
                      <p className="text-sm text-muted-foreground">{player.team}</p>
                      
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {Object.entries(player.stats).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <p className="text-xs text-muted-foreground capitalize">{key}</p>
                            <p className="font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Tournaments */}
          <motion.section variants={item} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-primary" />
                Local Tournaments
              </h2>
              <Link to="/tournament" className="text-sm text-primary flex items-center hover:underline">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournaments.map((tournament) => (
                <Link key={tournament.id} to={`/tournament?id=${tournament.id}`}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="stat-card"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{tournament.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tournament.status === 'Ongoing'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {tournament.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-muted-foreground">
                      {tournament.teams} Teams
                    </div>
                    
                    <div className="mt-2 text-sm">
                      {tournament.status === 'Ongoing' 
                        ? `Current Stage: ${tournament.currentMatch}`
                        : `Starts: ${new Date(tournament.startDate).toLocaleDateString()}`
                      }
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        </motion.div>
      )}
    </Layout>
  );
};

export default Index;
