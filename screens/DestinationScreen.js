import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import axios from "axios";
import * as Animatable from "react-native-animatable"; // Import react-native-animatable

const GOOGLE_MAPS_API_KEY = "AIzaSyDbGjgmXj-yRCDJJKK4_LI8dMuWF8G806k";
const FIREBASE_URL =
  "https://medrush-e34ac-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json";

export default function DestinationScreen() {
  const [patientLocation, setPatientLocation] = useState(null);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hospitalType, setHospitalType] = useState("government"); // Default to 'government'
  const [reached, setReached] = useState(false); // State to handle reached status

  useEffect(() => {
    const fetchPatientLocation = async () => {
      try {
        const response = await axios.get(FIREBASE_URL);
        if (response.data) {
          const posts = Object.values(response.data);
          const lastPost = posts[posts.length - 1];

          if (lastPost && lastPost.body && lastPost.hospitalType) {
            const latLngMatches = lastPost.body.match(
              /Latitude:\s*([0-9.-]+),\s*Longitude:\s*([0-9.-]+)/
            );

            if (latLngMatches && latLngMatches.length === 3) {
              const latitude = parseFloat(latLngMatches[1]);
              const longitude = parseFloat(latLngMatches[2]);
              setPatientLocation({ latitude, longitude });

              const typeFromBackend = lastPost.hospitalType
                .toLowerCase()
                .includes("private")
                ? "private"
                : "government";
              setHospitalType(typeFromBackend);

              fetchNearestHospital({ latitude, longitude }, typeFromBackend);
            } else {
              Alert.alert("Error", "Failed to extract coordinates from data.");
              setLoading(false);
            }
          } else {
            Alert.alert(
              "Error",
              "Patient location or hospital type data is not available."
            );
            setLoading(false);
          }
        } else {
          Alert.alert("Error", "No data available in the database.");
          setLoading(false);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch patient location from Firebase.");
        setLoading(false);
      }
    };

    const fetchNearestHospital = async (location, type) => {
      try {
        const keyword = type === "government" ? "government" : "private";
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=5000&type=hospital&keyword=${keyword}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.results && response.data.results.length > 0) {
          setNearestHospital(response.data.results[0]);
        } else {
          Alert.alert("Error", `No ${type} hospitals found nearby.`);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch nearby hospitals.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientLocation();
  }, []);

  const openInGoogleMaps = () => {
    if (patientLocation && nearestHospital) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${patientLocation.latitude},${patientLocation.longitude}&destination=${nearestHospital.geometry.location.lat},${nearestHospital.geometry.location.lng}&travelmode=driving`;
      Linking.openURL(url).catch(() => {
        Alert.alert("Error", "Failed to open Google Maps.");
      });
    }
  };

  const handleReached = () => {
    setReached(true); // Set the state to show the emoji splash
    setTimeout(() => {
      Alert.alert("Congrats!", "You have saved a life 🎉");
      setReached(false); // Reset the reached state
    }, 3000); // Reset after 3 seconds
  };

  if (loading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="#34d1e0" />
        <Text style={styles.loadingText}>Finding the nearest hospital...</Text>
      </View>
    );
  }

  if (!patientLocation || !nearestHospital) {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorText}>Unable to load location data.</Text>
      </View>
    );
  }

  const hospitalLocation = {
    latitude: nearestHospital.geometry.location.lat,
    longitude: nearestHospital.geometry.location.lng,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: patientLocation.latitude,
          longitude: patientLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={patientLocation}
          title="Patient Location"
          pinColor="#008080"
        />
        <Marker
          coordinate={hospitalLocation}
          title={nearestHospital.name}
          description={nearestHospital.vicinity}
          pinColor="#ff6347"
        />
        <MapViewDirections
          origin={patientLocation}
          destination={hospitalLocation}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={4}
          strokeColor="#008080"
          onError={(errorMessage) => {
            Alert.alert("Error", errorMessage);
          }}
        />
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Nearest {hospitalType.charAt(0).toUpperCase() + hospitalType.slice(1)}{" "}
          Hospital:
        </Text>
        <Text style={styles.locationText}>{nearestHospital.name}</Text>
        <Text style={styles.locationText}>{nearestHospital.vicinity}</Text>
      </View>

      <TouchableOpacity
        style={styles.openMapsButton}
        onPress={openInGoogleMaps}
      >
        <Text style={styles.buttonText}>Open in Google Maps</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.reachedButton} onPress={handleReached}>
        <Text style={styles.buttonText}>Reached</Text>
      </TouchableOpacity>

      {reached && (
        <Animatable.Text
          animation="bounceIn"
          iterationCount={3}
          style={styles.emojiText}
        >
          🎉
        </Animatable.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "60%",
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#34d1e0",
    fontWeight: "bold",
  },
  infoContainer: {
    margin: 8,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#008080",
  },
  locationText: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  openMapsButton: {
    backgroundColor: "#34d1e0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 5,
    marginBottom: 10,
  },
  reachedButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 20,
    elevation: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emojiText: {
    fontSize: 50,
    textAlign: "center",
    position: "absolute",
    bottom: 120, // Adjust this value to control the emoji's position
    width: "100%",
  },
});
