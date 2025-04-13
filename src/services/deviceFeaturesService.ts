
import { Geolocation, Position } from '@capacitor/geolocation';
import { Device, DeviceInfo, BatteryInfo } from '@capacitor/device';
import { Motion } from '@capacitor/motion';

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

/**
 * Check if we're running on a native platform (vs browser)
 */
export const isNativePlatform = (): boolean => {
  return (
    document.URL.startsWith('capacitor://') ||
    document.URL.startsWith('http://localhost') ||
    document.URL.startsWith('ionic://') ||
    !!window.Capacitor
  );
};

/**
 * Get the user's current position using Capacitor Geolocation
 */
export const getCurrentPosition = async (): Promise<Position> => {
  try {
    // Request permissions first
    await Geolocation.requestPermissions();
    
    // Get current position
    return await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000
    });
  } catch (err) {
    console.error('Error getting location:', err);
    throw err;
  }
};

/**
 * Get device information
 */
export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  try {
    return await Device.getInfo();
  } catch (err) {
    console.error('Error getting device info:', err);
    throw err;
  }
};

/**
 * Get battery information
 */
export const getBatteryInfo = async (): Promise<BatteryInfo | null> => {
  try {
    return await Device.getBatteryInfo();
  } catch (err) {
    console.error('Error getting battery info:', err);
    return null;
  }
};

// Motion sensor callback function type
type MotionCallback = (event: MotionData) => void;

// Shake detection parameters
const SHAKE_THRESHOLD = 15;
const SHAKE_TIMEOUT = 1000;
let lastShake = 0;

// Detect shake gesture from accelerometer data
export const detectShake = (data: MotionData, onShake: () => void): void => {
  const now = new Date().getTime();
  
  if (now - lastShake < SHAKE_TIMEOUT) {
    return;
  }
  
  const x = data.acceleration.x;
  const y = data.acceleration.y;
  const z = data.acceleration.z;
  
  // Calculate acceleration magnitude
  const acceleration = Math.sqrt(x * x + y * y + z * z);
  
  if (acceleration > SHAKE_THRESHOLD) {
    lastShake = now;
    onShake();
  }
};

/**
 * Start listening to accelerometer updates
 */
export const startAccelerometerUpdates = async (callback: MotionCallback): Promise<boolean> => {
  try {
    await Motion.addListener('accel', callback);
    return true;
  } catch (err) {
    console.error('Error starting accelerometer:', err);
    return false;
  }
};

/**
 * Stop listening to accelerometer updates
 */
export const stopAccelerometerUpdates = async (): Promise<void> => {
  try {
    await Motion.removeAllListeners();
  } catch (err) {
    console.error('Error stopping accelerometer:', err);
  }
};
