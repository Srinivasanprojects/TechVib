import { GRAPHQL_ENDPOINT, GET_POSTS_QUERY } from "../constants/api";

/**
 * Fetch posts from GraphQL API
 */
export const fetchPosts = async () => {
  try {
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
      return result.data.posts.data;
    } else {
      throw new Error("No posts data received");
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
