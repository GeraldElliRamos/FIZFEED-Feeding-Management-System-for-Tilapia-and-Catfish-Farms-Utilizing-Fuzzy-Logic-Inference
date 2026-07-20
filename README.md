# FIZFEED

FIZFEED is a fuzzy inference-based feeding management system for tilapia and catfish farms. It helps farm operators estimate feeding recommendations using environmental and biological inputs such as water temperature, fish age, and fish weight.

The repository contains two apps:

- `web/` - browser-based dashboard for monitoring, configuration, and reports
- `mobile/` - Android mobile app for on-the-go feeding checks using Expo Go

## Overview

FIZFEED is designed to support smarter feeding decisions with a simple workflow:

1. Enter farm and fish data
2. Let the fuzzy inference engine compute a recommendation
3. Review the suggested feeding amount and schedule
4. Use the web or mobile app depending on where you are

## User Roles Guide

FIZFEED uses roles to separate what each user can do in the system. Roles are saved when a user signs up and can later be used for page access, actions, and dashboards.

### Available roles

- `admin` - manages users, system settings, ponds, devices, and reports
- `farm_owner` - full access to farm data, ponds, devices, and analytics
- `farm_staff` - can add and update daily farm records
- `viewer` - read-only access for monitoring

### How roles are assigned

1. Open the signup page.
2. Choose a role from the role dropdown.
3. Complete the account registration.
4. The selected role is saved to the Firestore `users` document for that account.

### Suggested use in the app

- Show or hide menu items based on role.
- Let `admin` and `farm_owner` manage ponds and devices.
- Limit `farm_staff` to updating daily records and checking alerts.
- Keep `viewer` on read-only pages.

### Web and mobile access guide

The current web and mobile apps use the saved role to control what the user can see and open.

- `admin` and `farm_owner` - full access to management screens
- `farm_staff` - access to operational screens like dashboard, schedule, alerts, and recommendations
- `viewer` - read-only access to monitoring screens

Recommended page access:

- Web: show or hide sidebar links based on role, then block direct access to restricted routes.
- Mobile: show only the allowed tabs for the selected role, then redirect unauthorized users away from hidden screens.

Suggested rule of thumb:

- If the user can edit ponds or devices, require `admin` or `farm_owner`.
- If the user only needs day-to-day farm work, allow `farm_staff`.
- If the user only needs to monitor the farm, allow `viewer`.

### Guide for future development

- Add route protection by checking the saved role in the user profile.
- Use roles in the dashboard to render different widgets per user type.
- Apply the same role logic in the mobile app so the experience stays consistent.

## Tech Stack

### Web App

- React 18 + TypeScript
- Vite
- Vanilla CSS

### Mobile App

- React Native
- Expo SDK 54
- Expo Router
- TypeScript

## Prerequisites

Make sure these are installed before running the project:

- **Node.js** 20 or newer
- **npm**
- **Git**
- **Android Studio** if you plan to run the mobile app on Android or use the Android SDK tools
- **Expo Go** on an Android phone if you want to test the mobile app on a physical device

### Quick checks

```powershell
node -v
npm -v
git --version
```

If `node` or `npm` is not recognized, restart your terminal or refresh your PATH:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "User") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "Machine")
```

## Project Structure

```text
FIZFEED/
|-- README.md
|-- package.json
|-- web/
|   |-- src/
|   |-- index.html
|   |-- package.json
|-- mobile/
    |-- app/
    |-- assets/
    |-- app.json
    |-- package.json
```

## Getting Started

### 1) Install dependencies

From the project root:

```powershell
cd "c:\Capstone Project\FIZFEED-Fuzzy-Inference-Based-Feeding-Management-System-for-Tilapia-and-Catfish-Farms"
cd web
npm install
cd ..
cd mobile
npm install
cd ..
```

### 2) Run the web app

From the root directory:

```powershell
npm run web:dev
```

Or run it directly inside `web/`:

```powershell
cd web
npm run dev
```

The web app opens at `http://localhost:5173`.

