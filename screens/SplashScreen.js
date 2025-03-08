import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const SplashScreen = ({ onAnimationFinish }) => {
  useEffect(() => {
    setTimeout(() => {
      onAnimationFinish(); // Fallback to navigate after animation
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/rocket.json")}
        autoPlay
        loop={false}
        onAnimationFinish={onAnimationFinish}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Match your theme
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: width,
    height: height,
  },
});

export default SplashScreen;
