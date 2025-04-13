
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.04aae878a9224ddd929dad380c1154d8',
  appName: 'CricketVerse',
  webDir: 'dist',
  server: {
    url: 'https://04aae878-a922-4ddd-929d-ad380c1154d8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
    },
    backgroundColor: "#FFFFFF",
    contentInset: "scrollable",
    allowMixedContent: true,
    captureInput: true,
    webViewLogging: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      splashFullScreen: true,
      splashImmersive: true
    },
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