#### Web commands

- `npm run web:dev` - start the development server
- `npm run web:build` - build the web app for production

### 3) Run the mobile app

From the root directory:

```powershell
npm run mobile:start
```

Or run it directly inside `mobile/`:

```powershell
cd mobile
npx expo start
```

Then:

1. A QR code appears in the terminal.
2. Open **Expo Go** on your Android phone.
3. Scan the QR code.
4. The app loads on your phone.

Make sure your phone and computer are on the same Wi-Fi network.

#### Mobile commands

- `npm run mobile:start` - start the Expo dev server
- `npm run mobile:android` - run on an Android emulator
- `npm run mobile:ios` - run on the iOS simulator on macOS

## Environment Variables for Android Development

If you are working on mobile/Android development, set these environment variables on Windows:

- `ANDROID_HOME` - for example: `C:\Users\<YourName>\AppData\Local\Android\Sdk`
- `JAVA_HOME` - path to JDK 21
- Add `%ANDROID_HOME%\platform-tools` to your `PATH`

After updating them, restart your terminal or VS Code.

## Firebase Environment Variables

The Firebase config is now read from environment variables instead of being hard-coded in source files.

- Web app: copy [web/.env.example](web/.env.example) to `web/.env.local` and fill in your Firebase values.
- Mobile app: copy [mobile/.env.example](mobile/.env.example) to `mobile/.env` or `mobile/.env.local` and fill in your Firebase values.

Required values:

- `VITE_FIREBASE_API_KEY` / `EXPO_PUBLIC_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN` / `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID` / `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET` / `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID` / `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID` / `EXPO_PUBLIC_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` / `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`

### Verify Android setup

```powershell
adb --version
java --version
```

## Important Mobile Notes

- This project uses **Expo SDK 54**. Avoid running `expo upgrade` unless the team plans to update the whole app.
- The FIZFEED logo uses a transparent PNG. On Android, avoid `elevation` or shadow props on containers wrapping the logo image, or a white box may appear behind it.
- The mobile app is intended for testing on a physical Android phone with Expo Go.
- Expo Router loads `mobile/app/index.tsx` first. That file contains the splash screen flow.

## Troubleshooting

### `node` or `npm` is not found

Restart your terminal, or refresh PATH with:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "User") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "Machine")
```

### Expo QR code does not connect

- Confirm both devices are on the same Wi-Fi network.
- Try opening the web version first to confirm the server is running.
- If your network blocks local device discovery, try a phone hotspot.

### White box appears behind the logo

Remove `elevation` and shadow-related styles from the logo container on Android.

### Metro cache problems

```powershell
cd mobile
npx expo start --clear
```

### `adb` is not found

Check `ANDROID_HOME` and `PATH`, then restart your terminal.

## For Future Developers

### Project priorities

- Mobile-first workflow, with web support for management tasks
- Fuzzy logic is the core algorithmic layer
- Keep the design consistent with the existing style tokens and typography

### Adding a new mobile screen

The mobile app uses Expo Router, so new files inside `mobile/app/` become routes automatically.

- Put tab screens inside `mobile/app/(tabs)/`
- Put shared or modal screens elsewhere in `mobile/app/`

### Adding a new web page

The web app uses React + Vite.

- Add components inside `web/src/`
- Run `npm run web:dev` while developing

### Useful dependencies

- `expo-router` - mobile navigation
- `expo-splash-screen` - native splash handling
- `react-native-reanimated` - mobile animations
- `vite` - web development and builds

### Suggested branching

- `main` - stable, tested code
- `dev` - active development
- `feature/<name>` - individual features

### Before committing

- Test the web app in the browser
- Test the mobile app on a physical Android device if possible
- Avoid committing secrets or local environment files

## Team

FIZFEED was created by:

- Carl Vincent D. Canilang
- Anton Patrick E. Fontillas
- Monard Kyle B. Malicdem
- Gerald Elli T. Ramos

## License

This project is for academic and capstone purposes. All rights reserved by the authors.
