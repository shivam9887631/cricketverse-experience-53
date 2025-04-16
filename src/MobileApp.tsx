
import React, { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { hideSplashScreen } from './services/splashScreenService';
import App from './App';

const MobileApp: React.FC = () => {
  useEffect(() => {
    // Initialize Capacitor plugins and set up event listeners
    const initializeApp = async () => {
      try {
        // Set status bar style
        if (window.Capacitor?.isPluginAvailable('StatusBar')) {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: '#FFFFFF' });
        }

        // Hide splash screen with a slight delay to ensure app is ready
        setTimeout(() => {
          hideSplashScreen();
        }, 500);
        
        // Set up app state change listeners
        CapApp.addListener('appStateChange', ({ isActive }) => {
          console.log('App state changed. Is active?', isActive);
        });
        
        // Set up back button handling
        CapApp.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            CapApp.exitApp();
          }
        });
      } catch (err) {
        console.error('Error initializing mobile app:', err);
      }
    };

    initializeApp();
    
    // Clean up listeners
    return () => {
      CapApp.removeAllListeners();
    };
  }, []);

  // Render the main App component
  return <App />;
};

export default MobileApp;
