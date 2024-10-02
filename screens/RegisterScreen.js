import { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient"; // Gradient background
import { MaterialIcons } from "@expo/vector-icons"; // Icon for password visibility
import auth from "../services/firebaseAuth";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hidePassword, setHidePassword] = useState(true); // Password visibility

  const handleRegister = () => {
    setError("");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate("Dashboard");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <LinearGradient colors={["#34d1e0", "#a3e0e3"]} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Register Now</Text>

        {/* Email Input */}
        <TextInput
          onChangeText={setEmail}
          placeholder="Enter your email id"
          style={styles.textInput}
          placeholderTextColor="#000"
          value={email}
        />

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={hidePassword}
            style={[styles.textInput, { flex: 1 }]}
            placeholderTextColor="#000"
            value={password}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialIcons
              name={hidePassword ? "visibility-off" : "visibility"}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && <Text style={styles.error}>{error}</Text>}

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>

        {/* Navigate to Login */}
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.loginText}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#004d66", // Darker blue color for the title
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#004d66", // Darker blue color
    color: "#000",
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#004d66", // Darker blue color
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#008080", // Teal blue color for the button
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  loginText: {
    color: "#004d66", // Darker blue color
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
