
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Plus, Upload, SmartphoneNfc } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getCapacitorCamera, isMobileBrowser } from '@/services/capacitorService';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  dataUrl: string;
  type: 'image' | 'video';
}

const SAMPLE_IMAGES = [
  'https://placehold.co/600x400/png?text=Sample+1',
  'https://placehold.co/600x400/png?text=Sample+2',
  'https://placehold.co/600x400/png?text=Sample+3',
  'https://placehold.co/600x400/png?text=Sample+4'
];

const MediaGallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isCapacitor, setIsCapacitor] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
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

  const pickFromGallery = async () => {
    try {
      setError(null);
      const camera = await getCapacitorCamera();
      
      if (!camera) {
        if (isMobile) {
          // Mobile browser fallback - use file input
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        } else {
          // Desktop browser fallback with sample images
          setError("Gallery access not available in browser. Loading sample images.");
          toast({
            title: "Gallery Not Available",
            description: "Gallery access works best in a native mobile app. Adding sample images instead.",
          });
          
          // Add sample images for demonstration
          const newItems = SAMPLE_IMAGES.map((url, index) => ({
            id: `sample-${Date.now()}-${index}`,
            dataUrl: url,
            type: 'image' as const
          }));
          
          setMediaItems(prev => [...prev, ...newItems]);
        }
        return;
      }

      const image = await camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      const newItem: MediaItem = {
        id: Date.now().toString(),
        dataUrl: image.dataUrl || '',
        type: 'image'
      };

      setMediaItems(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error accessing gallery:', error);
      setError('Failed to access gallery. Please check permissions.');
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newItems: MediaItem[] = [];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newItem: MediaItem = {
          id: `file-${Date.now()}-${file.name}`,
          dataUrl: reader.result as string,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        };
        
        newItems.push(newItem);
        if (newItems.length === files.length) {
          setMediaItems(prev => [...prev, ...newItems]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const viewItem = (item: MediaItem) => {
    setSelectedItem(item);
  };

  const closeViewer = () => {
    setSelectedItem(null);
  };

  const BrowserSimulationView = () => (
    <Card className="p-6 flex flex-col items-center space-y-4">
      <SmartphoneNfc className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold">Browser Compatibility Notice</h3>
      <p className="text-center text-muted-foreground">
        {isMobile 
          ? "Gallery access may be limited in mobile browsers. Try using the file upload option."
          : "Gallery access works best in a native mobile app. Click the button below to load sample images."}
      </p>
      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        <Button variant="outline" onClick={() => {
          const newItems = SAMPLE_IMAGES.map((url, index) => ({
            id: `sample-${Date.now()}-${index}`,
            dataUrl: url,
            type: 'image' as const
          }));
          
          setMediaItems(prev => [...prev, ...newItems]);
          
          toast({
            title: "Sample Images Added",
            description: "Sample images have been added to your gallery.",
          });
        }}>
          Load Samples
        </Button>
        <Button onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}>
          <Upload className="mr-2" /> Upload Files
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={pickFromGallery}>
          <Plus className="mr-2" /> {isCapacitor ? "Add Media" : "Upload Media"}
        </Button>
      </div>

      {/* Hidden file input for browser fallback */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*,video/*" 
        className="hidden" 
        onChange={handleFileInput} 
        multiple
      />

      {mediaItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-md">
          {!isCapacitor ? (
            <BrowserSimulationView />
          ) : (
            <>
              <Image className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your gallery is empty</p>
              <Button variant="outline" className="mt-4" onClick={pickFromGallery}>
                Import Media
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaItems.map((item) => (
            <div 
              key={item.id}
              className="aspect-square bg-muted rounded-md overflow-hidden cursor-pointer"
              onClick={() => viewItem(item)}
            >
              <img 
                src={item.dataUrl} 
                alt="Media" 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Media Viewer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl max-h-full overflow-auto">
            <img 
              src={selectedItem.dataUrl} 
              alt="Selected media" 
              className="max-w-full max-h-[80vh]"
            />
            <Button 
              variant="secondary" 
              className="mt-4"
              onClick={closeViewer}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
