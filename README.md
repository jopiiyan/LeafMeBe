# 🌱 LeafMeBe

> An IoT-powered self-watering plant system that **harvests water from ambient humidity** and automates plant irrigation — controlled from an iOS app.

**Singapore University of Technology and Design — Oct 2025 to May 2026**
Awarded **SGD $2,000 in funding** and the **Sustainability Spirit Award** by SUTD.

---

## Overview

LeafMeBe is a full-stack IoT system that combines a mobile app, a cloud backend, and a microcontroller-driven hardware unit to **harvest atmospheric humidity into usable water** and dispense it to plants on demand or on schedule.

The system is designed for sustainability — reducing reliance on tap water for indoor plants by extracting moisture from the air using a Peltier-cooled cold plate.

## System Architecture

```
   ┌────────────────────┐
   │   iOS App (Expo)   │
   │  React Native + TS │
   └─────────┬──────────┘
             │
   ┌─────────┴──────────┐
   │                    │
   ▼                    ▼
┌──────────┐    ┌────────────────┐
│ Appwrite │    │ Express.js API │
│  (Auth)  │    │     (Node)     │
└──────────┘    └────────┬───────┘
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▲ 
        ┌──────────────┐    ┌─────────┐
        │ cPanel MySQL │◄───┤  ESP32  │
        │   Database   │    │         |  
        └──────────────┘    │         |
                            │         │
                            └─────────┘
```

### Component breakdown

| Layer | Tech | Responsibility |
|---|---|---|
| **Mobile App** | Expo (React Native) + TypeScript | UI, device control, scheduling, real-time status |
| **Authentication** | Appwrite | User signup, login, session management |
| **Backend API** | Node.js + Express.js | Command queue, device registry, water-log history |
| **Database** | MySQL (hosted on cPanel) | Persists users, devices, dispense logs, sensor readings |
| **Hardware** | ESP32 + Peltier | Harvests water from air, dispenses on command |

---

## How It Works

### 1. First-Time Device Setup (Wi-Fi Provisioning)
The ESP32 boots into **Access Point mode** and hosts a captive portal:

1. User connects their phone to the `LeafMeBe-XXXX` Wi-Fi network
2. A local web page automatically opens for entering home Wi-Fi credentials
3. ESP32 stores credentials in flash memory and switches to Station mode
4. Device connects to the home network and registers itself with the backend

This pattern eliminates hardcoded credentials and allows non-technical users to onboard new devices without reflashing.

### 2. Water Harvesting
The ESP32 drives a **Peltier thermoelectric cooler** that creates a cold surface. Ambient humid air condenses into liquid water on the cold plate, which is collected in an onboard reservoir. A DHT sensor monitors humidity to estimate harvest rate.

### 3. Dispensing Command Flow

```
   User taps "Dispense 50ml" in the iOS app
            │
            ▼
   App → POST /api/commands → Express server
            │
            ▼
   Express writes command row to MySQL (status: pending)
            │
            ▼
   ESP32 polls GET /api/commands/:device_id every N seconds
            │
            ▼
   ESP32 picks up pending command → activates peltier → dispenses water → logs result
            │
            ▼
   ESP32 → PATCH /api/commands/:id (status: completed)
```

Using a polling-based queue (rather than persistent connections) keeps the firmware simple and tolerant of brief network disruptions.

---

## Tech Stack

**Mobile**
- Expo SDK 54 with Expo Router (file-based routing)
- React Native 0.81 + React 19
- TypeScript
- React Navigation (bottom tabs)
- React Native Paper (UI components)
- react-native-gifted-charts (data visualisation)
- Expo Haptics (tactile feedback)
- AsyncStorage (local persistence)
- Axios (HTTP client)

**Backend**
- Node.js + Express.js
- MySQL (cPanel hosted)
- Appwrite (auth)

**Hardware / Firmware**
- ESP32 microcontroller
- DHT humidity & temperature sensor
- Peltier thermoelectric module
- Water pump + relay
- Arduino IDE / C++

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- npm or yarn
- Expo Go app on iPhone (for development) **or** EAS Build for standalone iOS builds
- Access to an Appwrite project (cloud or self-hosted)
- A MySQL database (we use cPanel hosting)
- ESP32 development board with Arduino IDE configured

### 1. Clone the repo
```bash
git clone https://github.com/jopiiyan/LeafMeBe.git
cd LeafMeBe
```

### 2. Install mobile app dependencies
```bash
npm install
```

### 3. Configure environment
Create a `.env` file in the project root:
```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=<your-project-id>
EXPO_PUBLIC_API_BASE_URL=https://<your-server>.com/api
```

### 4. Start the mobile app
```bash
npx expo start
```
Then scan the QR code with the Expo Go app on your iPhone.

### 5. Run the backend
```bash
cd server
npm install
npm start
```
Make sure your MySQL credentials are set in `server/.env`.

### 6. Flash the ESP32
Open the firmware sketch in Arduino IDE, install the required libraries (`WiFi.h`, `WebServer.h`, `DHT sensor library`, `HTTPClient.h`), then upload to your ESP32 board.

---

## Project Structure

```
LeafMeBe/
├── app/              # Expo Router screens (file-based routing)
├── assets/           # Images, icons, fonts
├── lib/              # Shared TypeScript modules (API client, helpers)
├── server/           # Node.js + Express backend
├── app.json          # Expo configuration
├── package.json
└── tsconfig.json
```

---

## Sustainability Impact

LeafMeBe directly addresses water-conservation goals:
- **Atmospheric water harvesting** reduces reliance on tap or bottled water for plant care
- **Precise dispensing volumes** (set per-plant in the app) prevent overwatering
- **Automated scheduling** ensures plants are watered only when needed, even when the owner is away

These principles earned the project the **Sustainability Spirit Award** at SUTD.

---
