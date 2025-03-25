
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MatchDatabaseIntegration from '@/components/match/MatchDatabaseIntegration';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { addNotification } from '@/services/notificationService';
import { useToast } from '@/components/ui/use-toast';

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Send a notification when user views match details
    if (currentUser && id) {
      const notifyMatchView = async () => {
        try {
          await addNotification({
            userId: currentUser.uid,
            title: 'Match Viewed',
            message: `You viewed match with ID: ${id}`,
            type: 'info',
            isRead: false,
            createdAt: new Date()
          });
        } catch (error) {
          console.error('Failed to create notification:', error);
        }
      };
      
      notifyMatchView();
    }
  }, [currentUser, id]);
  
  if (!id) {
    return (
      <Layout>
        <div className="container mx-auto py-8">Match ID not found</div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Match Details</h1>
        <MatchDatabaseIntegration matchId={id} />
      </div>
    </Layout>
  );
};

export default MatchDetails;
