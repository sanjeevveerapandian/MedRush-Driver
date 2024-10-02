import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const GOOGLE_MAPS_API_KEY = "AIzaSyDbGjgmXj-yRCDJJKK4_LI8dMuWF8G806k"; // Your Google Maps API Key
const FIREBASE_URL =
  "https://medrush-e34ac-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json";

export default function LocationScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Get driver's current location using GPS
    const getCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location permission is required.");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        Alert.alert("Error", "Failed to get your current location.");
      }
    };

    // Fetch destination location from Firebase
    const fetchDestinationLocation = async () => {
      try {
        const response = await axios.get(FIREBASE_URL);
        if (response.data) {
          const posts = Object.values(response.data); // Convert to array
          const lastPost = posts[posts.length - 1]; // Get the last entry

          if (lastPost && lastPost.body) {
            // Extract latitude and longitude from the post body
            const latLngMatches = lastPost.body.match(
              /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/
            );

            if (latLngMatches && latLngMatches.length === 3) {
              const latitude = parseFloat(latLngMatches[1]);
              const longitude = parseFloat(latLngMatches[2]);
              setDestinationLocation({ latitude, longitude });
            } else {
              Alert.alert("Error", "Failed to extract coordinates from data.");
            }
          } else {
            Alert.alert("Error", "Destination location data is not available.");
          }
        } else {
          Alert.alert("Error", "No data available in the database.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch destination data from Firebase.");
      } finally {
        setLoading(false);
      }
    };

    getCurrentLocation();
    fetchDestinationLocation();
  }, []);

  // Function to navigate to the DestinationScreen
  const handleReachedLocation = () => {
    if (currentLocation) {
      navigation.navigate("DestinationScreen", { currentLocation });
    }
  };

  // Function to open Google Maps with the route
  const openGoogleMaps = () => {
    if (currentLocation && destinationLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${destinationLocation.latitude},${destinationLocation.longitude}&travelmode=driving`;

      Linking.openURL(url).catch(() =>
        Alert.alert("Error", "Failed to open Google Maps")
      );
    } else {
      Alert.alert("Error", "Current or destination location is not available.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#34d1e0" />
        <Text style={styles.loadingText}>Loading location data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentLocation && destinationLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Driver's Current Location Marker */}
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            pinColor="#34d1e0"
          />

          {/* Destination Location Marker */}
          <Marker
            coordinate={destinationLocation}
            title="Destination"
            pinColor="#ff6347"
          />

          {/* Route Directions */}
          <MapViewDirections
            origin={currentLocation}
            destination={destinationLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="#34d1e0"
            onError={(errorMessage) => {
              Alert.alert("Error", errorMessage);
            }}
          />
        </MapView>
      ) : (
        <Text style={styles.infoText}>Unable to load map data.</Text>
      )}

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleReachedLocation}>
          <Text style={styles.buttonText}>Reached the Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline} onPress={openGoogleMaps}>
          <Text style={styles.buttonTextOutline}>Open in Google Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Slightly lighter background
  },
  map: {
    width: "100%",
    height: "83%", // Adjust the height to leave space for the buttons
    borderRadius: 20, // Adds rounded corners
    overflow: "hidden",
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10, // Adds shadow on Android
  },
  button: {
    backgroundColor: "#34d1e0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderColor: "#34d1e0",
    borderWidth: 2,
  },
  buttonTextOutline: {
    color: "#34d1e0",
    fontWeight: "bold",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#34d1e0",
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#333",
  },
});
