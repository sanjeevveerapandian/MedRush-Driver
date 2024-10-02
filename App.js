import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import LocationScreen from "./screens/LocationScreen";
import DestinationScreen from "./screens/DestinationScreen"; // Import the LocationScreen
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerStyle: { backgroundColor: "#34d1e0" }, // Sets header background color
            headerTintColor: "#fff", // Sets color of text/icons in the header
          }}
        />
        {/* Register Screen */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerStyle: { backgroundColor: "#34d1e0" }, // Example color for Register
            headerTintColor: "#fff", // Color of the text/icons in the header
          }}
        />
        {/* Dashboard Screen */}
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerStyle: { backgroundColor: "#34d1e0" }, // Example color for Dashboard
            headerTintColor: "#fff",
          }}
        />
        {/* Location Screen */}
        <Stack.Screen
          name="LocationScreen"
          component={LocationScreen}
          options={{
            title: "Location Details",
            headerStyle: { backgroundColor: "#34d1e0" }, // Background color for the header
            headerTintColor: "#fff", // Text/icon color in the header
          }}
        />
        <Stack.Screen
          name="DestinationScreen"
          component={DestinationScreen}
          options={{ title: "Nearest Hospital" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
