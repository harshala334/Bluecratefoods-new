# BlueCrate Partner App 👨‍🍳

The **BlueCrate Partner App** is a dedicated mobile interface for restaurants and kitchen partners to manage incoming food orders. It allows partners to accept orders, track kitchen status, and mark orders as ready for delivery.

## 📱 Features

- **Real-time Dashboard**: View incoming orders instantly.
- **Order Management Workflow**:
  - **New Orders**: Accept or switch to busy mode.
  - **In Kitchen**: Mark items as "Ready" when preparation is done.
  - **History**: View completed and past orders.
- **Demo Mode**: Built-in simulation to test the flow without a live backend connection.

## 🛠 Tech Stack

- **Framework**: React Native (Expo SDK 50+)
- **Navigation**: React Navigation (Stack)
- **State Management**: Zustand
- **Styling**: StyleSheet (matches User App design system)

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- Expo Go app on your physical device (Android/iOS)

### Installation

1. Navigate to the partner app directory:
   ```bash
   cd mobile/partner-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *(Note: Native dependencies are aligned with the Expo version)*

### Running the App

Start the development server:
```bash
npx expo start
```

- **Scan the QR code** with the Expo Go app (Android) or Camera app (iOS).
- To clear cache (if you face issues): `npx expo start --clear`

## ⚠️ Important Note

This app currently runs in **Standalone Demo Mode**.
- It **does not** share a realtime backend with the User App yet.
- Use the **"+ Demo Order"** button in the top-right header to simulate an incoming order for testing purposes.
