
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getCapacitorCamera } from '@/services/capacitorService';
import { CameraResultType, CameraSource } from '@capacitor/camera';

interface MediaItem {
  id: string;
  dataUrl: string;
  type: 'image' | 'video';
}

const MediaGallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const pickFromGallery = async () => {
    try {
      setError(null);
      const camera = await getCapacitorCamera();
      
      if (!camera) {
        // Web fallback for development
        setError("Gallery access not available. In a real device, this would access the photo gallery.");
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

  const viewItem = (item: MediaItem) => {
    setSelectedItem(item);
  };

  const closeViewer = () => {
    setSelectedItem(null);
  };

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
          <Plus className="mr-2" /> Add Media
        </Button>
      </div>

      {mediaItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-md">
          <Image className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Your gallery is empty</p>
          <Button variant="outline" className="mt-4" onClick={pickFromGallery}>
            Import Media
          </Button>
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
