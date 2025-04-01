
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentPosition } from '@/services/deviceFeaturesService';

const LocationFeature = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const { toast } = useToast();

  const handleGetLocation = async () => {
    try {
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
        throw new Error("Could not get location. Make sure location permissions are enabled.");
      }
    } catch (err) {
      console.error('Location error:', err);
      throw err;
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
        {location ? (
          <div className="space-y-2">
            <div><strong>Latitude:</strong> {location.latitude.toFixed(6)}</div>
            <div><strong>Longitude:</strong> {location.longitude.toFixed(6)}</div>
            <Button 
              variant="outline" 
              onClick={handleGetLocation} 
              className="mt-2"
            >
              Refresh Location
            </Button>
          </div>
        ) : (
          <Button onClick={handleGetLocation}>Get Current Location</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationFeature;
