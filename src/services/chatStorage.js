import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAT_STORAGE_KEY = "@techvib_chat_history";

/**
 * Save conversation history to AsyncStorage
 */
export const saveChatHistory = async (messages) => {
  try {
    await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};

/**
 * Load conversation history from AsyncStorage
 */
export const loadChatHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error loading chat history:", error);
    return [];
  }
};

/**
 * Clear conversation history
 */
export const clearChatHistory = async () => {
  try {
    await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing chat history:", error);
  }
};
