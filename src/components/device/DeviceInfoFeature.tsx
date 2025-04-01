
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Battery, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getDeviceInfo, getBatteryInfo } from '@/services/deviceFeaturesService';

const DeviceInfoFeature = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [batteryInfo, setBatteryInfo] = useState<{ level: number; isCharging: boolean } | null>(null);
  const { toast } = useToast();

  const handleGetDeviceInfo = async () => {
    try {
      const info = await getDeviceInfo();
      setDeviceInfo(info);
      
      const battery = await getBatteryInfo();
      if (battery) {
        setBatteryInfo({
          level: battery.batteryLevel,
          isCharging: battery.isCharging
        });
      }
      
      toast({
        title: "Device Info Retrieved",
        description: `${info?.manufacturer || 'Unknown'} ${info?.model || 'Device'}`
      });
    } catch (err) {
      console.error('Device info error:', err);
      throw err;
    }
  };

  return (
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
};

export default DeviceInfoFeature;
