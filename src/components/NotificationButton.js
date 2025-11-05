import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { Colors } from "../constants/colors";

const NotificationButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Send Test Notification</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 34 : 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NotificationButton;
