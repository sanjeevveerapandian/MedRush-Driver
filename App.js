import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Setting background color for Login screen's header */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerStyle: { backgroundColor: "#f77f82" }, // Sets header background color
            headerTintColor: "#fff", // Sets color of text/icons in the header
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerStyle: { backgroundColor: "#f77f82" }, // Example color for Register
            headerTintColor: "#fff", // Color of the text/icons in the header
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerStyle: { backgroundColor: "#f77f82" }, // Example color for Dashboard
            headerTintColor: "#fff",
          }}
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
