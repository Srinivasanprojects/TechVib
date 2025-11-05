import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotificationsAsync,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  scheduleLocalNotification,
} from "./notificationService";

const GRAPHQL_ENDPOINT = "https://graphqlzero.almansi.me/api";

// GraphQL query to fetch posts
const GET_POSTS_QUERY = `
  query {
    posts {
      data {
        id
        title
        body
        user {
          id
          name
          username
          email
        }
      }
    }
  }
`;

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Fetch posts from GraphQL API
  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: GET_POSTS_QUERY,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0]?.message || "Failed to fetch posts");
      }

      if (result.data?.posts?.data) {
        setPosts(result.data.posts.data);
      } else {
        throw new Error("No posts data received");
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  useEffect(() => {
    // Fetch posts on mount
    fetchPosts();

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
  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        {item.user && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {item.user.name || item.user.username || "Unknown User"}
            </Text>
            {item.user.email && (
              <Text style={styles.userEmail}>{item.user.email}</Text>
            )}
          </View>
        )}
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.emptyText}>Loading posts...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              fetchPosts();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No posts available</Text>
      </View>
    );
  };

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

      <TouchableOpacity
        style={styles.button}
        onPress={handleSendTestNotification}
      >
        <Text style={styles.buttonText}>Send Test Notification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    backgroundColor: "#6200ee",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#ffffff",
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
  postCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6200ee",
    marginRight: 8,
  },
  userEmail: {
    fontSize: 12,
    color: "#999",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  postBody: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 16,
  },
  errorText: {
    textAlign: "center",
    color: "#d32f2f",
    fontSize: 14,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#6200ee",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#6200ee",
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 34 : 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
