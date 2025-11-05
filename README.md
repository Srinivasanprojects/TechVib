# TechVib - Expo Notifications with FCM (Dev Build)

This is an Expo managed workflow project with Firebase Cloud Messaging (FCM) integration for push notifications. **This project uses Expo Dev Client (development build) which is required for FCM to work properly.**

## ⚠️ Important: Dev Build Required

**FCM requires a development build** - Expo Go does NOT support custom native modules like FCM. You must build and install a custom development client on your device.

## Features

- ✅ Expo managed workflow with Dev Client
- ✅ Push notifications with expo-notifications
- ✅ FCM integration for Android
- ✅ Notification display UI
- ✅ Test notification functionality
- ✅ Real-time notification logging

## Prerequisites

- Node.js (v14 or higher)
- EAS CLI (`npm install -g eas-cli`) - Already installed
- Expo account (sign up at https://expo.dev)
- Firebase project (for FCM)
- Physical Android/iOS device (push notifications don't work on simulators)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Login to Expo:

```bash
eas login
```

3. Configure EAS project (if not already done):

```bash
eas build:configure
```

4. Add your `google-services.json` file:
   - Download `google-services.json` from your Firebase Console
   - Place it in the root directory of this project
   - The app.json is already configured to use it

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Cloud Messaging API

### Step 2: Add Android App to Firebase

1. In Firebase Console, click "Add app" and select Android
2. Enter your Android package name: `com.techvib.app` (from app.json)
3. Download `google-services.json`
4. Place it in the root directory of this project

### Step 3: Get FCM Server Key

1. In Firebase Console, go to Project Settings > Cloud Messaging
2. Copy the Server Key (Legacy) - you'll need this to send notifications

## Building and Running the Development Build

### Step 1: Build Development Client

**For Android:**

```bash
npm run build:dev:android
# or
eas build --profile development --platform android
```

**For iOS:**

```bash
npm run build:dev:ios
# or
eas build --profile development --platform ios
```

This will:

- Build a custom development client with FCM support
- Upload the build to EAS servers
- Provide you with a download link or QR code

### Step 2: Install Development Client

1. **Android**: Download the APK from the build link and install it on your device
   - Or scan the QR code with your Android device
2. **iOS**: Install via TestFlight (if configured) or download directly
   - Or scan the QR code with your iOS device

### Step 3: Start Development Server

```bash
npm start
# or
expo start --dev-client
```

This will start the Metro bundler with dev client support.

### Step 4: Connect to Dev Client

1. Open the **Expo Dev Client** app you just installed (not Expo Go)
2. Scan the QR code or enter the URL manually
3. The app will load and connect to the development server

## Building for Production

### Preview Build (for testing)

```bash
npm run build:preview:android
npm run build:preview:ios
```

### Production Build

```bash
npm run build:prod:android
npm run build:prod:ios
```

## Sending Notifications

### Using Expo Push Notification Service

The app displays an Expo Push Token when running. You can send notifications using:

1. **Expo Push Notification Tool**: https://expo.dev/notifications
2. **cURL command**:

```bash
curl -H "Content-Type: application/json" \
  -X POST https://exp.host/--/api/v2/push/send \
  -d '{
    "to": "YOUR_EXPO_PUSH_TOKEN",
    "title": "Test Notification",
    "body": "This is a test notification!",
    "data": { "testData": "Hello from FCM!" }
  }'
```

### Using FCM Directly

For Android, you can send notifications via FCM using the Server Key:

```bash
curl -X POST https://fcm.googleapis.com/fcm/send \
  -H "Authorization: key=YOUR_FCM_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_FCM_TOKEN",
    "notification": {
      "title": "Test Notification",
      "body": "This is a test notification from FCM!"
    },
    "data": {
      "testData": "Hello from FCM!"
    }
  }'
```

**Note**: In Expo managed workflow with dev client, FCM tokens are handled through Expo's push notification service. The dev build includes the necessary native code for FCM integration.

## Project Structure

```
techVib/
├── App.js                    # Main app component with notification UI
├── notificationService.js    # Notification service functions
├── app.json                  # Expo configuration
├── eas.json                  # EAS Build configuration
├── google-services.json      # Firebase configuration (add this file)
└── README.md                 # This file
```

## How It Works

1. **Development Build**: Custom native client with FCM support
2. **Permission Request**: The app requests notification permissions on launch
3. **Token Generation**: Expo Push Token is generated and displayed
4. **Notification Listeners**:
   - Listens for notifications received while app is in foreground
   - Listens for user taps on notifications
5. **Notification Display**: All received notifications are displayed in a scrollable list
6. **Test Notifications**: You can send test notifications using the button

## Troubleshooting

### Notifications not working?

1. **Use Dev Client**: Make sure you're using the development build, NOT Expo Go
2. **Check permissions**: Make sure notification permissions are granted
3. **Physical device**: Push notifications only work on physical devices, not simulators
4. **google-services.json**: Make sure the file is in the root directory
5. **Rebuild after changes**: If you change native config, rebuild the dev client

### FCM not working on Android?

1. Ensure `google-services.json` is in the root directory
2. Rebuild the development client after adding the file
3. Check that your package name matches in Firebase Console and app.json (`com.techvib.app`)
4. Make sure you're using the development build, not Expo Go

### Build errors?

1. **EAS Project ID**: Make sure you've run `eas build:configure` to set up your project
2. **Firebase setup**: Ensure `google-services.json` is valid and matches your Firebase project
3. **Package name**: Verify package name consistency across Firebase and app.json

### "Must use physical device" error?

- Push notifications don't work on simulators/emulators
- Use a real Android/iOS device for testing

## Development Workflow

1. **Initial Setup** (one time):

   - `eas login`
   - `eas build:configure`
   - Add `google-services.json`
   - Build dev client: `npm run build:dev:android`
   - Install dev client on device

2. **Daily Development**:

   - `npm start` (starts dev server)
   - Open dev client app on device
   - Scan QR code or enter URL
   - Make code changes and see them hot reload

3. **After Native Changes**:
   - If you modify `app.json` plugins or native config
   - Rebuild dev client: `npm run build:dev:android`
   - Reinstall updated dev client

## Next Steps

1. ✅ Add your `google-services.json` file from Firebase
2. ✅ Build and install development client
3. ✅ Test notifications using the test button in the app
4. ✅ Set up a backend server to send notifications via FCM
5. ✅ Customize notification appearance and behavior
6. ✅ Add notification categories and actions

## Resources

- [Expo Dev Client Documentation](https://docs.expo.dev/development/introduction/)
- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)

## License

This project is open source and available under the MIT License.
