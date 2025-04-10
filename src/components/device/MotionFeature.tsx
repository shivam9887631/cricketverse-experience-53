
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  startAccelerometerUpdates,
  stopAccelerometerUpdates,
  MotionData,
  detectShake
} from '@/services/deviceFeaturesService';
import { testId, TEST_IDS } from '@/utils/testUtils';

const MotionFeature = () => {
  const [motionData, setMotionData] = useState<MotionData | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup function to stop sensors when component unmounts
    return () => {
      if (isListening) {
        stopAccelerometerUpdates();
      }
    };
  }, [isListening]);

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
        throw new Error("Could not access motion sensors. Make sure permissions are granted.");
      }
    }
  };

  return (
    <Card {...testId(TEST_IDS.MOTION_FEATURE_CARD)}>
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
          {...testId(TEST_IDS.TOGGLE_MOTION_BUTTON)}
        >
          {isListening ? "Stop Sensors" : "Start Sensors"}
        </Button>
        
        {isListening && motionData && (
          <div className="mt-4 space-y-4" {...testId(TEST_IDS.MOTION_DATA_DISPLAY)}>
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
              <span className="text-xl font-bold" {...testId(TEST_IDS.SHAKE_COUNT)}>{shakeCount}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MotionFeature;
