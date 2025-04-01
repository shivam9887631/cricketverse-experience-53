
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  MapPin, 
  Battery, 
  Smartphone, 
  Activity,
  AlertTriangle,
  Compass,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  getCurrentPosition, 
  getDeviceInfo, 
  getBatteryInfo,
  startAccelerometerUpdates,
  stopAccelerometerUpdates,
  MotionData,
  detectShake,
  isNativePlatform
} from '@/services/deviceFeaturesService';

const DeviceFeatures = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [batteryInfo, setBatteryInfo] = useState<{ level: number; isCharging: boolean } | null>(null);
  const [motionData, setMotionData] = useState<MotionData | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isNative = isNativePlatform();

  useEffect(() => {
    // Cleanup function to stop sensors when component unmounts
    return () => {
      if (isListening) {
        stopAccelerometerUpdates();
      }
    };
  }, [isListening]);

  const handleGetLocation = async () => {
    try {
      setError(null);
      const position = await getCurrentPosition();
      if (position && position.coords) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        toast({
          title: "Location Retrieved",
          description: `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`
        });
      } else {
        setError("Could not get location. Make sure location permissions are enabled.");
      }
    } catch (err) {
      console.error('Location error:', err);
      setError("Error accessing location services.");
    }
  };

  const handleGetDeviceInfo = async () => {
    try {
      setError(null);
      const info = await getDeviceInfo();
      setDeviceInfo(info);
      
      const battery = await getBatteryInfo();
      setBatteryInfo(battery);
      
      toast({
        title: "Device Info Retrieved",
        description: `${info?.manufacturer || 'Unknown'} ${info?.model || 'Device'}`
      });
    } catch (err) {
      console.error('Device info error:', err);
      setError("Error accessing device information.");
    }
  };

  const handleToggleMotion = async () => {
    if (isListening) {
      // Stop listening
      await stopAccelerometerUpdates();
      setIsListening(false);
      toast({
        title: "Motion Sensors Stopped",
        description: "No longer monitoring device movement"
      });
    } else {
      // Start listening
      setError(null);
      const success = await startAccelerometerUpdates((data) => {
        setMotionData(data);
        
        // Check for shake
        detectShake(data, () => {
          setShakeCount(prev => prev + 1);
          toast({
            title: "Shake Detected!",
            description: "You shook your device"
          });
        });
      });
      
      if (success) {
        setIsListening(true);
        toast({
          title: "Motion Sensors Active",
          description: "Monitoring device movement"
        });
      } else {
        setError("Could not access motion sensors. Make sure permissions are granted.");
      }
    }
  };

  const renderLocationSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2" /> Location (GPS)
        </CardTitle>
        <CardDescription>Access device geolocation</CardDescription>
      </CardHeader>
      <CardContent>
        {location ? (
          <div className="space-y-2">
            <div><strong>Latitude:</strong> {location.latitude.toFixed(6)}</div>
            <div><strong>Longitude:</strong> {location.longitude.toFixed(6)}</div>
            <Button 
              variant="outline" 
              onClick={handleGetLocation} 
              className="mt-2"
            >
              Refresh Location
            </Button>
          </div>
        ) : (
          <Button onClick={handleGetLocation}>Get Current Location</Button>
        )}
      </CardContent>
    </Card>
  );

  const renderDeviceInfoSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smartphone className="mr-2" /> Device Information
        </CardTitle>
        <CardDescription>View device details and battery status</CardDescription>
      </CardHeader>
      <CardContent>
        {deviceInfo ? (
          <div className="space-y-3">
            <div><strong>Platform:</strong> {deviceInfo.platform}</div>
            <div><strong>Model:</strong> {deviceInfo.model}</div>
            <div><strong>Manufacturer:</strong> {deviceInfo.manufacturer}</div>
            <div><strong>Operating System:</strong> {deviceInfo.operatingSystem} {deviceInfo.osVersion}</div>
            
            {batteryInfo && (
              <div className="mt-4">
                <div className="flex items-center">
                  <Battery className="mr-2" /> 
                  <span>{batteryInfo.isCharging ? 'Charging' : 'Battery'}: {Math.round(batteryInfo.level * 100)}%</span>
                </div>
                <Progress value={batteryInfo.level * 100} className="mt-2" />
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={handleGetDeviceInfo} 
              className="mt-2"
            >
              Refresh Info
            </Button>
          </div>
        ) : (
          <Button onClick={handleGetDeviceInfo}>Get Device Info</Button>
        )}
      </CardContent>
    </Card>
  );

  const renderMotionSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2" /> Motion Sensors
        </CardTitle>
        <CardDescription>Accelerometer & gyroscope data with shake detection</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleToggleMotion}
          variant={isListening ? "destructive" : "default"}
        >
          {isListening ? "Stop Sensors" : "Start Sensors"}
        </Button>
        
        {isListening && motionData && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium mb-1">Accelerometer</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>X: {motionData.acceleration.x.toFixed(2)}</div>
                <div>Y: {motionData.acceleration.y.toFixed(2)}</div>
                <div>Z: {motionData.acceleration.z.toFixed(2)}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Rotation</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>α: {motionData.rotationRate.alpha.toFixed(2)}°</div>
                <div>β: {motionData.rotationRate.beta.toFixed(2)}°</div>
                <div>γ: {motionData.rotationRate.gamma.toFixed(2)}°</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-medium">Shake Count:</span>
              <span className="text-xl font-bold">{shakeCount}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Show compatibility notice for non-mobile browsers
  if (!isMobile && !isNative) {
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
      
      {renderLocationSection()}
      {renderDeviceInfoSection()}
      {renderMotionSection()}
    </div>
  );
};

export default DeviceFeatures;
