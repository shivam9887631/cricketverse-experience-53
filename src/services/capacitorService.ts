
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

/**
 * Check if running on a mobile browser
 */
export const isMobileBrowser = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get Capacitor Camera safely (returns null if not available)
 */
export const getCapacitorCamera = async (): Promise<typeof Camera | null> => {
  try {
    // Check if the Camera plugin is available
    if (window.Capacitor && Camera) {
      // Check permissions before returning
      const permissionStatus = await Camera.checkPermissions();
      
      if (permissionStatus.camera !== 'granted') {
        const requestResult = await Camera.requestPermissions();
        if (requestResult.camera !== 'granted') {
          console.warn('Camera permission not granted');
          return null;
        }
      }
      
      return Camera;
    }
    return null;
  } catch (error) {
    console.error('Error initializing camera:', error);
    return null;
  }
};

/**
 * Take a photo using the device camera (mobile browsers)
 * Fallback for when Capacitor camera is not available
 */
export const takeMobilePhoto = async (): Promise<Photo | null> => {
  try {
    // Try to use Capacitor Camera if available
    const camera = await getCapacitorCamera();
    
    if (camera) {
      return await camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
    }
    
    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
};
