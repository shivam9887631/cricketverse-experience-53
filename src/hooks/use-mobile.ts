
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the current device is a mobile device
 * @returns {boolean} True if the device is mobile
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileDeviceRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      
      // Check if device is mobile based on user agent
      const isMobileDevice = mobileDeviceRegex.test(userAgent);
      
      // Check if screen size is typical for mobile (under 768px width)
      const isSmallScreen = window.innerWidth < 768;
      
      // Check if running in a Capacitor app
      const isCapacitorApp = 
        window.Capacitor !== undefined || 
        document.URL.startsWith('capacitor://') || 
        document.URL.startsWith('ionic://');
      
      setIsMobile(isMobileDevice || isSmallScreen || isCapacitorApp);
    };

    checkDevice();
    
    // Update on resize
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};
