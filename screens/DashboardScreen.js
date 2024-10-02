import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // Import axios

export default function DashboardScreen() {
  const [serviceStatus, setServiceStatus] = useState(""); // To track if the driver has accepted or rejected
  const navigation = useNavigation(); // Access the navigation object

  // Firebase endpoint URL to store the driver's acceptance status
  const FIREBASE_URL =
    "https://driver-cfd31-default-rtdb.asia-southeast1.firebasedatabase.app/bookings.json";

  // Function to update the acceptance status in Firebase
  const updateAcceptanceStatus = async (status) => {
    try {
      const response = await axios.post(FIREBASE_URL, {
        driverId: "driver123", // Replace with actual driver ID
        bookingId: "booking456", // Replace with actual booking ID
        status: status,
        timestamp: Date.now(), // Optional: timestamp of the action
      });
      console.log("Response from Firebase:", response.data);
    } catch (error) {
      console.error("Error updating Firebase:", error);
      Alert.alert("Error", "Failed to update the status in Firebase.");
    }
  };

  const handleAccept = () => {
    setServiceStatus("accepted");
    updateAcceptanceStatus("accepted"); // Store status in Firebase
    // Navigate to the next screen (e.g., LocationScreen)
    navigation.navigate("LocationScreen"); // Ensure that you have this screen added in your navigator
  };

  const handleReject = () => {
    setServiceStatus("rejected");
    // Show a rejection message and reload the screen
    Alert.alert(
      "Service Rejected",
      "You have rejected the request. The screen will reload.",
      [{ text: "OK", onPress: () => setServiceStatus("") }] // Reset the status to reload the screen
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.titleText}>Help Request</Text>
        <Text style={styles.messageText}>
          A person is seeking your assistance. Would you like to accept or
          reject this request?
        </Text>
      </View>

      {/* Accept and Reject Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={handleAccept}
          disabled={serviceStatus === "accepted"}
        >
          <Text style={styles.buttonText}>
            {serviceStatus === "accepted" ? "Accepted" : "Accept"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={handleReject}
          disabled={serviceStatus === "rejected"}
        >
          <Text style={styles.buttonText}>
            {serviceStatus === "rejected" ? "Rejected" : "Reject"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#e0f7fa", // Light blue background
  },
  messageContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 30,
    width: "90%",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#008080", // Teal color
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    width: "45%",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4caf50", // Green for accept
  },
  rejectButton: {
    backgroundColor: "#f44336", // Red for reject
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
