import { useEffect, useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseAuth";
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
    <LinearGradient colors={["#34d1e0", "#a3e0e3"]} style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🚑 MEDRUSH</Text>
      </View>

      <Text style={styles.title}>LOGIN NOW</Text>

      {/* Google login button with logo */}
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
          }}
          style={{ width: 20, height: 20 }}
        />
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
          style={styles.textInputInner}
          value={password}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <MaterialIcons
            name={passwordVisible ? "visibility" : "visibility-off"}
            size={28} // Adjusted size
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Error message */}
      {error && (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      )}

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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Navigate to Register */}
      <Text
        onPress={goToRegister}
        style={{ marginVertical: 10, textAlign: "center" }}
      >
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
    fontSize: 26, // Adjusted for larger text
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#795548", // Slightly brownish color to match the image
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 20,
  },
  googleButtonText: {
    fontSize: 16,
    marginLeft: 10, // Add spacing for the Google logo
  },
  orText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#6B6B6B",
  },
  textInput: {
    backgroundColor: "#E0F7FA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: "gray",
    borderWidth: 1,
    elevation: 2,
  },
  textInputInner: {
    flex: 1,
    backgroundColor: "transparent",
  },
  passwordContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E0F7FA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: "gray",
    borderWidth: 1,
    elevation: 2,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  forgotPassword: {
    color: "#f77f82",
  },
  loginButton: {
    backgroundColor: "#008080", // Teal color similar to the image
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
