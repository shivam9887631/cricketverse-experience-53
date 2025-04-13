
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Service to handle splash screen operations for the mobile app
 */
export const hideSplashScreen = async (): Promise<void> => {
  try {
    await SplashScreen.hide();
  } catch (err) {
    console.error('Error hiding splash screen:', err);
  }
};

export const showSplashScreen = async (): Promise<void> => {
  try {
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true
    });
  } catch (err) {
    console.error('Error showing splash screen:', err);
  }
};
