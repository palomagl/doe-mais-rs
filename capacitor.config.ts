import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.45183b81e52d4edc97961aa9799b0e38',
  appName: 'Doe+ RS',
  webDir: 'dist',
  // Hot-reload from Lovable sandbox. REMOVE this `server` block before
  // building the final Android release APK/AAB, so the app runs from `dist`.
  server: {
    url: 'https://45183b81-e52d-4edc-9796-1aa9799b0e38.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  android: {
    backgroundColor: '#e02020',
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: '#e02020',
      androidSplashResourceName: 'splash',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#e02020',
      overlaysWebView: false,
    },
  },
};

export default config;
