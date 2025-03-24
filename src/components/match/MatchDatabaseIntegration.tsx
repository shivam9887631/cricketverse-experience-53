
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/hooks/useDatabase';
import { useMatch } from '@/services/cricketApi';
import { useUserData } from '@/services/customApi';
import { toast } from '@/components/ui/use-toast';

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
  const { id } = useParams<{ id: string }>();
  const currentMatchId = matchId || id || "";
  const userId = "user123"; // This would typically come from authentication
  
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
  
  // Get user data from custom API
  const { data: userData, isLoading: isUserLoading } = useUserData(userId);
  
  // Get user's match data from Firestore
  const { data: userMatchData, isLoading: isUserMatchLoading } = 
    useDocument(`${userId}_${currentMatchId}`);
  
  // Update state when userMatchData is loaded
  useEffect(() => {
    if (userMatchData) {
      setNotes(userMatchData.notes || "");
      setIsFavorite(userMatchData.favorite || false);
    }
  }, [userMatchData]);
  
  // Save or update notes
  const handleSaveNotes = () => {
    const data: UserMatch = {
      matchId: currentMatchId,
      userId,
      notes,
      favorite: isFavorite,
      createdAt: new Date().toISOString()
    };
    
    if (userMatchData) {
      updateDocument({ 
        id: `${userId}_${currentMatchId}`, 
        data: { notes, favorite: isFavorite } 
      });
      toast({
        title: "Notes Updated",
        description: "Your match notes have been updated successfully."
      });
    } else {
      createDocument(
        data, 
        `${userId}_${currentMatchId}`
      );
      toast({
        title: "Notes Created",
        description: "Your match notes have been saved successfully."
      });
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (userMatchData) {
      updateDocument({ 
        id: `${userId}_${currentMatchId}`, 
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
  
  const isLoading = isMatchLoading || isUserLoading || isUserMatchLoading;
  const isSaving = isCreating || isUpdating;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Match Details with Database Integration</CardTitle>
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
              {matchData && (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{matchData.title}</h3>
                    <Button
                      variant={isFavorite ? "default" : "outline"}
                      onClick={toggleFavorite}
                    >
                      {isFavorite ? "Favorited" : "Add to Favorites"}
                    </Button>
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
                </>
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
                />
                <Button onClick={handleSaveNotes} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Notes"}
                </Button>
              </div>
              
              {userData && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">User Preferences</h4>
                  <p>Theme: {userData.preferences.theme}</p>
                  <p>Notifications: {userData.preferences.notifications ? "Enabled" : "Disabled"}</p>
                  <p>Favorite Teams: {userData.preferences.favoriteTeams.join(", ")}</p>
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
