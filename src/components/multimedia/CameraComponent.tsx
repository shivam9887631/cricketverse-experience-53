
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Image, RotateCcw, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getCapacitorCamera } from '@/services/capacitorService';

interface CapturedPhoto {
  dataUrl: string;
  format: string;
}

const CameraComponent = () => {
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = async () => {
    try {
      setError(null);
      const camera = await getCapacitorCamera();
      if (!camera) {
        // Web fallback for development
        setError("Camera not available. In a real device, this would access the camera.");
        return;
      }

      const image = await camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: 'dataUrl',
        source: 'CAMERA'
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
    // For simplicity, we'll just simulate a save operation
    alert("Photo saved!");
  };

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
