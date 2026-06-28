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
