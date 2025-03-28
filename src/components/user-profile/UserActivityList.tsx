import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Heart, Bookmark, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { generateMatchNotifications } from '@/utils/notificationUtils';
import { toast } from '@/components/ui/use-toast';
import { useFirestore } from '@/hooks/useDatabase';
import { MatchActivity } from '@/utils/matchUtils';
import { Timestamp } from 'firebase/firestore';

const UserActivityList = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || '';
  
  // Use real-time updates for match activities
  const { useRealtimeCollection } = useFirestore<MatchActivity>('matchActivities');
  const { data: activities, loading: isLoading, error } = useRealtimeCollection(
    userId ? [{ field: 'userId', operator: '==', value: userId }] : [],
    'timestamp',
    'desc'
  );
  
  const handleGenerateNotifications = async () => {
    if (!currentUser) return;
    
    try {
      const success = await generateMatchNotifications(currentUser.uid);
      
      if (success) {
        toast({
          title: "Notifications Generated",
          description: "Sample match notifications have been generated."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate notifications.",
        variant: "destructive"
      });
    }
  };
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'favorite':
        return <Heart className="h-4 w-4" />;
      case 'note':
        return <Bookmark className="h-4 w-4" />;
      case 'share':
        return <Share2 className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  if (error) {
    console.error("Error fetching activities:", error);
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Cricket Activity</CardTitle>
          <Button size="sm" onClick={handleGenerateNotifications}>
            Generate Sample Notifications
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b">
                <div className="bg-muted p-2 rounded-full">
                  {getActivityIcon(activity.activityType)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{activity.matchTitle}</h4>
                    <Badge variant="outline">{activity.activityType}</Badge>
                  </div>
                  {activity.details && (
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(
                      activity.timestamp instanceof Timestamp 
                        ? activity.timestamp.toDate() 
                        : new Date(activity.timestamp), 
                      { addSuffix: true }
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No activity recorded yet</p>
            <Button className="mt-2" variant="outline" size="sm" onClick={handleGenerateNotifications}>
              Generate Sample Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActivityList;
