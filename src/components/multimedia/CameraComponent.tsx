
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Image, RotateCcw, Save, SmartphoneNfc } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getCapacitorCamera } from '@/services/capacitorService';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';

interface CapturedPhoto {
  dataUrl: string;
  format: string;
}

const CameraComponent = () => {
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { toast } = useToast();

  const takePhoto = async () => {
    try {
      setError(null);
      const camera = await getCapacitorCamera();
      
      if (!camera) {
        // Web fallback for development
        setIsMobile(false);
        setError("Camera not available in browser. This feature requires a mobile device.");
        toast({
          title: "Camera Not Available",
          description: "Camera access requires a native mobile device. This is a development fallback.",
          variant: "destructive"
        });
        return;
      }

      setIsMobile(true);
      const image = await camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      setPhoto({
        dataUrl: image.dataUrl || '',
        format: image.format
      });
    } catch (error) {
      console.error('Error taking photo:', error);
      setError('Failed to take photo. Please check camera permissions.');
    }
  };

  const resetPhoto = () => {
    setPhoto(null);
  };

  const savePhoto = () => {
    if (!photo) return;
    
    // In a real app, you would implement saving to device or cloud storage
    toast({
      title: "Photo Saved",
      description: "Your photo has been saved successfully.",
    });
  };

  const BrowserSimulationView = () => (
    <Card className="p-6 flex flex-col items-center space-y-4">
      <SmartphoneNfc className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">Mobile Device Required</h3>
      <p className="text-center text-muted-foreground">
        Camera access requires a native mobile device. This is a browser simulation view.
      </p>
      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        <Button variant="outline" onClick={() => {
          setPhoto({
            dataUrl: 'https://placehold.co/600x400/jpeg',
            format: 'jpeg'
          });
          toast({
            title: "Simulated Photo",
            description: "A placeholder photo has been loaded for demonstration.",
          });
        }}>
          Simulate Photo
        </Button>
        <Button onClick={() => {
          window.open('https://capacitorjs.com/docs/apis/camera', '_blank');
        }}>
          Learn More
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col space-y-4 items-center">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative w-full aspect-square max-w-md bg-muted rounded-md overflow-hidden flex items-center justify-center">
        {photo ? (
          <img 
            src={photo.dataUrl} 
            alt="Captured" 
            className="w-full h-full object-cover"
          />
        ) : isMobile === false ? (
          <BrowserSimulationView />
        ) : (
          <Camera className="h-16 w-16 text-muted-foreground" />
        )}
      </div>

      <div className="flex space-x-4">
        {!photo ? (
          <Button onClick={takePhoto}>
            <Camera className="mr-2" /> Take Photo
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={resetPhoto}>
              <RotateCcw className="mr-2" /> Reset
            </Button>
            <Button onClick={savePhoto}>
              <Save className="mr-2" /> Save
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraComponent;
