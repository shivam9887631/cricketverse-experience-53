
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { 
  Trophy, 
  CalendarDays, 
  Users, 
  MapPin, 
  Clock, 
  Calendar, 
  Plus,
  PlusCircle,
  Trash2,
  Edit,
  FileEdit,
  Save,
  X,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data
const tournaments = [
  {
    id: 1,
    name: 'Mumbai Premier League',
    location: 'Mumbai, Maharashtra',
    startDate: '2023-09-05',
    endDate: '2023-09-25',
    teams: 8,
    matches: 31,
    currentStage: 'Semi-Finals',
    status: 'Ongoing',
    organizer: 'Mumbai Cricket Association',
    description: 'The Mumbai Premier League is the premier T20 cricket tournament in Mumbai, featuring the best local talent across 8 teams.',
    format: 'T20',
    logo: '🏆'
  },
  {
    id: 2,
    name: 'Bengal T20 Challenge',
    location: 'Kolkata, West Bengal',
    startDate: '2023-09-15',
    endDate: '2023-10-05',
    teams: 6,
    matches: 19,
    currentStage: 'Not Started',
    status: 'Upcoming',
    organizer: 'Cricket Association of Bengal',
    description: 'The Bengal T20 Challenge showcases the finest cricket talent from across West Bengal in an exciting T20 format.',
    format: 'T20',
    logo: '🏏'
  },
  {
    id: 3,
    name: 'Karnataka Premier League',
    location: 'Bangalore, Karnataka',
    startDate: '2023-08-15',
    endDate: '2023-09-05',
    teams: 7,
    matches: 24,
    currentStage: 'Completed',
    status: 'Completed',
    organizer: 'Karnataka State Cricket Association',
    description: 'The Karnataka Premier League is a professional Twenty20 cricket league established by the Karnataka State Cricket Association.',
    format: 'T20',
    logo: '🏏'
  },
  {
    id: 4,
    name: 'Delhi Cricket Championship',
    location: 'Delhi',
    startDate: '2023-10-10',
    endDate: '2023-10-30',
    teams: 6,
    matches: 19,
    currentStage: 'Not Started',
    status: 'Upcoming',
    organizer: 'Delhi & District Cricket Association',
    description: 'The Delhi Cricket Championship brings together the top cricket clubs from across the Delhi region in a competitive T20 format.',
    format: 'T20',
    logo: '🏏'
  }
];

const teams = [
  { id: 1, name: 'Mumbai Champions', captain: 'Rohit Verma', tournamentId: 1, players: 16, wins: 5, losses: 1, points: 10 },
  { id: 2, name: 'Thane Warriors', captain: 'Ajay Deshmukh', tournamentId: 1, players: 15, wins: 4, losses: 2, points: 8 },
  { id: 3, name: 'Navi Mumbai Kings', captain: 'Sunil Patil', tournamentId: 1, players: 16, wins: 4, losses: 2, points: 8 },
  { id: 4, name: 'Kalyan Strikers', captain: 'Amit Sharma', tournamentId: 1, players: 15, wins: 3, losses: 3, points: 6 },
  { id: 5, name: 'Kolkata Tigers', captain: 'Sourav Das', tournamentId: 2, players: 16, wins: 0, losses: 0, points: 0 },
  { id: 6, name: 'Bengal Warriors', captain: 'Manoj Roy', tournamentId: 2, players: 16, wins: 0, losses: 0, points: 0 },
];

const matches = [
  { 
    id: 1, 
    tournamentId: 1, 
    team1: { name: 'Mumbai Champions', score: '186/4' }, 
    team2: { name: 'Thane Warriors', score: '170/8' }, 
    date: '2023-09-07T14:00:00Z', 
    venue: 'Wankhede Stadium', 
    result: 'Mumbai Champions won by 16 runs',
    status: 'Completed'
  },
  { 
    id: 2, 
    tournamentId: 1, 
    team1: { name: 'Navi Mumbai Kings', score: '165/6' }, 
    team2: { name: 'Kalyan Strikers', score: '162/9' }, 
    date: '2023-09-08T14:00:00Z', 
    venue: 'DY Patil Stadium', 
    result: 'Navi Mumbai Kings won by 3 runs',
    status: 'Completed'
  },
  { 
    id: 3, 
    tournamentId: 1, 
    team1: { name: 'Mumbai Champions', score: '' }, 
    team2: { name: 'Navi Mumbai Kings', score: '' }, 
    date: '2023-09-12T14:00:00Z', 
    venue: 'Wankhede Stadium', 
    result: '',
    status: 'Upcoming'
  },
  { 
    id: 4, 
    tournamentId: 1, 
    team1: { name: 'Thane Warriors', score: '' }, 
    team2: { name: 'Kalyan Strikers', score: '' }, 
    date: '2023-09-13T14:00:00Z', 
    venue: 'MCA Stadium, Thane', 
    result: '',
    status: 'Upcoming'
  },
];

// Tournament creation form initial state
const initialFormState = {
  name: '',
  location: '',
  startDate: '',
  endDate: '',
  teams: 0,
  organizer: '',
  description: '',
  format: 'T20',
};

const Tournament = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTournamentId, setActiveTournamentId] = useState<number | null>(null);
  const [tournamentForm, setTournamentForm] = useState(initialFormState);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Check for tournament ID in URL
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        setActiveTournamentId(parseInt(id));
      } else if (tournaments.length > 0) {
        setActiveTournamentId(tournaments[0].id);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTournamentForm({ ...tournamentForm, [name]: value });
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate tournament creation
    toast({
      title: "Tournament Created",
      description: `${tournamentForm.name} has been created successfully.`,
      duration: 3000,
    });
    setTournamentForm(initialFormState);
    setShowForm(false);
  };

  const filteredTournaments = tournaments.filter(tournament => {
    if (filter === 'all') return true;
    return tournament.status.toLowerCase() === filter.toLowerCase();
  });

  const activeTournament = tournaments.find(t => t.id === activeTournamentId);
  const tournamentTeams = teams.filter(team => team.tournamentId === activeTournamentId);
  const tournamentMatches = matches.filter(match => match.tournamentId === activeTournamentId);

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

  if (isLoading) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tournament List Sidebar */}
        <div className="md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Tournaments</h1>
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="flex items-center px-2 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Tournament</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new cricket tournament.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreateTournament} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Tournament Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={tournamentForm.name}
                        onChange={handleFormChange}
                        className="form-input w-full"
                        placeholder="e.g. Mumbai Premier League"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                        Start Date
                      </label>
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={tournamentForm.startDate}
                        onChange={handleFormChange}
                        className="form-input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                        End Date
                      </label>
                      <input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={tournamentForm.endDate}
                        onChange={handleFormChange}
                        className="form-input w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium mb-1">
                        Location
                      </label>
                      <input
                        id="location"
                        name="location"
                        value={tournamentForm.location}
                        onChange={handleFormChange}
                        className="form-input w-full"
                        placeholder="e.g. Mumbai, Maharashtra"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="teams" className="block text-sm font-medium mb-1">
                        Number of Teams
                      </label>
                      <input
                        id="teams"
                        name="teams"
                        type="number"
                        min="2"
                        value={tournamentForm.teams}
                        onChange={handleFormChange}
                        className="form-input w-full"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="organizer" className="block text-sm font-medium mb-1">
                        Organizer
                      </label>
                      <input
                        id="organizer"
                        name="organizer"
                        value={tournamentForm.organizer}
                        onChange={handleFormChange}
                        className="form-input w-full"
                        placeholder="e.g. Mumbai Cricket Association"
                        required
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="format" className="block text-sm font-medium mb-1">
                        Format
                      </label>
                      <select
                        id="format"
                        name="format"
                        value={tournamentForm.format}
                        onChange={handleFormChange}
                        className="form-input w-full"
                        required
                      >
                        <option value="T20">T20</option>
                        <option value="ODI">ODI</option>
                        <option value="Test">Test</option>
                        <option value="T10">T10</option>
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={tournamentForm.description}
                        onChange={handleFormChange}
                        className="form-input w-full min-h-[100px]"
                        placeholder="Describe your tournament..."
                      ></textarea>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <button
                      type="button"
                      onClick={() => setTournamentForm(initialFormState)}
                      className="btn-outline"
                    >
                      Reset
                    </button>
                    <button type="submit" className="btn-primary">
                      Create Tournament
                    </button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Filter Options */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-input py-1 text-sm"
              >
                <option value="all">All Tournaments</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <button
              onClick={handleRefresh}
              className="flex items-center p-1 rounded-md hover:bg-muted transition-colors"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {/* Tournament List */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-2"
          >
            {filteredTournaments.map((tournament) => (
              <motion.div
                key={tournament.id}
                variants={item}
                onClick={() => setActiveTournamentId(tournament.id)}
                className={`glass-card p-4 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                  activeTournamentId === tournament.id ? 'border-2 border-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                      {tournament.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold">{tournament.name}</h3>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {tournament.location}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    tournament.status === 'Ongoing'
                      ? 'bg-green-500/10 text-green-500'
                      : tournament.status === 'Upcoming'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {tournament.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Teams</p>
                    <p className="font-medium">{tournament.teams}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Matches</p>
                    <p className="font-medium">{tournament.matches}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Format</p>
                    <p className="font-medium">{tournament.format}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="w-3 h-3 mr-1" />
                  {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Tournament Details */}
        <div className="md:col-span-2">
          {activeTournament ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-card p-6 rounded-xl mb-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                      {activeTournament.logo}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{activeTournament.name}</h2>
                      <div className="flex items-center mt-1 text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        {activeTournament.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 text-sm rounded-full ${
                    activeTournament.status === 'Ongoing'
                      ? 'bg-green-500/10 text-green-500'
                      : activeTournament.status === 'Upcoming'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {activeTournament.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="glass-card p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Teams</p>
                    <p className="text-xl font-bold mt-1">{activeTournament.teams}</p>
                  </div>
                  <div className="glass-card p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Matches</p>
                    <p className="text-xl font-bold mt-1">{activeTournament.matches}</p>
                  </div>
                  <div className="glass-card p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Format</p>
                    <p className="text-xl font-bold mt-1">{activeTournament.format}</p>
                  </div>
                  <div className="glass-card p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Current Stage</p>
                    <p className="text-xl font-bold mt-1">{activeTournament.currentStage}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <CalendarDays className="w-4 h-4 mr-1" />
                    {new Date(activeTournament.startDate).toLocaleDateString()} - {new Date(activeTournament.endDate).toLocaleDateString()}
                  </div>
                  <p className="text-sm">{activeTournament.description}</p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Organizer:</span> {activeTournament.organizer}
                  </p>
                </div>
                
                {activeTournament.status === 'Ongoing' && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button className="btn-outline text-sm flex items-center">
                      <FileEdit className="w-4 h-4 mr-1" />
                      Update Status
                    </button>
                    
                    <button className="btn-outline text-sm flex items-center">
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Add Match
                    </button>
                  </div>
                )}
              </div>
              
              <Tabs defaultValue="teams" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="teams" className="text-sm">Teams</TabsTrigger>
                  <TabsTrigger value="matches" className="text-sm">Matches</TabsTrigger>
                  <TabsTrigger value="standings" className="text-sm">Standings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="teams" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Participating Teams</h3>
                    
                    {activeTournament.status !== 'Completed' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="btn-outline text-sm flex items-center">
                            <PlusCircle className="w-4 h-4 mr-1" />
                            Add Team
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Team to Tournament</DialogTitle>
                            <DialogDescription>
                              Add a new team to {activeTournament.name}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <form className="space-y-4 mt-4">
                            <div>
                              <label htmlFor="team-name" className="block text-sm font-medium mb-1">
                                Team Name
                              </label>
                              <input
                                id="team-name"
                                className="form-input w-full"
                                placeholder="e.g. Mumbai Champions"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="captain" className="block text-sm font-medium mb-1">
                                Captain
                              </label>
                              <input
                                id="captain"
                                className="form-input w-full"
                                placeholder="e.g. Rohit Verma"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="players" className="block text-sm font-medium mb-1">
                                Number of Players
                              </label>
                              <input
                                id="players"
                                type="number"
                                min="11"
                                className="form-input w-full"
                                placeholder="e.g. 16"
                              />
                            </div>
                            
                            <DialogFooter>
                              <button type="submit" className="btn-primary">
                                Add Team
                              </button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tournamentTeams.map((team) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="glass-card p-4 rounded-xl"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{team.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Captain: {team.captain}
                            </p>
                          </div>
                          
                          {activeTournament.status !== 'Completed' && (
                            <div className="flex space-x-1">
                              <button className="p-1 rounded-md hover:bg-secondary">
                                <Edit className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button className="p-1 rounded-md hover:bg-secondary">
                                <Trash2 className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Players</p>
                            <p className="font-medium">{team.players}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">W/L</p>
                            <p className="font-medium">{team.wins}/{team.losses}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Points</p>
                            <p className="font-medium">{team.points}</p>
                          </div>
                        </div>
                        
                        <button className="w-full mt-4 btn-outline text-xs flex items-center justify-center">
                          <Users className="w-3 h-3 mr-1" />
                          View Squad
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="matches" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Tournament Matches</h3>
                    
                    {activeTournament.status !== 'Completed' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="btn-outline text-sm flex items-center">
                            <PlusCircle className="w-4 h-4 mr-1" />
                            Schedule Match
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Schedule New Match</DialogTitle>
                            <DialogDescription>
                              Add a new match to {activeTournament.name}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <form className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="team1" className="block text-sm font-medium mb-1">
                                  Team 1
                                </label>
                                <select id="team1" className="form-input w-full">
                                  <option value="">Select Team</option>
                                  {tournamentTeams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label htmlFor="team2" className="block text-sm font-medium mb-1">
                                  Team 2
                                </label>
                                <select id="team2" className="form-input w-full">
                                  <option value="">Select Team</option>
                                  {tournamentTeams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="match-date" className="block text-sm font-medium mb-1">
                                  Date
                                </label>
                                <input
                                  id="match-date"
                                  type="date"
                                  className="form-input w-full"
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="match-time" className="block text-sm font-medium mb-1">
                                  Time
                                </label>
                                <input
                                  id="match-time"
                                  type="time"
                                  className="form-input w-full"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="venue" className="block text-sm font-medium mb-1">
                                Venue
                              </label>
                              <input
                                id="venue"
                                className="form-input w-full"
                                placeholder="e.g. Wankhede Stadium"
                              />
                            </div>
                            
                            <DialogFooter>
                              <button type="submit" className="btn-primary">
                                Schedule Match
                              </button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {tournamentMatches.map((match) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="glass-card p-4 rounded-xl"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            match.status === 'Completed'
                              ? 'bg-green-500/10 text-green-500'
                              : match.status === 'Live'
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {match.status}
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(match.date).toLocaleString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-left">
                            <h4 className="font-medium">{match.team1.name}</h4>
                            {match.team1.score && (
                              <p className="text-sm font-semibold mt-1">{match.team1.score}</p>
                            )}
                          </div>
                          
                          <div className="text-center font-medium">VS</div>
                          
                          <div className="text-right">
                            <h4 className="font-medium">{match.team2.name}</h4>
                            {match.team2.score && (
                              <p className="text-sm font-semibold mt-1">{match.team2.score}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="w-3 h-3 mr-1" />
                            {match.venue}
                          </div>
                          
                          {match.result && (
                            <div className="mt-1 font-medium text-primary">{match.result}</div>
                          )}
                        </div>
                        
                        {activeTournament.status !== 'Completed' && (
                          <div className="mt-3 flex justify-end space-x-2">
                            {match.status === 'Upcoming' ? (
                              <>
                                <button className="btn-outline text-xs py-1 flex items-center">
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </button>
                                <button className="btn-outline text-xs py-1 flex items-center text-primary">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Start Match
                                </button>
                              </>
                            ) : match.status === 'Live' ? (
                              <button className="btn-outline text-xs py-1 flex items-center text-green-500">
                                <Save className="w-3 h-3 mr-1" />
                                Complete Match
                              </button>
                            ) : null}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="standings" className="space-y-4">
                  <h3 className="text-lg font-semibold">Team Standings</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full glass-card">
                      <thead>
                        <tr className="border-b">
                          <th className="p-3 text-left">Rank</th>
                          <th className="p-3 text-left">Team</th>
                          <th className="p-3 text-center">Played</th>
                          <th className="p-3 text-center">Won</th>
                          <th className="p-3 text-center">Lost</th>
                          <th className="p-3 text-center">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tournamentTeams
                          .sort((a, b) => b.points - a.points)
                          .map((team, index) => (
                            <tr key={team.id} className="border-b">
                              <td className="p-3 font-medium">{index + 1}</td>
                              <td className="p-3">{team.name}</td>
                              <td className="p-3 text-center">{team.wins + team.losses}</td>
                              <td className="p-3 text-center">{team.wins}</td>
                              <td className="p-3 text-center">{team.losses}</td>
                              <td className="p-3 text-center font-bold">{team.points}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {activeTournament.status !== 'Completed' && tournamentTeams.length > 0 && (
                    <div className="glass-card p-4 rounded-xl mt-6">
                      <h4 className="font-semibold mb-3">Update Points Table</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Manually update team statistics if needed.
                      </p>
                      
                      <div className="flex space-x-2">
                        <button className="btn-outline text-sm">
                          Edit Points
                        </button>
                        <button className="btn-primary text-sm">
                          Auto Calculate
                        </button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <Trophy className="w-16 h-16 text-primary/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Tournament Selected</h2>
              <p className="text-muted-foreground text-center">
                Select a tournament from the left sidebar or create a new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Tournament;
