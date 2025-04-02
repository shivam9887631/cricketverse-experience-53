
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, RefreshCw, Map } from 'lucide-react';
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
        throw new Error("Unable to retrieve location data. Please try again.");
      }
    } catch (err) {
      console.error('Location error:', err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Location Error",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Try to get location on component mount
  useEffect(() => {
    // Only try automatically if we don't already have a location
    if (!location && !error) {
      handleGetLocation();
    }
  }, []);

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
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={handleGetLocation} 
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Refreshing...</>
                ) : (
                  <><RefreshCw className="h-4 w-4 mr-2" /> Refresh Location</>
                )}
              </Button>
              
              {location && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                    window.open(mapsUrl, '_blank');
                  }}
                  className="flex items-center"
                >
                  <Map className="h-4 w-4 mr-2" /> View on Map
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Button 
              onClick={handleGetLocation}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Getting Location...</>
              ) : (
                <><MapPin className="h-4 w-4 mr-2" /> Get Current Location</>
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Please ensure location services are enabled in your device settings
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationFeature;
