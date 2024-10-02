import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOWWziKbukqcKywzUILVVINkoVIIVvYxg",
  authDomain: "driver-cfd31.firebaseapp.com",
  projectId: "driver-cfd31",
  storageBucket: "driver-cfd31.appspot.com",
  messagingSenderId: "1029882714542",
  appId: "1:1029882714542:web:0685026e84c0072ed7903f",
  measurementId: "G-KSJHE2PZTN",
  databaseURL:
    "https://driver-cfd31-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to update driver's acceptance status
export const updateDriverStatus = (bookingId, driverId, isAccepted) => {
  const statusRef = ref(database, `bookings/${bookingId}/drivers/${driverId}`);

  set(statusRef, {
    accepted: isAccepted,
    timestamp: Date.now(), // Optional: to record when the status was updated
  })
    .then(() => {
      console.log("Driver's acceptance status updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating acceptance status:", error);
    });
};
