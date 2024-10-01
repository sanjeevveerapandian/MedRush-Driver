import { useEffect, useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import auth from "../services/firebaseAuth";
import { LinearGradient } from "expo-linear-gradient"; // For gradient background
import { MaterialIcons } from "@expo/vector-icons"; // For password visibility icon

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const checkIfLoggedIn = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Dashboard");
      }
    });
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const handleLogin = () => {
    setError("");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate("Dashboard");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <LinearGradient colors={["#f77f82", "#f0c2b2"]} style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🚑 MEDRUSH</Text>
      </View>

      <Text style={styles.title}>LOGIN NOW</Text>

      {/* Google login placeholder */}
      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>or login with Email</Text>

      {/* Email input */}
      <TextInput
        onChangeText={setEmail}
        placeholder="Enter your email id"
        style={styles.textInput}
        value={email}
      />

      {/* Password input */}
      <View style={styles.passwordContainer}>
        <TextInput
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!passwordVisible}
          style={styles.textInput}
          value={password}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <MaterialIcons
            name={passwordVisible ? "visibility" : "visibility-off"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Error message */}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {/* Remember me and forgot password */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity>
          <Text>Remember Me</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login button */}
      <Button title="Login" onPress={handleLogin} />

      {/* Navigate to Register */}
      <Text onPress={goToRegister} style={{ marginVertical: 10 }}>
        Create an account? Register here
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#E0E0E0",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  googleButtonText: {
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    marginVertical: 20,
  },
  textInput: {
    backgroundColor: "#F0C2B2",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: "gray",
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0C2B2",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: "gray",
    borderWidth: 1,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  forgotPassword: {
    color: "#f77f82",
  },
});
