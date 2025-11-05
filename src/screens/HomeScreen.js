import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  Alert,
  RefreshControl,
} from "react-native";
import * as Notifications from "expo-notifications";

import { fetchPosts } from "../services/api";
import {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  scheduleLocalNotification,
} from "../services/notificationService";
import PostCard from "../components/PostCard";
import EmptyState from "../components/EmptyState";
import NotificationButton from "../components/NotificationButton";
import DraggableBot from "../components/DraggableBot";
import ChatModal from "../components/ChatModal";
import { Colors } from "../constants/colors";

const HomeScreen = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Fetch posts from GraphQL API
  const loadPosts = async () => {
    try {
      setError(null);
      const postsData = await fetchPosts();
      setPosts(postsData);
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  useEffect(() => {
    // Fetch posts on mount
    loadPosts();

    // Register for push notifications
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // Listen for notifications received while app is in foreground
    notificationListener.current = addNotificationReceivedListener(
      (notification) => {
        const notificationData = {
          id: notification.request.identifier,
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data,
          timestamp: new Date().toISOString(),
        };
        setNotifications((prev) => [notificationData, ...prev]);
      }
    );

    // Listen for when user taps on a notification
    responseListener.current = addNotificationResponseReceivedListener(
      (response) => {
        const notificationData = {
          id: response.notification.request.identifier,
          title: response.notification.request.content.title,
          body: response.notification.request.content.body,
          data: response.notification.request.content.data,
          timestamp: new Date().toISOString(),
          tapped: true,
        };
        setNotifications((prev) => [notificationData, ...prev]);
        Alert.alert(
          "Notification Tapped",
          `Title: ${response.notification.request.content.title}\nBody: ${response.notification.request.content.body}`
        );
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const handleSendTestNotification = async () => {
    await scheduleLocalNotification(
      "Test Notification",
      "This is a test notification from your app!",
      { testData: "Hello from FCM!" }
    );
  };

  // Render individual post item
  const renderPostItem = ({ item }) => <PostCard post={item} />;

  // Render empty state
  const renderEmptyState = () => (
    <EmptyState
      loading={loading}
      error={error}
      onRetry={() => {
        setLoading(true);
        loadPosts();
      }}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>TechVib Posts</Text>
        <Text style={styles.subtitle}>User Posts Feed</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          posts.length === 0
            ? styles.flatListContentEmpty
            : styles.flatListContent
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={true}
      />

      <NotificationButton onPress={handleSendTestNotification} />

      <DraggableBot onPress={() => setChatModalVisible(true)} />
      <ChatModal
        visible={chatModalVisible}
        onClose={() => setChatModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  flatListContent: {
    padding: 16,
    paddingBottom: 100,
  },
  flatListContentEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
