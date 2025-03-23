
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { 
  Trophy, 
  Clock, 
  MapPin, 
  ChevronDown, 
  User, 
  BarChart3,
  PieChart,
  LineChart,
  Droplets,
  Wind,
  Cloud,
  ThermometerSun
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';

// Mock data for initial render
const matchData = {
  id: 1,
  team1: { 
    name: 'Chennai Super Kings', 
    shortName: 'CSK',
    score: '186/4', 
    overs: 20,
    color: '#FFCC00',
    logo: '🏏'
  },
  team2: { 
    name: 'Mumbai Indians', 
    shortName: 'MI',
    score: '142/7', 
    overs: 16.3,
    color: '#004BA0',
    logo: '🏏'
  },
  status: 'Live',
  venue: 'M.A. Chidambaram Stadium, Chennai',
  matchDate: '2023-09-10T14:00:00Z',
  toss: 'Chennai Super Kings won the toss and elected to bat',
  umpires: ['Kumar Dharmasena', 'Richard Illingworth'],
  weather: {
    temp: '30°C',
    condition: 'Partly Cloudy',
    humidity: '65%',
    windSpeed: '12 km/h'
  }
};

const ballByBallCommentary = [
  { 
    over: 16.3, 
    commentary: 'WICKET! Sharma b Jadeja 45(32)', 
    description: 'Jadeja with a perfect delivery, turns and hits the off stump. Sharma departs after a well-made 45.', 
    batsman: 'Sharma',
    bowler: 'Jadeja',
    runs: 0,
    isWicket: true,
    isHighlight: true
  },
  { 
    over: 16.2, 
    commentary: 'FOUR! Sharma cuts it beautifully past point for a boundary', 
    description: 'Short outside off, Sharma rocks back and cuts it powerfully past point. No chance for the fielder.', 
    batsman: 'Sharma',
    bowler: 'Jadeja',
    runs: 4,
    isWicket: false,
    isHighlight: true
  },
  { 
    over: 16.1, 
    commentary: 'Jadeja to Sharma, no run', 
    description: 'Flighted delivery on middle, Sharma defends it back to the bowler.', 
    batsman: 'Sharma',
    bowler: 'Jadeja',
    runs: 0,
    isWicket: false,
    isHighlight: false
  },
  // More commentary entries...
  { 
    over: 15.6, 
    commentary: 'Chahar to Kishan, 1 run', 
    description: 'Full on the pads, Kishan works it to deep square leg for a single.', 
    batsman: 'Kishan',
    bowler: 'Chahar',
    runs: 1,
    isWicket: false,
    isHighlight: false
  },
  { 
    over: 15.5, 
    commentary: 'Chahar to Kishan, no run', 
    description: 'Good length on off, Kishan defends solidly.', 
    batsman: 'Kishan',
    bowler: 'Chahar',
    runs: 0,
    isWicket: false,
    isHighlight: false
  },
  { 
    over: 15.4, 
    commentary: 'FOUR! Kishan drives it through covers', 
    description: 'Full outside off, Kishan leans into the drive and places it perfectly through the covers.', 
    batsman: 'Kishan',
    bowler: 'Chahar',
    runs: 4,
    isWicket: false,
    isHighlight: true
  },
];

const scorecard = {
  team1: {
    batting: [
      { player: 'Ruturaj Gaikwad', runs: 56, balls: 43, fours: 5, sixes: 2, strikeRate: 130.23, status: 'c Sharma b Bumrah' },
      { player: 'Devon Conway', runs: 42, balls: 34, fours: 4, sixes: 1, strikeRate: 123.53, status: 'c Kishan b Chahar' },
      { player: 'Moeen Ali', runs: 23, balls: 18, fours: 1, sixes: 1, strikeRate: 127.78, status: 'b Bumrah' },
      { player: 'Ambati Rayudu', runs: 34, balls: 19, fours: 3, sixes: 2, strikeRate: 178.95, status: 'not out' },
      { player: 'MS Dhoni', runs: 19, balls: 12, fours: 1, sixes: 1, strikeRate: 158.33, status: 'not out' },
      // More batsmen...
    ],
    bowling: [
      { player: 'Jasprit Bumrah', overs: 4, maidens: 0, runs: 32, wickets: 2, economy: 8.00 },
      { player: 'Trent Boult', overs: 4, maidens: 0, runs: 38, wickets: 0, economy: 9.50 },
      { player: 'Deepak Chahar', overs: 4, maidens: 0, runs: 35, wickets: 1, economy: 8.75 },
      { player: 'Rahul Chahar', overs: 4, maidens: 0, runs: 39, wickets: 1, economy: 9.75 },
      { player: 'Kieron Pollard', overs: 4, maidens: 0, runs: 42, wickets: 0, economy: 10.50 },
    ]
  },
  team2: {
    batting: [
      { player: 'Rohit Sharma', runs: 45, balls: 32, fours: 4, sixes: 2, strikeRate: 140.63, status: 'b Jadeja' },
      { player: 'Quinton de Kock', runs: 32, balls: 28, fours: 3, sixes: 1, strikeRate: 114.29, status: 'c Dhoni b Bravo' },
      { player: 'Suryakumar Yadav', runs: 12, balls: 10, fours: 1, sixes: 0, strikeRate: 120.00, status: 'lbw b Thakur' },
      { player: 'Ishan Kishan', runs: 38, balls: 25, fours: 3, sixes: 2, strikeRate: 152.00, status: 'not out' },
      { player: 'Hardik Pandya', runs: 7, balls: 8, fours: 0, sixes: 0, strikeRate: 87.50, status: 'c Conway b Bravo' },
      // More batsmen...
    ],
    bowling: [
      { player: 'Deepak Chahar', overs: 4, maidens: 0, runs: 32, wickets: 1, economy: 8.00 },
      { player: 'Shardul Thakur', overs: 3.3, maidens: 0, runs: 28, wickets: 1, economy: 8.47 },
      { player: 'Ravindra Jadeja', overs: 4, maidens: 0, runs: 26, wickets: 1, economy: 6.50 },
      { player: 'Dwayne Bravo', overs: 3, maidens: 0, runs: 29, wickets: 2, economy: 9.67 },
      { player: 'Moeen Ali', overs: 2, maidens: 0, runs: 27, wickets: 0, economy: 13.50 },
    ]
  }
};

const teamLineups = {
  team1: {
    playing11: [
      { player: 'Ruturaj Gaikwad', role: 'Batsman', isCapt: false, isWk: false },
      { player: 'Devon Conway', role: 'Batsman', isCapt: false, isWk: false },
      { player: 'Moeen Ali', role: 'All-rounder', isCapt: false, isWk: false },
      { player: 'Ambati Rayudu', role: 'Batsman', isCapt: false, isWk: false },
      { player: 'MS Dhoni', role: 'Wicket-keeper', isCapt: true, isWk: true },
      { player: 'Ravindra Jadeja', role: 'All-rounder', isCapt: false, isWk: false },
      { player: 'Dwayne Bravo', role: 'All-rounder', isCapt: false, isWk: false },
      { player: 'Shardul Thakur', role: 'Bowler', isCapt: false, isWk: false },
      { player: 'Deepak Chahar', role: 'Bowler', isCapt: false, isWk: false },
      { player: 'Mukesh Choudhary', role: 'Bowler', isCapt: false, isWk: false },
      { player: 'Maheesh Theekshana', role: 'Bowler', isCapt: false, isWk: false },
    ],
    bench: [
      { player: 'Robin Uthappa', role: 'Batsman' },
      { player: 'Mitchell Santner', role: 'All-rounder' },
      { player: 'Tushar Deshpande', role: 'Bowler' },
      { player: 'Simarjeet Singh', role: 'Bowler' },
    ]
  },
  team2: {
    playing11: [
      { player: 'Rohit Sharma', role: 'Batsman', isCapt: true, isWk: false },
      { player: 'Quinton de Kock', role: 'Wicket-keeper', isCapt: false, isWk: true },
      { player: 'Suryakumar Yadav', role: 'Batsman', isCapt: false, isWk: false },
      { player: 'Ishan Kishan', role: 'Batsman', isCapt: false, isWk: false },
      { player: 'Hardik Pandya', role: 'All-rounder', isCapt: false, isWk: false },
      { player: 'Kieron Pollard', role: 'All-rounder', isCapt: false, isWk: false },
      { player: 'Krunal Pandya', role: 'All-rounder', isCapt: false, isWk: false },
      { player: 'Rahul Chahar', role: 'Bowler', isCapt: false, isWk: false },
      { player: 'Jasprit Bumrah', role: 'Bowler', isCapt: false, isWk: false },
      { player: 'Trent Boult', role: 'Bowler', isCapt: false, isWk: false },
      { player: 'Deepak Chahar', role: 'Bowler', isCapt: false, isWk: false },
    ],
    bench: [
      { player: 'Saurabh Tiwary', role: 'Batsman' },
      { player: 'James Neesham', role: 'All-rounder' },
      { player: 'Jayant Yadav', role: 'Bowler' },
      { player: 'Dhawal Kulkarni', role: 'Bowler' },
    ]
  }
};

const matchStats = {
  team1: {
    runRate: 9.30,
    boundaries: { fours: 14, sixes: 7 },
    partnerships: [{ wicket: '1st', runs: 82 }, { wicket: '2nd', runs: 45 }, { wicket: '3rd', runs: 33 }],
    phaseScores: [
      { phase: '1-6 overs', runs: 52, wickets: 0 },
      { phase: '7-15 overs', runs: 92, wickets: 2 },
      { phase: '16-20 overs', runs: 42, wickets: 2 },
    ]
  },
  team2: {
    runRate: 8.61,
    boundaries: { fours: 11, sixes: 5 },
    partnerships: [{ wicket: '1st', runs: 65 }, { wicket: '2nd', runs: 28 }, { wicket: '3rd', runs: 19 }],
    phaseScores: [
      { phase: '1-6 overs', runs: 48, wickets: 1 },
      { phase: '7-15 overs', runs: 76, wickets: 2 },
      { phase: '16-20 overs', runs: 18, wickets: 4 },
    ]
  }
};

const MatchDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [expandedCommentary, setExpandedCommentary] = useState<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  const toggleCommentary = (index: number) => {
    setExpandedCommentary(expandedCommentary === index ? null : index);
  };

  const handleSubscribe = () => {
    toast({
      title: "Subscribed to match updates",
      description: "You'll receive notifications for this match.",
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="relative flex items-center justify-center w-16 h-16">
            <div className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-full animate-spin"></div>
            <Trophy className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Match Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="match-card mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 text-xs font-medium rounded-full ${
              matchData.status === 'Live'
                ? 'bg-red-500/10 text-red-500'
                : 'bg-green-500/10 text-green-500'
            }`}>
              {matchData.status}
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(matchData.matchDate).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          <button
            onClick={handleSubscribe}
            className="btn-outline text-xs py-1"
          >
            Get Updates
          </button>
        </div>
        
        <div className="flex justify-between items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: `${matchData.team1.color}20` }}>
              {matchData.team1.logo}
            </div>
            <h3 className="font-semibold mt-2">{matchData.team1.name}</h3>
            <p className="text-2xl font-bold mt-1">{matchData.team1.score}</p>
            <p className="text-sm text-muted-foreground">
              {matchData.team1.overs} overs
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold mb-1">VS</div>
            <div className="glass-card px-3 py-1 rounded-full text-xs font-medium">
              T20 Match
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: `${matchData.team2.color}20` }}>
              {matchData.team2.logo}
            </div>
            <h3 className="font-semibold mt-2">{matchData.team2.name}</h3>
            <p className="text-2xl font-bold mt-1">{matchData.team2.score}</p>
            <p className="text-sm text-muted-foreground">
              {matchData.team2.overs} overs
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground flex items-start">
          <MapPin className="w-4 h-4 mr-1 mt-0.5 shrink-0" />
          <span>{matchData.venue}</span>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground">
          <p>{matchData.toss}</p>
        </div>
      </motion.div>
      
      {/* Match Content */}
      <Tabs defaultValue="commentary" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="commentary" className="text-sm">Commentary</TabsTrigger>
          <TabsTrigger value="scorecard" className="text-sm">Scorecard</TabsTrigger>
          <TabsTrigger value="lineups" className="text-sm">Lineups</TabsTrigger>
          <TabsTrigger value="stats" className="text-sm">Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="commentary" className="space-y-4">
          {/* Weather Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 rounded-xl mb-6 flex items-center justify-between"
          >
            <div className="flex items-center">
              <Cloud className="w-8 h-8 mr-3 text-primary" />
              <div>
                <h3 className="font-medium">{matchData.weather.condition}</h3>
                <p className="text-sm text-muted-foreground">Match Conditions</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <ThermometerSun className="w-4 h-4 mr-1 text-primary" />
                <span className="text-sm">{matchData.weather.temp}</span>
              </div>
              <div className="flex items-center">
                <Droplets className="w-4 h-4 mr-1 text-primary" />
                <span className="text-sm">{matchData.weather.humidity}</span>
              </div>
              <div className="flex items-center">
                <Wind className="w-4 h-4 mr-1 text-primary" />
                <span className="text-sm">{matchData.weather.windSpeed}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Commentary Feed */}
          <h3 className="text-lg font-semibold mb-3">Live Commentary</h3>
          <div className="space-y-4">
            {ballByBallCommentary.map((ball, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card rounded-xl overflow-hidden ${
                  ball.isHighlight ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleCommentary(index)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                        ball.isWicket 
                          ? 'bg-red-500/10 text-red-500' 
                          : ball.runs === 4 || ball.runs === 6 
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-primary/10 text-primary'
                      }`}>
                        {ball.over}
                      </div>
                      <div>
                        <h4 className="font-medium">{ball.commentary}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {ball.bowler} to {ball.batsman}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${
                      expandedCommentary === index ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedCommentary === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4"
                    >
                      <div className="pt-2 border-t border-border">
                        <p className="text-sm">{ball.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="scorecard">
          <div className="space-y-6">
            {/* Chennai Super Kings Innings */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">{matchData.team1.name} Innings</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full glass-card">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Batsman</th>
                      <th className="p-3 text-right">R</th>
                      <th className="p-3 text-right">B</th>
                      <th className="p-3 text-right">4s</th>
                      <th className="p-3 text-right">6s</th>
                      <th className="p-3 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scorecard.team1.batting.map((player, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{player.player}</div>
                            <div className="text-xs text-muted-foreground">{player.status}</div>
                          </div>
                        </td>
                        <td className="p-3 text-right font-medium">{player.runs}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.balls}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.fours}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.sixes}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.strikeRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="overflow-x-auto mt-4">
                <table className="w-full glass-card">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Bowler</th>
                      <th className="p-3 text-right">O</th>
                      <th className="p-3 text-right">M</th>
                      <th className="p-3 text-right">R</th>
                      <th className="p-3 text-right">W</th>
                      <th className="p-3 text-right">ECON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scorecard.team2.bowling.map((player, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{player.player}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.overs}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.maidens}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.runs}</td>
                        <td className="p-3 text-right font-medium">{player.wickets}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.economy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
            
            {/* Mumbai Indians Innings */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">{matchData.team2.name} Innings</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full glass-card">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Batsman</th>
                      <th className="p-3 text-right">R</th>
                      <th className="p-3 text-right">B</th>
                      <th className="p-3 text-right">4s</th>
                      <th className="p-3 text-right">6s</th>
                      <th className="p-3 text-right">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scorecard.team2.batting.map((player, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{player.player}</div>
                            <div className="text-xs text-muted-foreground">{player.status}</div>
                          </div>
                        </td>
                        <td className="p-3 text-right font-medium">{player.runs}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.balls}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.fours}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.sixes}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.strikeRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="overflow-x-auto mt-4">
                <table className="w-full glass-card">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Bowler</th>
                      <th className="p-3 text-right">O</th>
                      <th className="p-3 text-right">M</th>
                      <th className="p-3 text-right">R</th>
                      <th className="p-3 text-right">W</th>
                      <th className="p-3 text-right">ECON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scorecard.team1.bowling.map((player, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{player.player}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.overs}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.maidens}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.runs}</td>
                        <td className="p-3 text-right font-medium">{player.wickets}</td>
                        <td className="p-3 text-right text-muted-foreground">{player.economy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </TabsContent>
        
        <TabsContent value="lineups">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team 1 Lineup */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4">
                {matchData.team1.name} Playing XI
              </h3>
              
              <div className="space-y-2">
                {teamLineups.team1.playing11.map((player, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-3 rounded-lg flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">
                          {player.player}
                        </h4>
                        {player.isCapt && (
                          <span className="ml-2 text-xs bg-yellow-500/10 text-yellow-500 px-1 rounded">
                            (C)
                          </span>
                        )}
                        {player.isWk && (
                          <span className="ml-2 text-xs bg-blue-500/10 text-blue-500 px-1 rounded">
                            (WK)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{player.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <h4 className="text-sm font-medium mt-4 mb-2">Bench</h4>
              <div className="glass-card p-3 rounded-lg">
                <div className="text-sm">
                  {teamLineups.team1.bench.map((player, index) => (
                    <div key={index} className="flex items-center py-1">
                      <span className="text-muted-foreground mr-2">•</span>
                      <span>{player.player}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({player.role})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Team 2 Lineup */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-4">
                {matchData.team2.name} Playing XI
              </h3>
              
              <div className="space-y-2">
                {teamLineups.team2.playing11.map((player, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card p-3 rounded-lg flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">
                          {player.player}
                        </h4>
                        {player.isCapt && (
                          <span className="ml-2 text-xs bg-yellow-500/10 text-yellow-500 px-1 rounded">
                            (C)
                          </span>
                        )}
                        {player.isWk && (
                          <span className="ml-2 text-xs bg-blue-500/10 text-blue-500 px-1 rounded">
                            (WK)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{player.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <h4 className="text-sm font-medium mt-4 mb-2">Bench</h4>
              <div className="glass-card p-3 rounded-lg">
                <div className="text-sm">
                  {teamLineups.team2.bench.map((player, index) => (
                    <div key={index} className="flex items-center py-1">
                      <span className="text-muted-foreground mr-2">•</span>
                      <span>{player.player}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({player.role})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="space-y-6">
            {/* Run rates */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-4 rounded-xl"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                Run Rate Comparison
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">{matchData.team1.shortName}</p>
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(matchData.team1.overs / 20) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary/80 to-primary"
                    ></motion.div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">0</span>
                    <span className="text-sm font-medium">{matchStats.team1.runRate}</span>
                    <span className="text-sm text-muted-foreground">15</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">{matchData.team2.shortName}</p>
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(matchData.team2.overs / 20) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-cricket-navy/80 to-cricket-navy"
                    ></motion.div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">0</span>
                    <span className="text-sm font-medium">{matchStats.team2.runRate}</span>
                    <span className="text-sm text-muted-foreground">15</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Boundaries */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="glass-card p-4 rounded-xl"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-primary" />
                Boundaries
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2">{matchData.team1.shortName}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-3 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Fours</p>
                      <p className="text-2xl font-bold mt-1">{matchStats.team1.boundaries.fours}</p>
                    </div>
                    <div className="glass-card p-3 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Sixes</p>
                      <p className="text-2xl font-bold mt-1">{matchStats.team1.boundaries.sixes}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">{matchData.team2.shortName}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-3 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Fours</p>
                      <p className="text-2xl font-bold mt-1">{matchStats.team2.boundaries.fours}</p>
                    </div>
                    <div className="glass-card p-3 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Sixes</p>
                      <p className="text-2xl font-bold mt-1">{matchStats.team2.boundaries.sixes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Phase-wise scores */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="glass-card p-4 rounded-xl"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-primary" />
                Phase-wise Scores
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-2">{matchData.team1.shortName}</p>
                  <div className="space-y-3">
                    {matchStats.team1.phaseScores.map((phase, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">{phase.phase}</p>
                          <p className="text-sm font-medium">
                            {phase.runs}/{phase.wickets}
                          </p>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(phase.runs / 75) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 * index }}
                            style={{ backgroundColor: matchData.team1.color }}
                            className="h-full"
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">{matchData.team2.shortName}</p>
                  <div className="space-y-3">
                    {matchStats.team2.phaseScores.map((phase, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">{phase.phase}</p>
                          <p className="text-sm font-medium">
                            {phase.runs}/{phase.wickets}
                          </p>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(phase.runs / 75) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 * index }}
                            style={{ backgroundColor: matchData.team2.color }}
                            className="h-full"
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default MatchDetails;
