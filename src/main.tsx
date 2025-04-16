
import { createRoot } from 'react-dom/client';
import MobileApp from './MobileApp';
import './index.css';

// Check if running in a Capacitor environment
const isCapacitorPlatform = 
  document.URL.startsWith('capacitor://') || 
  document.URL.startsWith('ionic://') || 
  (typeof window !== 'undefined' && window.Capacitor !== undefined);

// Load app with appropriate entry point
createRoot(document.getElementById('root')!).render(<MobileApp />);
