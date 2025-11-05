# TechVib - Social Media App with AI Chat Assistant

A React Native social media application built with Expo that displays user posts from a GraphQL API and features an AI-powered chat assistant using Google's Gemini API.

## 📱 Features

- ✅ **User Posts Feed**: Displays posts from GraphQL API (GraphQLZero) in a scrollable FlatList
- ✅ **Push Notifications**: Expo notifications with FCM integration
- ✅ **Draggable AI Chat Bot**: Interactive circular bot that can be dragged around the screen
- ✅ **AI Chat Assistant**: Chat interface powered by Google Gemini API
- ✅ **Conversation Persistence**: Chat history saved and restored using AsyncStorage
- ✅ **Pull to Refresh**: Refresh posts feed by pulling down
- ✅ **Modern UI**: Clean, card-based design with smooth animations

## 📦 Package Dependencies & Functions

### Core Dependencies

| Package | Version | Purpose | Key Functions |
|---------|---------|---------|---------------|
| `expo` | ~54.0.22 | Expo framework | React Native app development |
| `react-native` | 0.81.5 | React Native core | Native UI components |
| `react` | 19.1.0 | React library | UI component framework |
| `expo-notifications` | ~0.32.12 | Push notifications | `registerForPushNotificationsAsync()`, `scheduleLocalNotification()` |
| `@react-native-async-storage/async-storage` | ^2.2.0 | Local storage | `getItem()`, `setItem()`, `removeItem()` - Persist chat history |
| `react-native-gesture-handler` | ^2.29.1 | Gesture handling | `PanResponder` - Enable drag functionality for bot |
| `expo-dev-client` | ~6.0.17 | Development client | Custom native builds for FCM |

### Package Functions Breakdown

#### 1. **expo-notifications**
- `registerForPushNotificationsAsync()`: Requests notification permissions and returns Expo push token
- `addNotificationReceivedListener()`: Listens for notifications received in foreground
- `addNotificationResponseReceivedListener()`: Listens for user taps on notifications
- `scheduleLocalNotification()`: Sends local test notifications

#### 2. **@react-native-async-storage/async-storage**
- `setItem(key, value)`: Saves chat history as JSON string
- `getItem(key)`: Retrieves saved chat history
- `removeItem(key)`: Clears chat history

#### 3. **react-native-gesture-handler**
- `PanResponder`: Handles drag gestures for the draggable bot
  - `onPanResponderGrant`: Called when drag starts
  - `onPanResponderMove`: Called during drag movement
  - `onPanResponderRelease`: Called when drag ends

## 🏗️ Project Structure

```
techVib/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── PostCard.js         # Individual post card component
│   │   ├── EmptyState.js       # Loading/error/empty states
│   │   ├── NotificationButton.js # Notification send button
│   │   ├── DraggableBot.js     # Draggable chat bot button
│   │   ├── ChatModal.js        # Chat interface modal
│   │   └── index.js            # Component exports
│   │
│   ├── screens/                 # Screen components
│   │   └── HomeScreen.js       # Main home screen with posts feed
│   │
│   ├── services/                # API and business logic
│   │   ├── api.js              # GraphQL API service (posts)
│   │   ├── geminiService.js    # Gemini AI API service
│   │   ├── chatStorage.js      # AsyncStorage wrapper for chat
│   │   └── notificationService.js # Notification service
│   │
│   └── constants/               # App constants
│       ├── api.js              # GraphQL endpoint and queries
│       ├── colors.js           # Color theme constants
│       ├── gemini.js           # Gemini API configuration
│       └── index.js            # Constants exports
│
├── assets/                      # Static assets (icons, images)
├── App.js                       # Root component
├── index.js                     # Entry point
├── app.json                     # Expo configuration
├── eas.json                     # EAS Build configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🔄 Project Flow

### Application Initialization Flow

```
1. index.js
   └─> Imports react-native-gesture-handler
   └─> Registers App component as root

2. App.js
   └─> Renders HomeScreen component

