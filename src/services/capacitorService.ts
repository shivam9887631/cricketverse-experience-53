
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

// Check if Camera is available (will be true on native builds but not in web browser)
export const getCapacitorCamera = async () => {
  // Check if we're in a Capacitor app
  if (window.Capacitor && window.Capacitor.isNativePlatform()) {
    try {
      await Camera.requestPermissions();
      return Camera;
    } catch (error) {
      console.error("Camera permissions not granted:", error);
      return null;
    }
  }
  
  // Return null if we're in a web browser
  return null;
};

// Function to convert Blob to base64
export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
