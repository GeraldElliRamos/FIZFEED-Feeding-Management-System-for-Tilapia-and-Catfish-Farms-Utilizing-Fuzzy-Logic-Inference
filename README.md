# 🐟 FIZFEED — Fuzzy Inference-Based Feeding Management System

> **For Tilapia and Catfish Farms**
> A smart feeding management system that uses fuzzy logic to determine optimal feeding schedules and amounts for tilapia and catfish aquaculture.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
   - [Running the Web App](#running-the-web-app)
   - [Running the Mobile App](#running-the-mobile-app)
6. [Environment Variables Setup](#environment-variables-setup)
7. [Mobile App — Important Notes](#mobile-app--important-notes)
8. [Troubleshooting](#troubleshooting)
9. [For Future Developers](#for-future-developers)

---

## 🧠 Project Overview

**FIZFEED** is a capstone project that provides fish farm operators with an intelligent feeding management system powered by **fuzzy inference logic**. The system takes environmental and biological inputs (e.g., water temperature, fish age, fish weight) and computes the recommended feeding amount and schedule.

The system has two client apps:

| App | Description |
|-----|-------------|
| **Web App** (`web/`) | Browser-based dashboard for farm managers — monitoring, configuration, and reports |
| **Mobile App** (`mobile/`) | Android mobile app for on-the-go feeding monitoring via Expo Go |

---

## 🛠️ Tech Stack

### Web App
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Vanilla CSS | Styling |

### Mobile App
| Technology | Purpose |
|------------|---------|
| React Native | Cross-platform mobile framework |
| Expo SDK 54 | Managed workflow & device APIs |
| Expo Router | File-based navigation |
| TypeScript | Type-safe development |

---

## ✅ Prerequisites

Before you begin, make sure the following are installed on your machine:

### 1. Node.js (via Scoop — already installed on dev machines)
```powershell
# Verify Node is working
node -v    # should show v20.x or higher
npm -v     # should show 10.x or higher
```

> ⚠️ **If `node` or `npm` is not found in your terminal**, the PATH may not have loaded yet.
> Run this command to refresh environment variables without restarting:
> ```powershell
> $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "User") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "Machine")
> ```
> Or simply **close and reopen VS Code / your terminal**.

### 2. Git
```powershell
git --version
```

### 3. Android Studio *(for mobile development only)*
- Used for the Android SDK, `adb` (Android Debug Bridge), and build tools.
- Required environment variables (set at User level in Windows):
  - `ANDROID_HOME` → `C:\Users\<YourName>\AppData\Local\Android\Sdk`
  - `JAVA_HOME` → path to JDK 21
  - `PATH` must include `%ANDROID_HOME%\platform-tools`

### 4. Expo Go App *(on your Android phone)*
- Install **Expo Go v54** from the Google Play Store.
- ⚠️ This project uses **Expo SDK 54** — do NOT install a different version of Expo Go.

---

## 📁 Project Structure

```
FIZFEED/
│
├── README.md                   ← You are here
├── package.json                ← Root workspace with shortcut scripts
│
├── web/                        ← Web App (React + Vite + TypeScript)
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx            ← App entry point
│   │   ├── App.tsx             ← Root component
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
│
└── mobile/                     ← Mobile App (React Native + Expo SDK 54)
    ├── app/
    │   ├── _layout.tsx         ← Root navigator (Expo Router)
    │   ├── index.tsx           ← Splash screen (entry point)
    │   ├── (tabs)/             ← Main tab screens
    │   └── modal.tsx
    ├── assets/
    │   └── images/
    │       └── splash-icon.png ← FIZFEED logo (transparent PNG)
    ├── app.json                ← Expo configuration
    └── package.json
```

---

## 🚀 Getting Started

### Initial Setup (First Time Only)

Clone the repository and install dependencies for **both** apps:

```powershell
# 1. Navigate to the project folder
cd "c:\Capstone Project\FIZFEED-Fuzzy-Inference-Based-Feeding-Management-System-for-Tilapia-and-Catfish-Farms"

# 2. Install web dependencies
cd web
npm install
cd ..

# 3. Install mobile dependencies
cd mobile
npm install
cd ..
```

---

### Running the Web App

You can run the web app from the **root directory** using the shortcut script:

```powershell
# From the root FIZFEED directory:
npm run web:dev
```

Or, if you prefer to work directly inside the `web/` folder:

```powershell
cd web
npm run dev
```

The web app will start at: **http://localhost:5173**

Open that URL in your browser. Changes you make to the code will hot-reload automatically.

#### Other Web Commands
| Command (from root) | What it does |
|---------------------|--------------|
| `npm run web:dev` | Start the dev server |
| `npm run web:build` | Build for production |

---

### Running the Mobile App

You can run the mobile app from the **root directory** using the shortcut script:

```powershell
# From the root FIZFEED directory:
npm run mobile:start
```

Or, run it directly inside the `mobile/` folder:

```powershell
cd mobile
npx expo start
```

**Then:**
1. A **QR code** will appear in your terminal.
2. Open the **Expo Go** app on your Android phone.
3. Tap **"Scan QR Code"** and scan the code.
4. The app will load on your phone! 🎉

> 📱 Make sure your phone and computer are on the **same Wi-Fi network**.

#### Other Mobile Commands
| Command (from root) | What it does |
|---------------------|--------------|
| `npm run mobile:start` | Start Expo dev server (scan QR with Expo Go) |
| `npm run mobile:android` | Run on Android emulator (not needed for physical phone) |
| `npm run mobile:ios` | Run on iOS simulator (macOS only) |

---

## 🔧 Environment Variables Setup

These must be set on the developer's Windows machine (already configured on the main dev machine).

### For Mobile/Android development:

```powershell
# Set via Windows System Properties > Environment Variables > User Variables
ANDROID_HOME = C:\Users\<YourName>\AppData\Local\Android\Sdk
JAVA_HOME    = C:\Program Files\Java\jdk-21   # or wherever JDK 21 is installed

# Also add these to your PATH (User Variables):
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
```

After setting these, **restart your terminal** (or VS Code) so they take effect.

### Verify setup:
```powershell
adb --version        # should print Android Debug Bridge version
java --version       # should print java 21.x.x
```

---

## 📱 Mobile App — Important Notes

> Read these carefully to avoid common issues.

### ⚠️ Expo SDK Version
This project uses **Expo SDK 54**. Do NOT run `expo upgrade` or change the SDK version in `app.json` or `package.json`. The Expo Go app installed on the test phone is version **54.0.8**, which is only compatible with SDK 54.

### ⚠️ Transparent PNG Logos
The FIZFEED logo (`assets/images/splash-icon.png`) is a **transparent PNG**. When using it in React Native:
- ❌ **Do NOT** add `elevation` or shadow props to the `View` wrapping the logo image on Android — it causes a white box to appear behind transparent areas.
- ✅ Use a plain `<View>` with no shadow/elevation for logo containers.

### ⚠️ Testing on Physical Phone Only
We test exclusively on a **physical Android phone** with **Expo Go**. No Android emulator setup is required for running the app.

### ℹ️ Entry Point
Expo Router always loads `app/index.tsx` first. This is where the animated **splash screen** lives. Navigation to the main app tabs happens from there.

---

## 🐛 Troubleshooting

### `npm` or `node` not found
Run the PATH refresh command:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "User") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "Machine")
```
Or close and reopen your terminal / VS Code.

---

### Expo QR code not working / phone can't connect
- Make sure your phone and PC are on the **same Wi-Fi network**.
- Try pressing `w` in the Expo terminal to open the web version first, to confirm the server is running.
- If on a school/work network, try using your phone's mobile hotspot and connecting the PC to it.

---

### White box appearing behind the logo
This is an Android elevation issue. Remove `elevation`, `shadowColor`, `shadowOpacity`, `shadowRadius`, and `shadowOffset` from the `View` that wraps your `<Image>` component.

---

### Metro bundler stuck / cached errors
Clear the Expo cache:
```powershell
cd mobile
npx expo start --clear
```

---

### Android build issues / `adb` not found
Verify your `ANDROID_HOME` and `PATH` are correctly set. Then run:
```powershell
adb --version
```
If this fails, restart your terminal after checking environment variables in Windows System Properties.

---

## 👨‍💻 For Future Developers

Welcome! Here's what you need to know to continue this project:

### Codebase Philosophy
- **Mobile first, then web** — the mobile app is the primary user-facing tool for farm operators.
- **Fuzzy logic** is the core algorithm — look for the inference engine modules in the relevant source folders.
- Keep the design system consistent: **Manrope font**, primary color `#005BBF`, secondary color `#006874`, surface background `#f8f9fa`.

### Adding New Mobile Screens
This project uses **Expo Router** (file-based routing, similar to Next.js):
- Create a new file inside `mobile/app/` → it becomes a route automatically.
- Files inside `mobile/app/(tabs)/` → appear as bottom tab bar items.
- See [Expo Router docs](https://docs.expo.dev/router/introduction/) for full reference.

### Adding New Web Pages
The web app uses **React + Vite**:
- Add new components inside `web/src/`.
- Run `npm run web:dev` to test locally.
- See [Vite docs](https://vitejs.dev/) and [React docs](https://react.dev/) for reference.

### Key Dependencies to Know
| Package | Where | Why |
|---------|-------|-----|
| `expo-router` | mobile | File-based navigation |
| `expo-splash-screen` | mobile | Controls native splash screen |
| `react-native-reanimated` | mobile | Smooth animations |
| `vite` | web | Fast build tool |
| `react` + `react-dom` | web | UI framework |

### Branching Strategy (Recommended)
```
main         ← stable, tested code only
dev          ← active development
feature/xxx  ← individual features (branch off dev)
```

### Before Committing
- Test the mobile app on a physical device using Expo Go.
- Test the web app in the browser at `localhost:5173`.
- Make sure no sensitive keys or tokens are committed (use `.env` files).

---

## 👥 Team

**FIZFEED** is a Capstone Project by:

- Carl Vincent D. Canilang
- Anton Patrick E. Fontillas
- Monard Kyle B. Malicdem
- Gerald Elli T. Ramos

---

## 📄 License

This project is for academic/capstone purposes. All rights reserved by the authors.