import { GEMINI_API_KEY, GEMINI_API_URL } from "../constants/gemini";

/**
 * Send a message to Gemini API and get response
 */
export const sendMessageToGemini = async (
  message,
  conversationHistory = []
) => {
  try {
    // Build the conversation context
    const contents = [
      ...conversationHistory.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || "Failed to get response from Gemini"
      );
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    return replyText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
