
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProfileHeader from '@/components/user-profile/ProfileHeader';
import ProfileContent from '@/components/user-profile/ProfileContent';
import UserActivityList from '@/components/user-profile/UserActivityList';
import useRequireAuth from '@/hooks/useRequireAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';

const UserProfile = () => {
  // Redirect to login if not authenticated
  const { currentUser, loading } = useRequireAuth();
  const { userData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.displayName || currentUser?.displayName || '',
    email: userData?.email || currentUser?.email || '',
    phone: userData?.phoneNumber || '',
    bio: userData?.bio || '',
    address: userData?.address || ''
  });
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the user profile in Firebase
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully."
    });
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Prepare user data for components
  const userData_: any = userData || {}; 
  const user = {
    name: userData_?.displayName || currentUser?.displayName || 'User',
    email: userData_?.email || currentUser?.email || '',
    phone: userData_?.phoneNumber || '',
    bio: userData_?.bio || 'No bio available',
    address: userData_?.address || '',
    avatar: userData_?.photoURL || currentUser?.photoURL || '',
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-8">
        <ProfileHeader 
          title={`${user.name}'s Profile`}
          description="Manage your account settings and preferences"
          onLogout={handleLogout}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProfileContent 
              user={user}
              isEditing={isEditing}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              setIsEditing={setIsEditing}
            />
          </div>
          <div className="md:col-span-1">
            <UserActivityList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
