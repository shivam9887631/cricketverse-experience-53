
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info } from 'lucide-react';

const PlatformNotice = () => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Device features require a mobile device</AlertTitle>
        <AlertDescription>
          These features work best on a mobile device or in a native app environment.
          Please view this page on a mobile device or in the Capacitor native app.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2" /> Device Features Demo
          </CardTitle>
          <CardDescription>
            This page demonstrates mobile device features like GPS, device info, and motion sensors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            When viewed on a mobile device, you'll be able to:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Access your current GPS location</li>
            <li>View device model and operating system information</li>
            <li>Monitor battery level and charging status</li>
            <li>Use motion sensors (accelerometer & gyroscope)</li>
            <li>Detect when you shake your device</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformNotice;
