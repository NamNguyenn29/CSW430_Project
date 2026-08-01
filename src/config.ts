import { Platform } from 'react-native';

// Maps localhost to 10.0.2.2 for Android emulators, and http://localhost:8080 for iOS/web
export const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export const OAUTH2_CALLBACK_URL = 'http://localhost:5500/oauth2/callback';
