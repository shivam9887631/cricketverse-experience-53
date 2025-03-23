
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Bell, Shield, User } from 'lucide-react';
import ProfileHeader from '@/components/user-profile/ProfileHeader';
import UserCard from '@/components/user-profile/UserCard';
import NavigationCard from '@/components/user-profile/NavigationCard';
import ProfileContent from '@/components/user-profile/ProfileContent';

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
          onLogout={() => console.log('Logout')}
        />

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <div className="flex flex-col gap-6">
            <UserCard 
              user={user} 
              onEditProfile={() => setIsEditing(true)} 
            />
            
            <NavigationCard items={navigationItems} />
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
