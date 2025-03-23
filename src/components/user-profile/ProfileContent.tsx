
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import ProfileForm from './ProfileForm';
import ProfileInfo from './ProfileInfo';
import ProfilePicture from './ProfilePicture';
import StatsCard from './StatsCard';
import ActivityCard from './ActivityCard';
import { motion } from 'framer-motion';

interface UserData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  avatar: string;
}

interface ProfileContentProps {
  user: UserData;
  isEditing: boolean;
  formData: {
    name: string;
    email: string;
    phone: string;
    bio: string;
    address: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setIsEditing: (value: boolean) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  user,
  isEditing,
  formData,
  handleChange,
  handleSubmit,
  setIsEditing
}) => {
  const stats = [
    { label: 'Matches', value: '128' },
    { label: 'Runs', value: '4821' },
    { label: 'Average', value: '42.3' },
    { label: 'Strike Rate', value: '138.6' },
    { label: 'Highest Score', value: '113' },
    { label: 'Centuries', value: '6' },
  ];

  const activities = [
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
  ];

  return (
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
                <ProfileForm 
                  formData={formData}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <ProfileInfo user={user} />
              )}
            </CardContent>
          </Card>
          
          <ProfilePicture 
            name={user.name} 
            avatar={user.avatar} 
            onUploadImage={() => console.log('Upload image')} 
          />
        </TabsContent>
        
        <TabsContent value="stats">
          <StatsCard 
            title="Performance Stats" 
            description="View your cricket performance statistics"
            stats={stats}
          />
        </TabsContent>
        
        <TabsContent value="activity">
          <ActivityCard 
            title="Recent Activity"
            description="Your recent matches and achievements"
            activities={activities}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfileContent;
