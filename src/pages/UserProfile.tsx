
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, Camera, ChevronRight, Edit, LogOut, Shield, User } from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const user = {
    name: 'Virat Kohli',
    username: 'viratkohli',
    email: 'virat@example.com',
    role: 'Player',
    team: 'Royal Challengers',
    joinDate: '2020-06-15',
    matches: 128,
    avatar: 'https://placehold.co/200x200/3B82F6/FFFFFF/png?text=VK',
    bio: 'Professional cricketer specializing in batting. Playing for Royal Challengers and the national team.',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra, India',
  };

  // Form state
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
    address: user.address,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated profile:', formData);
    setIsEditing(false);
    // Here you would typically update the user profile via API
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={() => console.log('Logout')}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    @{user.username}
                    <Badge variant="outline" className="ml-2">
                      {user.role}
                    </Badge>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-1 text-sm">
                <div className="font-medium">Team</div>
                <div className="text-muted-foreground">{user.team}</div>
                <div className="font-medium mt-2">Matches</div>
                <div className="text-muted-foreground">{user.matches}</div>
                <div className="font-medium mt-2">Member since</div>
                <div className="text-muted-foreground">
                  {new Date(user.joinDate).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {[
                  { icon: User, label: 'Personal Info', path: '/profile' },
                  { icon: Shield, label: 'Security', path: '/profile/security' },
                  { icon: Bell, label: 'Notifications', path: '/notifications' },
                ].map((item, i) => (
                  <Button key={i} variant="ghost" className="w-full justify-start" asChild>
                    <a href={item.path} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                      <ChevronRight className="ml-auto h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      {isEditing ? 'Update your profile details below' : 'View your profile information'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Input 
                            id="bio" 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleChange} 
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Save Changes</Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium text-sm">Full Name</h3>
                            <p className="text-muted-foreground">{user.name}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">Email</h3>
                            <p className="text-muted-foreground">{user.email}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">Phone</h3>
                            <p className="text-muted-foreground">{user.phone}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">Address</h3>
                            <p className="text-muted-foreground">{user.address}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-sm">Bio</h3>
                          <p className="text-muted-foreground">{user.bio}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                      Update your profile picture
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="mb-2">
                        <Camera className="mr-2 h-4 w-4" />
                        Upload New Image
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        JPG, GIF or PNG. Max size of 800K
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Stats</CardTitle>
                    <CardDescription>
                      View your cricket performance statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock statistics data */}
                      {[
                        { label: 'Matches', value: '128' },
                        { label: 'Runs', value: '4821' },
                        { label: 'Average', value: '42.3' },
                        { label: 'Strike Rate', value: '138.6' },
                        { label: 'Highest Score', value: '113' },
                        { label: 'Centuries', value: '6' },
                      ].map((stat, index) => (
                        <div key={index} className="flex justify-between border-b pb-2">
                          <span className="font-medium">{stat.label}</span>
                          <span>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your recent matches and achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock activity data */}
                      {[
                        { 
                          date: '2023-09-10', 
                          title: 'Match vs Mumbai Indians', 
                          description: 'Scored 72 runs off 53 balls' 
                        },
                        { 
                          date: '2023-09-05', 
                          title: 'Match vs Rajasthan Royals', 
                          description: 'Scored 48 runs off 32 balls' 
                        },
                        { 
                          date: '2023-08-30', 
                          title: 'Match vs Chennai Super Kings', 
                          description: 'Man of the Match - 95 runs off 58 balls' 
                        },
                      ].map((activity, index) => (
                        <div key={index} className="border-b pb-3">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium">{activity.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
