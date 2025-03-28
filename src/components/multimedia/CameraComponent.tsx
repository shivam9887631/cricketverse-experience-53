
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Image, RotateCcw, Save, SmartphoneNfc, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getCapacitorCamera, isMobileBrowser, takeMobilePhoto } from '@/services/capacitorService';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CapturedPhoto {
  dataUrl: string;
  format: string;
}

const CameraComponent = () => {
  const [photo, setPhoto] = useState<CapturedPhoto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCapacitor, setIsCapacitor] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we're on a mobile browser
    setIsMobile(isMobileBrowser());
    
    // Check if Capacitor is available
    const checkCapacitor = async () => {
      const camera = await getCapacitorCamera();
      setIsCapacitor(!!camera);
    };
    
    checkCapacitor();
  }, []);

  const takePhoto = async () => {
    try {
      setError(null);
      setIsCapturing(true);
      const camera = await getCapacitorCamera();
      
      if (!camera) {
        if (isMobile) {
          // Use direct input with capture for mobile browsers
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        } else {
          // Desktop browser fallback
          setError("Camera not available in browser. This feature requires a native mobile app or mobile browser.");
          toast({
            title: "Camera Not Available",
            description: "Camera access works best in a native mobile app or on a mobile device.",
            variant: "destructive"
          });
        }
        setIsCapturing(false);
        return;
      }

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
      setIsCapturing(false);
    } catch (error) {
      console.error('Error taking photo:', error);
      setError('Failed to take photo. Please check camera permissions.');
      setIsCapturing(false);
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto({
        dataUrl: reader.result as string,
        format: file.type.split('/')[1] || 'jpeg'
      });
      
      toast({
        title: "Photo Captured",
        description: "Photo has been successfully captured.",
      });
    };
    reader.onerror = () => {
      setError('Failed to read selected file.');
    };
    reader.readAsDataURL(file);
  };

  const resetPhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const savePhoto = () => {
    if (!photo) return;
    
    toast({
      title: "Photo Saved",
      description: "Your photo has been saved successfully.",
    });
  };

  const MobilePromptView = () => (
    <Card className="p-6 flex flex-col items-center space-y-4">
      <Camera className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">Camera Access</h3>
      <p className="text-center text-muted-foreground">
        Tap the button below to take a photo with your device camera.
      </p>
      <Button 
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        disabled={isCapturing}
      >
        <Camera className="mr-2" /> Take Photo
      </Button>
    </Card>
  );

  const BrowserSimulationView = () => (
    <Card className="p-6 flex flex-col items-center space-y-4">
      <SmartphoneNfc className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">Browser Compatibility Notice</h3>
      <p className="text-center text-muted-foreground">
        {isMobile 
          ? "Tap the button below to use your device camera."
          : "Camera access requires a mobile device or native app. This is a browser simulation view."}
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
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}>
          <Upload className="mr-2" /> Upload Image
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
        ) : isCapacitor ? (
          <Camera className="h-16 w-16 text-muted-foreground" />
        ) : isMobile ? (
          <MobilePromptView />
        ) : (
          <BrowserSimulationView />
        )}
      </div>

      {/* Hidden file input for browser fallback */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileInput} 
        capture="environment"
      />

      <div className="flex space-x-4">
        {!photo ? (
          isCapacitor && (
            <Button onClick={takePhoto} disabled={isCapturing}>
              <Camera className="mr-2" /> {isCapturing ? "Processing..." : "Take Photo"}
            </Button>
          )
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
