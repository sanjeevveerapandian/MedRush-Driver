import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const hospitalOptions = ["Government Hospitals", "Private Hospitals"];

export default function DashboardScreen() {
  const [region, setRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(
    "Select Hospital Type"
  );
  const [locationPermission, setLocationPermission] = useState(false);
  const [places, setPlaces] = useState([]); // State to hold nearby places

  const GOOGLE_MAPS_API_KEY = "AIzaSyDGnitSNb0QQ1VyRV7fdBJeCbI-owV28ko"; // Replace with your actual Google Maps API key

  // Function to get location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access location was denied."
      );
      return;
    }
    setLocationPermission(true);
    const location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleSearch = (data, details = null) => {
    // Extract the location from the place details
    const { lat, lng } = details.geometry.location;
    // Update map region to the selected place
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    // Fetch places nearby using Places API
    fetchNearbyPlaces(lat, lng);
  };

  // Function to fetch nearby places based on search location
  const fetchNearbyPlaces = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=hospital&key=${GOOGLE_MAPS_API_KEY}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      setPlaces(result.results); // Update places state with nearby hospitals
    } catch (error) {
      console.error("Error fetching nearby places:", error);
    }
  };

  useEffect(() => {
    getLocation(); // Get user's location when component mounts
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MEDRUSH</Text>
      </View>

      {/* Google Places Autocomplete Search */}
      <GooglePlacesAutocomplete
        placeholder="Search for nearby hospitals"
        minLength={2}
        returnKeyType={"search"}
        fetchDetails={true}
        onPress={handleSearch}
        query={{
          key: GOOGLE_MAPS_API_KEY,
          language: "en",
          types: "hospital", // You can specify the type of places to search for
        }}
        styles={{
          textInput: styles.searchInput,
        }}
      />

      {/* Hospital Selector */}
      <View style={styles.hospitalContainer}>
        <TouchableOpacity
          style={styles.hospitalButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.hospitalText}>{selectedHospital}</Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Hospital Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={hospitalOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.hospitalItem}
                  onPress={() => {
                    setSelectedHospital(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.hospitalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Google Maps View */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {/* User's current location marker */}
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />

        {/* Markers for nearby places */}
        {places.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.name}
          />
        ))}
      </MapView>

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomNav}>
        <MaterialIcons name="home" size={30} color="#000" />
        <MaterialIcons name="person" size={30} color="#000" />
        <MaterialIcons name="chat" size={30} color="#000" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0c2b2",
  },
  header: {
    backgroundColor: "#f77f82",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: "#000",
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginHorizontal: 10,
  },
  hospitalContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  hospitalButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  hospitalText: {
    marginRight: 5,
    color: "#000",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  hospitalItem: {
    padding: 15,
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  hospitalItemText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f77f82",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  map: {
    flex: 1,
    width: "100%",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
});
