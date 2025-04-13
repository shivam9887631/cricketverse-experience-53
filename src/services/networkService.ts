
import { Network } from '@capacitor/network';
import { useEffect, useState } from 'react';

/**
 * Hook to monitor network connectivity status
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    let isMounted = true;
    
    const initNetwork = async () => {
      try {
        // Get current status
        const status = await Network.getStatus();
        if (isMounted) {
          setIsOnline(status.connected);
          setConnectionType(status.connectionType);
        }
        
        // Listen for changes
        Network.addListener('networkStatusChange', (status) => {
          if (isMounted) {
            setIsOnline(status.connected);
            setConnectionType(status.connectionType);
          }
        });
      } catch (err) {
        console.error('Network monitoring error:', err);
      }
    };
    
    initNetwork();
    
    return () => {
      isMounted = false;
      Network.removeAllListeners();
    };
  }, []);
  
  return { isOnline, connectionType };
};

/**
 * Check if network is available
 */
export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const status = await Network.getStatus();
    return status.connected;
  } catch (err) {
    console.error('Error checking network status:', err);
    return false;
  }
};