3. HomeScreen.js (Main Screen)
   ├─> useEffect (on mount):
   │   ├─> loadPosts() - Fetches posts from GraphQL API
   │   ├─> registerForPushNotificationsAsync() - Sets up notifications
   │   ├─> addNotificationReceivedListener() - Listens for notifications
   │   └─> addNotificationResponseReceivedListener() - Listens for taps
   │
   ├─> Renders:
   │   ├─> Header (Title)
   │   ├─> FlatList (Posts feed)
   │   ├─> NotificationButton (Bottom fixed)
   │   ├─> DraggableBot (Floating)
   │   └─> ChatModal (Conditional)
   │
   └─> State Management:
       ├─> posts: Array of post objects
       ├─> loading: Boolean for loading state
       ├─> error: Error message string
       ├─> chatModalVisible: Boolean for modal visibility
       └─> notifications: Array of received notifications
```

### Posts Feed Flow

```
User Action: App Opens
    │
    ▼
HomeScreen mounts
    │
    ▼
loadPosts() called
    │
    ▼
fetchPosts() from services/api.js
    │
    ├─> POST request to GraphQLZero API
    │   ├─> Endpoint: https://graphqlzero.almansi.me/api
    │   └─> Query: GET_POSTS_QUERY (posts with user info)
    │
    ▼
Response received
    │
    ├─> Success: setPosts(result.data.posts.data)
    └─> Error: setError(error.message)
    │
    ▼
FlatList renders PostCard for each post
    │
    └─> PostCard displays:
        ├─> User name/email
        ├─> Post title
        └─> Post body
```

### Chat Feature Flow (Detailed)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHAT FEATURE FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. INITIALIZATION (App Launch)
   │
   ├─> DraggableBot renders at bottom-right
   │   └─> Uses PanResponder for drag gestures
   │
   └─> ChatModal hidden (chatModalVisible = false)

2. USER INTERACTION - Open Chat
   │
   ├─> User taps DraggableBot
   │   └─> setChatModalVisible(true)
   │
   └─> ChatModal opens
       │
       ├─> useEffect (when visible):
       │   └─> loadHistory() called
       │       │
       │       └─> loadChatHistory() from services/chatStorage.js
       │           │
       │           ├─> AsyncStorage.getItem("@techvib_chat_history")
       │           │
       │           ├─> Parse JSON data
       │           │
       │           └─> setMessages(history) - Restore conversation
       │
       └─> Modal displays:
           ├─> Header (Title, Clear button, Close button)
           ├─> ScrollView (Message list)
           │   ├─> User messages (right-aligned, primary color)
           │   └─> Bot messages (left-aligned, gray background)
           └─> Input area (TextInput + Send button)

3. USER SENDS MESSAGE
   │
   ├─> User types message in TextInput
   │
   ├─> User taps "Send" button
   │   └─> handleSend() called
   │       │
   │       ├─> Create user message object:
   │       │   {
   │       │     id: timestamp,
   │       │     text: inputText,
   │       │     role: "user",
   │       │     timestamp: ISO string
   │       │   }
   │       │
   │       ├─> Add to messages array immediately (optimistic update)
   │       ├─> setInputText("") - Clear input
   │       ├─> setLoading(true) - Show loading indicator
   │       │
   │       └─> Call sendMessageToGemini()
   │           │
   │           ├─> Convert messages to conversation history format:
   │           │   [
   │           │     { role: "user", parts: [{ text: "..." }] },
   │           │     { role: "model", parts: [{ text: "..." }] },
   │           │     ...
   │           │   ]
   │           │
   │           ├─> Build API request:
   │           │   POST https://generativelanguage.googleapis.com/...
   │           │   Headers: { "Content-Type": "application/json" }
   │           │   Body: {
   │           │     contents: conversationHistory + new message
   │           │   }
   │           │
   │           ├─> Send to Gemini API
   │           │   └─> URL: GEMINI_API_URL + "?key=" + GEMINI_API_KEY
   │           │
   │           ├─> Parse response:
   │           │   └─> Extract: data.candidates[0].content.parts[0].text
   │           │
   │           ├─> Create bot message object:
   │           │   {
   │           │     id: timestamp,
   │           │     text: response,
   │           │     role: "bot",
   │           │     timestamp: ISO string
   │           │   }
   │           │
   │           ├─> Add bot message to messages array
   │           │
   │           └─> Save to AsyncStorage:
   │               └─> saveChatHistory(updatedMessages)
   │                   │
   │                   └─> AsyncStorage.setItem(
   │                       "@techvib_chat_history",
   │                       JSON.stringify(messages)
   │                   )
   │
   └─> setLoading(false) - Hide loading indicator

4. USER CLOSES CHAT
   │
   ├─> User taps close button (✕)
   │   └─> setChatModalVisible(false)
   │
   └─> ChatModal closes
       └─> Conversation state remains in AsyncStorage

5. USER REOPENS CHAT
   │
   ├─> User taps DraggableBot again
   │   └─> setChatModalVisible(true)
   │
   └─> loadHistory() runs again
       └─> Previous conversation restored from AsyncStorage
```

