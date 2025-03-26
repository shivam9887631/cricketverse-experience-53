
import React from 'react';
import Layout from '@/components/Layout';
import { ProfileHeader } from '@/components/user-profile/ProfileHeader';
import { ProfileContent } from '@/components/user-profile/ProfileContent';
import { UserActivityList } from '@/components/user-profile/UserActivityList';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const UserProfile = () => {
  // Redirect to login if not authenticated
  const { loading } = useRequireAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-8">
        <ProfileHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProfileContent />
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
