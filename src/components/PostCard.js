import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

const PostCard = ({ post }) => {
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        {post.user && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {post.user.name || post.user.username || "Unknown User"}
            </Text>
            {post.user.email && (
              <Text style={styles.userEmail}>{post.user.email}</Text>
            )}
          </View>
        )}
      </View>
      <Text style={styles.postTitle}>{post.title}</Text>
      <Text style={styles.postBody}>{post.body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: Colors.white,
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
    borderBottomColor: Colors.border,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginRight: 8,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  postBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default PostCard;
