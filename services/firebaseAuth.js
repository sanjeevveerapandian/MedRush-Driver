// Import the functions you need from the SDKs you need
import { initializeApp, getApps} from "firebase/app";
import {initializeAuth, getReactNativePersistence, getAuth} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxtspiBUhEMGPB2rTQ14H2tHfslVJBjXs",
  authDomain: "react-native-auth-demo-36c56.firebaseapp.com",
  projectId: "react-native-auth-demo-36c56",
  storageBucket: "react-native-auth-demo-36c56.appspot.com",
  messagingSenderId: "612753746622",
  appId: "1:612753746622:web:dd86519fc60ef1da79ccef"
};
let auth;
if (getApps().length == 0) {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    })
}else {
    auth = getAuth();
}


export default auth;
