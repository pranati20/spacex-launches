import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LaunchListScreen from "./screens/LaunchList";
import LaunchDetailsScreen from "./screens/LaunchDetails";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons"; 
import SplashScreen from "./screens/SplashScreen"; 
// import * as SplashScreen from "expo-splash-screen";

// Create Stack Navigator
const Stack = createStackNavigator();

// Animation Config for Slide & Rotate
const config = {
  animation: "timing",
  config: {
    duration: 500, 
  },
};

const screenOptions = {
  transitionSpec: {
    open: config,
    close: config,
  },
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      transform: [
        {
          rotateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: ["90deg", "0deg"], // Rotates from 90 degrees to 0
          }),
        },
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 0], // Slides in from the right
          }),
        },
      ],
    },
  }),
};

function BottomTabBar() {
  return (
    <View style={styles.tabBar}>
      {/* Tab Buttons */}
      <View style={styles.tabButton}>
        <Ionicons name="search" size={24} color="white" />
        <Text style={styles.tabText}>Explore</Text>
      </View>
      <View style={styles.tabButton}>
        <Ionicons name="rocket" size={24} color="white" />
        <Text style={styles.tabText}>Launches</Text>
      </View>
      <View style={styles.tabButton}>
        <Ionicons name="star" size={24} color="white" />
        <Text style={styles.tabText}>Favourites</Text>
      </View>
      <View style={styles.tabButton}>
        <Ionicons name="person" size={24} color="white" />
        <Text style={styles.tabText}>Profile</Text>
      </View>
    </View>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Load the font
  const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("./assets/fonts/PoppinsMedium-1JPv.otf"),
    "Poppins-Bold": require("./assets/fonts/PoppinsBold-GdJA.otf"),
    "Stencil": require("./assets/fonts/BigShouldersStencil-VariableFont_opsz,wght.ttf"),
    "Roboto": require("./assets/fonts/RobotoMono-VariableFont_wght.ttf"),



  });

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000); 
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  if (showSplash) {
    return <SplashScreen onAnimationFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, ...screenOptions }}>
        <Stack.Screen name="LaunchList">
          {(props) => (
            <>
              <LaunchListScreen {...props} />
              <BottomTabBar />
            </>
          )}
        </Stack.Screen>
        <Stack.Screen name="LaunchDetails">
          {(props) => (
            <>
              <LaunchDetailsScreen {...props} />
              <BottomTabBar />
            </>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#233947",
    paddingVertical: 8,
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabButton: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 10,
    marginTop: 5,
    fontFamily: "Poppins-Medium",
    color: "white",
  },
});
