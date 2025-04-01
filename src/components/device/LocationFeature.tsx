
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentPosition } from '@/services/deviceFeaturesService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LocationFeature = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetLocation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const position = await getCurrentPosition();
      
      if (position && position.coords) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        toast({
          title: "Location Retrieved",
          description: `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`
        });
      } else {
        setError("Could not get location. Make sure location permissions are enabled.");
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Failed to retrieve location. Please check your permissions."
        });
      }
    } catch (err) {
      console.error('Location error:', err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast({
        variant: "destructive",
        title: "Location Error",
        description: err instanceof Error ? err.message : "Unknown error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2" /> Location (GPS)
        </CardTitle>
        <CardDescription>Access device geolocation</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {location ? (
          <div className="space-y-2">
            <div><strong>Latitude:</strong> {location.latitude.toFixed(6)}</div>
            <div><strong>Longitude:</strong> {location.longitude.toFixed(6)}</div>
            <Button 
              variant="outline" 
              onClick={handleGetLocation} 
              className="mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Getting Location...' : 'Refresh Location'}
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleGetLocation}
            disabled={isLoading}
          >
            {isLoading ? 'Getting Location...' : 'Get Current Location'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationFeature;
