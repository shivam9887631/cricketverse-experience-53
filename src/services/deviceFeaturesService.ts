
import { Geolocation, Position } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import { Motion } from '@capacitor/motion';
import { Capacitor } from '@capacitor/core';

// Check if the app is running on a native platform
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

// GPS / Location Services
export const getCurrentPosition = async (): Promise<Position | null> => {
  try {
    if (!isNativePlatform()) {
      console.log('Geolocation works best on a native device');
      // Browser fallback if available
      if ('geolocation' in navigator) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  altitudeAccuracy: position.coords.altitudeAccuracy,
                  altitude: position.coords.altitude,
                  speed: position.coords.speed,
                  heading: position.coords.heading,
                },
                timestamp: position.timestamp,
              });
            },
            (error) => {
              console.error('Browser geolocation error:', error);
              reject(error);
            }
          );
        });
      }
      return null;
    }
    
    // Request permissions first
    const permissions = await Geolocation.requestPermissions();
    if (permissions.location === 'granted') {
      return await Geolocation.getCurrentPosition();
    } else {
      console.error('Location permission not granted');
      return null;
    }
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Device Information
export const getDeviceInfo = async () => {
  try {
    return await Device.getInfo();
  } catch (error) {
    console.error('Error getting device info:', error);
    return null;
  }
};

export const getBatteryInfo = async () => {
  try {
    return await Device.getBatteryInfo();
  } catch (error) {
    console.error('Error getting battery info:', error);
    return null;
  }
};

// Motion Sensors (Accelerometer & Gyroscope)
export interface MotionData {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  accelerationIncludingGravity: {
    x: number;
    y: number;
    z: number;
  };
  rotationRate: {
    alpha: number;
    beta: number;
    gamma: number;
  };
  interval: number;
}

let motionListener: any = null;

export const startAccelerometerUpdates = async (callback: (data: MotionData) => void): Promise<boolean> => {
  try {
    if (!isNativePlatform()) {
      console.log('Motion sensors work best on a native device');
      // Browser fallback if available
      if ('DeviceMotionEvent' in window) {
        window.addEventListener('devicemotion', (event: any) => {
          const motionData: MotionData = {
            acceleration: {
              x: event.acceleration?.x || 0,
              y: event.acceleration?.y || 0,
              z: event.acceleration?.z || 0,
            },
            accelerationIncludingGravity: {
              x: event.accelerationIncludingGravity?.x || 0,
              y: event.accelerationIncludingGravity?.y || 0,
              z: event.accelerationIncludingGravity?.z || 0,
            },
            rotationRate: {
              alpha: event.rotationRate?.alpha || 0,
              beta: event.rotationRate?.beta || 0, 
              gamma: event.rotationRate?.gamma || 0,
            },
            interval: event.interval || 0,
          };
          callback(motionData);
        });
        return true;
      }
      return false;
    }
    
    // On native devices
    const permissionState = await Motion.requestPermissions();
    if (permissionState.accel === 'granted') {
      // Start listening for motion events
      motionListener = await Motion.addListener('accel', (data) => {
        callback(data as MotionData);
      });
      return true;
    } else {
      console.error('Motion permission not granted');
      return false;
    }
  } catch (error) {
    console.error('Error starting accelerometer:', error);
    return false;
  }
};

export const stopAccelerometerUpdates = async (): Promise<void> => {
  try {
    if (!isNativePlatform()) {
      // Remove browser event listener
      window.removeEventListener('devicemotion', () => {});
      return;
    }
    
    // Remove the listener on native devices
    if (motionListener) {
      motionListener.remove();
      motionListener = null;
    }
  } catch (error) {
    console.error('Error stopping accelerometer:', error);
  }
};

// Shake detection using accelerometer data
let lastX = 0, lastY = 0, lastZ = 0;
let lastUpdate = 0;
const SHAKE_THRESHOLD = 800; // Adjust based on sensitivity needed

export const detectShake = (data: MotionData, onShake: () => void): void => {
  const now = Date.now();
  if ((now - lastUpdate) > 100) { // Only process every 100ms
    const deltaTime = now - lastUpdate;
    lastUpdate = now;
    
    const acceleration = data.accelerationIncludingGravity;
    const x = acceleration.x;
    const y = acceleration.y;
    const z = acceleration.z;
    
    const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / deltaTime * 10000;
    
    if (speed > SHAKE_THRESHOLD) {
      onShake();
    }
    
    lastX = x;
    lastY = y;
    lastZ = z;
  }
};