### Draggable Bot Flow

```
DraggableBot Component
    │
    ├─> Initial Position:
    │   └─> x: SCREEN_WIDTH - BOT_SIZE - 20
    │   └─> y: SCREEN_HEIGHT - BOT_SIZE - 150
    │
    ├─> PanResponder Setup:
    │   ├─> onPanResponderGrant: Sets offset when drag starts
    │   ├─> onPanResponderMove: Updates pan.x and pan.y during drag
    │   └─> onPanResponderRelease: Calculates final position
    │       │
    │       ├─> Calculate new position: position + gesture delta
    │       │
    │       ├─> Apply boundaries:
    │       │   ├─> X: 10 to (SCREEN_WIDTH - BOT_SIZE - 10)
    │       │   └─> Y: 100 to (SCREEN_HEIGHT - BOT_SIZE - 150)
    │       │
    │       └─> Update position state
    │
    └─> TouchableOpacity:
        └─> onPress: Opens ChatModal
```

## 📡 API Services

### 1. GraphQL API Service (`services/api.js`)

**Function**: `fetchPosts()`

**Purpose**: Fetches user posts from GraphQLZero API

**Flow**:
```
fetchPosts()
  └─> POST https://graphqlzero.almansi.me/api
      Body: { query: GET_POSTS_QUERY }
      └─> Returns: Array of posts with user information
```

**Query Structure**:
```graphql
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
```

### 2. Gemini API Service (`services/geminiService.js`)

**Function**: `sendMessageToGemini(message, conversationHistory)`

**Purpose**: Sends chat messages to Google Gemini API

**Flow**:
```
sendMessageToGemini(message, history)
  ├─> Build conversation context:
  │   └─> Map history to Gemini format:
  │       { role: "user"|"model", parts: [{ text: "..." }] }
  │
  ├─> Add new user message
  │
  └─> POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=API_KEY
      Body: { contents: conversationHistory }
      └─> Returns: Response text from AI
```

### 3. Chat Storage Service (`services/chatStorage.js`)

**Functions**:
- `saveChatHistory(messages)`: Saves messages to AsyncStorage
- `loadChatHistory()`: Loads messages from AsyncStorage
- `clearChatHistory()`: Removes all saved messages

**Storage Key**: `@techvib_chat_history`

