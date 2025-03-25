
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/hooks/useDatabase';
import { useMatch } from '@/services/cricketApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { storeMatchData } from '@/utils/notificationUtils';

// Define types for our Firestore data
interface UserMatch {
  matchId: string;
  userId: string;
  notes: string;
  favorite: boolean;
  createdAt: string;
}

interface MatchDatabaseIntegrationProps {
  matchId?: string;
}

const MatchDatabaseIntegration = ({ matchId }: MatchDatabaseIntegrationProps) => {
  const currentMatchId = matchId || "";
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || "";
  
  // State for notes
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Use our Firebase hook
  const {
    createDocument,
    updateDocument,
    useDocument,
    isCreating,
    isUpdating
  } = useFirestore<UserMatch>("userMatches");
  
  // Get match data from Cricket API
  const { data: matchData, isLoading: isMatchLoading } = useMatch(currentMatchId);
  
  // Get user's match data from Firestore
  const { data: userMatchData, isLoading: isUserMatchLoading } = 
    useDocument(userId ? `${userId}_${currentMatchId}` : undefined);
  
  // Update state when userMatchData is loaded
  useEffect(() => {
    if (userMatchData) {
      setNotes(userMatchData.notes || "");
      setIsFavorite(userMatchData.favorite || false);
    }
  }, [userMatchData]);

  // Save match data to Firebase
  const saveMatchToFirebase = async () => {
    if (!currentUser || !matchData) return;
    
    try {
      const success = await storeMatchData(currentUser.uid, currentMatchId, matchData);
      
      if (success) {
        toast({
          title: "Match Saved",
          description: "Match data has been saved to your profile."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save match data.",
        variant: "destructive"
      });
    }
  };
  
  // Save or update notes
  const handleSaveNotes = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save notes.",
        variant: "destructive"
      });
      return;
    }
    
    const data: UserMatch = {
      matchId: currentMatchId,
      userId: currentUser.uid,
      notes,
      favorite: isFavorite,
      createdAt: new Date().toISOString()
    };
    
    if (userMatchData) {
      updateDocument({ 
        id: `${currentUser.uid}_${currentMatchId}`, 
        data: { notes, favorite: isFavorite } 
      });
      toast({
        title: "Notes Updated",
        description: "Your match notes have been updated successfully."
      });
    } else {
      createDocument(
        data, 
        `${currentUser.uid}_${currentMatchId}`
      );
      toast({
        title: "Notes Created",
        description: "Your match notes have been saved successfully."
      });
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to favorite matches.",
        variant: "destructive"
      });
      return;
    }
    
    setIsFavorite(!isFavorite);
    
    if (userMatchData) {
      updateDocument({ 
        id: `${currentUser.uid}_${currentMatchId}`, 
        data: { favorite: !isFavorite } 
      });
      toast({
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorite 
          ? "This match has been removed from your favorites." 
          : "This match has been added to your favorites."
      });
    }
  };
  
  const isLoading = isMatchLoading || isUserMatchLoading;
  const isSaving = isCreating || isUpdating;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Match Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <div className="space-y-4">
              {matchData ? (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{matchData.title}</h3>
                    <div className="space-x-2">
                      <Button
                        variant={isFavorite ? "default" : "outline"}
                        onClick={toggleFavorite}
                        disabled={!currentUser}
                      >
                        {isFavorite ? "Favorited" : "Add to Favorites"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={saveMatchToFirebase}
                        disabled={!currentUser || !matchData}
                      >
                        Save Match Data
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{matchData.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{matchData.date}</p>
                    </div>
                  </div>
                  
                  {matchData.score && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Team</TableHead>
                          <TableHead>Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{matchData.teams.home}</TableCell>
                          <TableCell>{matchData.score.home}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{matchData.teams.away}</TableCell>
                          <TableCell>{matchData.score.away}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="notes" className="block font-medium">
                      Your Notes
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your notes about this match..."
                      disabled={!currentUser}
                    />
                    <Button 
                      onClick={handleSaveNotes} 
                      disabled={isSaving || !currentUser}
                    >
                      {isSaving ? "Saving..." : "Save Notes"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p>No match data available. This could be because:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>The match ID is invalid</li>
                    <li>The Cricket API is unavailable</li>
                    <li>There was an error fetching the match data</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchDatabaseIntegration;
