import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../constants/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOT_SIZE = 60;

const DraggableBot = ({ onPress }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [position, setPosition] = useState({
    x: SCREEN_WIDTH - BOT_SIZE - 20,
    y: SCREEN_HEIGHT - BOT_SIZE - 150,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();

        // Calculate new position with boundaries
        const newX = position.x + gestureState.dx;
        const newY = position.y + gestureState.dy;

        // Keep bot within screen bounds
        const boundedX = Math.max(
          10,
          Math.min(newX, SCREEN_WIDTH - BOT_SIZE - 10)
        );
        const boundedY = Math.max(
          100,
          Math.min(newY, SCREEN_HEIGHT - BOT_SIZE - 150)
        );

        // Update position state
        setPosition({ x: boundedX, y: boundedY });

        // Reset pan values
        pan.setValue({ x: 0, y: 0 });
      },
    })
  ).current;

  const animatedStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }],
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position.x,
          top: position.y,
        },
        animatedStyle,
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.botButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.botCircle}>
          <Text style={styles.botIcon}>🤖</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: BOT_SIZE,
    height: BOT_SIZE,
    zIndex: 1000,
  },
  botButton: {
    width: BOT_SIZE,
    height: BOT_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  botCircle: {
    width: BOT_SIZE,
    height: BOT_SIZE,
    borderRadius: BOT_SIZE / 2,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  botIcon: {
    fontSize: 30,
  },
});

export default DraggableBot;