**Format**: JSON stringified array of message objects

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Expo account (sign up at https://expo.dev)
- Physical Android/iOS device (for push notifications)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure Gemini API**:
   - Open `src/constants/gemini.js`
   - Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key
   - Get your API key from: https://makersuite.google.com/app/apikey

3. **Firebase Setup (for notifications)**:
   - Create a Firebase project at https://console.firebase.google.com/
   - Add Android app with package name: `com.techvib.app`
   - Download `google-services.json` and place it in the root directory

### Running the App

1. **Start development server**:
```bash
npm start
# or
expo start --dev-client
```

2. **For development build** (required for notifications):
```bash
# Build development client
npm run build:dev:android  # or build:dev:ios

# Install on device, then connect to dev server
```

3. **For Expo Go** (limited features - no notifications):
```bash
# Scan QR code with Expo Go app
# Note: Chat and notifications require dev build
```

## 🔐 API Configuration

### Gemini API Setup

1. **Get API Key**:
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Create new API key or use existing one

2. **Configure**:
   - Edit `src/constants/gemini.js`
   - Set `GEMINI_API_KEY` to your API key
   - Ensure `GEMINI_API_URL` points to correct model (currently `gemini-2.5-flash`)

3. **Model Options**:
   - `gemini-pro`: Standard model
   - `gemini-2.5-flash`: Faster, lighter model (current)
   - `gemini-1.5-pro`: Latest advanced model

### GraphQL API

- **Endpoint**: `https://graphqlzero.almansi.me/api`
- **Service**: GraphQLZero (free testing API)
- **No authentication required**
- **Query defined in**: `src/constants/api.js`

## 🎨 Component Architecture

### Component Hierarchy

```
App
└─> HomeScreen
    ├─> Header
    ├─> FlatList
    │   └─> PostCard (for each post)
    ├─> EmptyState (when no posts)
    ├─> NotificationButton (fixed bottom)
    ├─> DraggableBot (floating)
    └─> ChatModal (conditional)
        ├─> Header
        ├─> ScrollView
        │   └─> Message items (user/bot)
        └─> Input area
```

### Key Components

1. **PostCard**: Displays individual post with user info
2. **EmptyState**: Shows loading spinner, error, or empty message
3. **DraggableBot**: Circular draggable button for chat access
4. **ChatModal**: Full-screen modal with chat interface
5. **NotificationButton**: Fixed button at bottom for test notifications

## 📱 State Management

### HomeScreen State

```javascript
- posts: Array          // Posts from API
- loading: Boolean      // Loading state
- error: String         // Error message
- refreshing: Boolean   // Pull-to-refresh state
- chatModalVisible: Boolean  // Chat modal visibility
- notifications: Array  // Received notifications
- expoPushToken: String // Push notification token
```

### ChatModal State

```javascript
- messages: Array       // Chat messages (user + bot)
- inputText: String     // Current input text
- loading: Boolean      // Waiting for API response
```

## 🔄 Data Flow

### Posts Data Flow

```
GraphQLZero API
    │
    ▼
services/api.js (fetchPosts)
    │
    ▼
HomeScreen (loadPosts)
    │
    ▼
State: posts
    │
    ▼
FlatList → PostCard (renders)
```

### Chat Data Flow

```
User Input
    │
    ▼
ChatModal (handleSend)
    │
    ├─> Add user message to state
    │
    └─> services/geminiService.js (sendMessageToGemini)
        │
        ├─> Build conversation context
        │
        └─> Gemini API
            │
            ▼
        Response text
            │
            ▼
        Add bot message to state
            │
            ▼
        services/chatStorage.js (saveChatHistory)
            │
            ▼
        AsyncStorage (persisted)
```

## 🐛 Troubleshooting

### Chat Not Working?

1. **Check API Key**: Ensure Gemini API key is set in `src/constants/gemini.js`
2. **Check API Key Format**: Should be just the key, not the full URL
3. **Network**: Ensure device has internet connection
4. **Console Errors**: Check Metro bundler console for API errors

### Bot Not Draggable?

1. **Gesture Handler**: Ensure `react-native-gesture-handler` is installed
2. **Import**: Check that `index.js` imports gesture handler at the top
3. **Rebuild**: If using dev client, rebuild after installing package

### Posts Not Loading?

1. **Network**: Check internet connection
2. **API Endpoint**: Verify GraphQLZero API is accessible
3. **Console**: Check for GraphQL errors in console

### Chat History Not Persisting?

1. **AsyncStorage**: Ensure `@react-native-async-storage/async-storage` is installed
2. **Permissions**: Check app has storage permissions
3. **Storage Key**: Verify storage key is consistent (`@techvib_chat_history`)

## 📝 Scripts

```bash
# Development
npm start                 # Start dev server
npm run android          # Start with Android
npm run ios              # Start with iOS

# Build Development Client
npm run build:dev:android
npm run build:dev:ios

# Build Production
npm run build:prod:android
npm run build:prod:ios
```

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [GraphQLZero API](https://graphqlzero.almansi.me/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)

## 📄 License

This project is open source and available under the MIT License.

---

**Note**: Remember to keep your Gemini API key secure and never commit it to version control. Consider using environment variables for production builds.
