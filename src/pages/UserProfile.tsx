
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Bell, Shield, User } from 'lucide-react';
import ProfileHeader from '@/components/user-profile/ProfileHeader';
import UserCard from '@/components/user-profile/UserCard';
import NavigationCard from '@/components/user-profile/NavigationCard';
import ProfileContent from '@/components/user-profile/ProfileContent';
import useRequireAuth from '@/hooks/useRequireAuth';
import { authService } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { generateSampleNotifications } from '@/utils/notificationUtils';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingNotifications, setIsGeneratingNotifications] = useState(false);
  const { currentUser } = useRequireAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock user data
  const user = {
    name: currentUser?.displayName || 'User',
    username: currentUser?.email?.split('@')[0] || 'username',
    email: currentUser?.email || 'user@example.com',
    role: 'Player',
    team: 'Royal Challengers',
    joinDate: '2020-06-15',
    matches: 128,
    avatar: currentUser?.photoURL || 'https://placehold.co/200x200/3B82F6/FFFFFF/png?text=VK',
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

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
        variant: "default",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
      console.error("Logout error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

  const handleGenerateNotifications = async () => {
    if (!currentUser) return;
    
    try {
      setIsGeneratingNotifications(true);
      await generateSampleNotifications(currentUser.uid);
      toast({
        title: "Sample notifications created",
        description: "Check your notifications page to see them",
        variant: "default",
      });
      
    } catch (error) {
      console.error("Error generating notifications:", error);
      toast({
        title: "Error creating notifications",
        description: "There was an error creating sample notifications",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingNotifications(false);
    }
  };

  const navigationItems = [
    { icon: User, label: 'Personal Info', path: '/profile' },
    { icon: Shield, label: 'Security', path: '/profile/security' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <ProfileHeader 
          title="Profile" 
          description="Manage your account settings and preferences"
          onLogout={handleLogout}
        />

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <div className="flex flex-col gap-6">
            <UserCard 
              user={user} 
              onEditProfile={() => setIsEditing(true)} 
            />
            
            <NavigationCard items={navigationItems} />
            
            <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Developer Tools</h3>
              <Button 
                onClick={handleGenerateNotifications}
                disabled={isGeneratingNotifications}
                size="sm"
                className="w-full"
              >
                {isGeneratingNotifications ? "Generating..." : "Generate Sample Notifications"}
              </Button>
            </div>
          </div>

          <ProfileContent 
            user={user}
            isEditing={isEditing}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setIsEditing={setIsEditing}
          />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
