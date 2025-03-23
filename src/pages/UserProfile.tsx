
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  LogOut, 
  Edit, 
  Save, 
  X, 
  Camera,
  Moon,
  Sun,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Mock user data
const userData = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  location: 'Mumbai, India',
  role: 'Spectator',
  image: 'https://placehold.co/200x200/3B82F6/FFFFFF/png?text=JD',
  bio: 'Cricket enthusiast and fan. Always supporting Mumbai Indians!',
  createdAt: '2023-01-15T10:30:00Z',
  preferences: {
    notifications: {
      matchAlerts: true,
      tournamentUpdates: true,
      newsAndArticles: false,
      playerUpdates: true
    },
    privacy: {
      showProfile: true,
      showActivity: true
    },
    darkMode: false
  },
  teams: [
    { id: 1, name: 'Mumbai Indians', role: 'Fan', since: '2015' },
    { id: 2, name: 'India National Team', role: 'Fan', since: '2010' }
  ],
  recentActivity: [
    { type: 'follow', subject: 'Virat Kohli', date: '2023-09-08T14:30:00Z' },
    { type: 'comment', subject: 'CSK vs MI Match', date: '2023-09-07T16:45:00Z' },
    { type: 'like', subject: 'Top 10 IPL Moments', date: '2023-09-06T10:15:00Z' },
    { type: 'follow', subject: 'Mumbai Indians', date: '2023-09-05T09:20:00Z' }
  ]
};

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (key: string, subKey: string, value: boolean) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: {
          ...prev.preferences[key as keyof typeof prev.preferences],
          [subKey]: value
        }
      }
    }));

    toast({
      title: "Preference Updated",
      description: `${subKey} is now ${value ? 'enabled' : 'disabled'}.`,
      duration: 2000,
    });
  };

  const handleDarkModeToggle = (value: boolean) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        darkMode: value
      }
    }));

    toast({
      title: "Theme Changed",
      description: `${value ? 'Dark' : 'Light'} mode is now enabled.`,
      duration: 2000,
    });

    // Simulate applying the theme
    document.documentElement.classList.toggle('dark', value);
  };

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      location: editFormData.location,
      bio: editFormData.bio
    }));
    
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
      duration: 3000,
    });
  };

  const handleCancelEdit = () => {
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      bio: user.bio
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Simulate password update
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
      duration: 3000,
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
      duration: 3000,
    });
    // Redirect to login page would happen here
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="relative flex items-center justify-center w-16 h-16">
            <div className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-full animate-spin"></div>
            <User className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Information */}
        <div className="md:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-xl overflow-hidden"
          >
            <div className="relative h-32 bg-gradient-to-r from-primary to-primary/60">
              <div className="absolute -bottom-12 left-6">
                <div className="relative">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-background"
                  />
                  <button className="absolute bottom-0 right-0 rounded-full bg-primary text-white w-8 h-8 flex items-center justify-center">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-14 pb-6 px-6">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.role}</p>
              
              <div className="glass-card rounded-lg p-3 mt-4">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center text-sm mt-2">
                  <Phone className="w-4 h-4 text-muted-foreground mr-2" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-sm mt-2">
                  <Globe className="w-4 h-4 text-muted-foreground mr-2" />
                  <span>{user.location}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">About</h3>
                <p className="text-sm text-muted-foreground">
                  {user.bio}
                </p>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleLogout}
                  className="btn-outline w-full flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-card rounded-xl p-6 mt-6"
          >
            <h3 className="font-semibold mb-4 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              {user.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'follow' ? 'bg-blue-500/10 text-blue-500' :
                    activity.type === 'like' ? 'bg-red-500/10 text-red-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {activity.type === 'follow' ? <User className="w-4 h-4" /> :
                     activity.type === 'like' ? <div className="text-base">❤️</div> :
                     <div className="text-base">💬</div>}
                  </div>
                  <div>
                    <p className="text-sm">
                      {activity.type === 'follow' ? `Followed ${activity.subject}` :
                       activity.type === 'like' ? `Liked ${activity.subject}` :
                       `Commented on ${activity.subject}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Right Column - Settings & Teams */}
        <div className="md:col-span-2">
          <Tabs defaultValue="edit-profile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="edit-profile" className="text-sm">Edit Profile</TabsTrigger>
              <TabsTrigger value="preferences" className="text-sm">Preferences</TabsTrigger>
              <TabsTrigger value="teams" className="text-sm">My Teams</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit-profile" className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Account Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-outline text-sm flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="btn-outline text-sm flex items-center"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="btn-primary text-sm flex items-center"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        id="name"
                        name="name"
                        value={editFormData.name}
                        onChange={handleInputChange}
                        className="form-input w-full"
                      />
                    ) : (
                      <div className="form-input bg-muted">{user.name}</div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={editFormData.email}
                        onChange={handleInputChange}
                        className="form-input w-full"
                      />
                    ) : (
                      <div className="form-input bg-muted">{user.email}</div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        id="phone"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleInputChange}
                        className="form-input w-full"
                      />
                    ) : (
                      <div className="form-input bg-muted">{user.phone}</div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        id="location"
                        name="location"
                        value={editFormData.location}
                        onChange={handleInputChange}
                        className="form-input w-full"
                      />
                    ) : (
                      <div className="form-input bg-muted">{user.location}</div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        id="bio"
                        name="bio"
                        value={editFormData.bio}
                        onChange={handleInputChange}
                        className="form-input w-full min-h-[100px]"
                      />
                    ) : (
                      <div className="form-input bg-muted min-h-[80px]">{user.bio}</div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="font-semibold mb-4">Change Password</h3>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="current-password"
                        type={showPassword.current ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="form-input pl-10 pr-10 block w-full"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPassword.current ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="new-password"
                        type={showPassword.new ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-input pl-10 pr-10 block w-full"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPassword.new ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirm-password"
                        type={showPassword.confirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-input pl-10 pr-10 block w-full"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button type="submit" className="btn-primary w-full">
                      Update Password
                    </button>
                  </div>
                </form>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="preferences">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-primary" />
                    Notification Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Match Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about match schedules and live scores
                        </p>
                      </div>
                      <Switch 
                        checked={user.preferences.notifications.matchAlerts} 
                        onCheckedChange={(value) => handleToggleChange('notifications', 'matchAlerts', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Tournament Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about tournaments you follow
                        </p>
                      </div>
                      <Switch 
                        checked={user.preferences.notifications.tournamentUpdates} 
                        onCheckedChange={(value) => handleToggleChange('notifications', 'tournamentUpdates', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">News and Articles</p>
                        <p className="text-sm text-muted-foreground">
                          Get the latest cricket news and articles
                        </p>
                      </div>
                      <Switch 
                        checked={user.preferences.notifications.newsAndArticles} 
                        onCheckedChange={(value) => handleToggleChange('notifications', 'newsAndArticles', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Player Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Get updates about players you follow
                        </p>
                      </div>
                      <Switch 
                        checked={user.preferences.notifications.playerUpdates} 
                        onCheckedChange={(value) => handleToggleChange('notifications', 'playerUpdates', value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-primary" />
                    Privacy Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Public Profile</p>
                        <p className="text-sm text-muted-foreground">
                          Allow others to view your profile
                        </p>
                      </div>
                      <Switch 
                        checked={user.preferences.privacy.showProfile} 
                        onCheckedChange={(value) => handleToggleChange('privacy', 'showProfile', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activity Visibility</p>
                        <p className="text-sm text-muted-foreground">
                          Show your activities to other users
                        </p>
                      </div>
                      <Switch 
                        checked={user.preferences.privacy.showActivity} 
                        onCheckedChange={(value) => handleToggleChange('privacy', 'showActivity', value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-primary" />
                    Appearance
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark theme
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <Switch 
                        checked={user.preferences.darkMode} 
                        onCheckedChange={handleDarkModeToggle}
                      />
                      <Moon className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="teams">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Teams You Follow</h3>
                  
                  <div className="space-y-4">
                    {user.teams.map((team, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-4 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                            🏏
                          </div>
                          <div>
                            <h4 className="font-medium">{team.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Following since {team.since}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary mr-3">
                            {team.role}
                          </span>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button className="btn-outline">
                      Discover More Teams
                    </button>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-semibold mb-4">Team Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Match Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about matches for teams you follow
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">News Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Receive news about teams you follow
                        </p>
                      </div>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Highlights</p>
                        <p className="text-sm text-muted-foreground">
                          Get match highlights for your teams
                        </p>
                      </div>
                      <Switch checked={false} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
