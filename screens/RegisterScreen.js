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
    <LinearGradient colors={["#f77f82", "#f0c2b2"]} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Register Now</Text>

        {/* Email Input */}
        <TextInput
          onChangeText={setEmail}
          placeholder="Enter your email id"
          style={styles.textInput}
          placeholderTextColor="#fff"
        />

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={hidePassword}
            style={[styles.textInput, { flex: 1 }]}
            placeholderTextColor="#fff"
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <MaterialIcons
              name={hidePassword ? "visibility-off" : "visibility"}
              size={24}
              color="#fff"
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    color: "#fff",
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#ff7f50",
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
    color: "#fff",
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
