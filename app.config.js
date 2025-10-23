import 'dotenv/config';
export default {
  expo: {
    name: 'Lock In',
    slug: 'lock-in',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/lock-in-icon.jpg',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/lock-in-icon.jpg',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/lock-in-icon.jpg',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/lock-in-icon.jpg',
    },
    plugins: ['expo-router'],
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
    },
    owner: 'guan-eric',
    experiments: {
      typedRoutes: true,
    },
  },
};
