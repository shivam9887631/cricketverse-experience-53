
import React from 'react';
import { useNetworkStatus } from '@/services/networkService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

const NetworkStatus: React.FC = () => {
  const { isOnline, connectionType } = useNetworkStatus();
  
  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>No Internet Connection</AlertTitle>
      <AlertDescription>
        You're currently offline. Some features may not work properly.
      </AlertDescription>
    </Alert>
  );
};

export default NetworkStatus;
