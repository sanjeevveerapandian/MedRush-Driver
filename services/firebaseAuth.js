// Import the necessary Firebase SDK functions
import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMcyLhKE6XrppBhyB7LssyWZ77g6v5QHk",
  authDomain: "medrush-e34ac.firebaseapp.com",
  databaseURL:
    "https://medrush-e34ac-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "medrush-e34ac",
  storageBucket: "medrush-e34ac.appspot.com",
  messagingSenderId: "862532060031",
  appId: "1:862532060031:web:b43437c83c6c5e0211d04a",
  measurementId: "G-13VXDLJTRY",
};

// Initialize Firebase app and Firestore
let auth;
let db;
if (getApps().length === 0) {
  const app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// Export both auth and db
export { auth, db };
