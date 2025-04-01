
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { isNativePlatform } from '@/services/deviceFeaturesService';

// Import our new component modules
import LocationFeature from './LocationFeature';
import DeviceInfoFeature from './DeviceInfoFeature';
import MotionFeature from './MotionFeature';
import PlatformNotice from './PlatformNotice';

const DeviceFeatures = () => {
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const isNative = isNativePlatform();

  // Error handler function to be passed to child components
  const handleError = (err: Error) => {
    console.error('Device feature error:', err);
    setError(err.message);
  };

  // If not on mobile device or native app, show platform notice
  if (!isMobile && !isNative) {
    return <PlatformNotice />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Wrap feature components in error boundaries */}
      <ErrorWrapper onError={handleError}>
        <LocationFeature />
      </ErrorWrapper>
      
      <ErrorWrapper onError={handleError}>
        <DeviceInfoFeature />
      </ErrorWrapper>
      
      <ErrorWrapper onError={handleError}>
        <MotionFeature />
      </ErrorWrapper>
    </div>
  );
};

// Simple error wrapper to catch errors from feature components
const ErrorWrapper = ({ children, onError }: { children: React.ReactNode, onError: (err: Error) => void }) => {
  try {
    return <>{children}</>;
  } catch (err) {
    if (err instanceof Error) {
      onError(err);
    } else {
      onError(new Error('Unknown error occurred'));
    }
    return null;
  }
};

export default DeviceFeatures;
