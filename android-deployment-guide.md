
# Android App Deployment Guide

This guide will walk you through the process of deploying the CricketVerse Android app.

## Prerequisites

1. Install Android Studio: https://developer.android.com/studio
2. Install JDK 17 or newer: https://adoptium.net/
3. Set up an Android device or emulator

## Build & Run Steps

1. Export this project to GitHub using the "Export to GitHub" button
2. Clone the repository to your local machine
3. Install dependencies:
   ```
   npm install
   ```
4. Build the web app:
   ```
   npm run build
   ```
5. Add the Android platform:
   ```
   npx cap add android
   ```
6. Sync the web build with the Android project:
   ```
   npx cap sync android
   ```
7. Open the project in Android Studio:
   ```
   npx cap open android
   ```

## Update Android Manifest

Open `android/app/src/main/AndroidManifest.xml` and add the required permissions from the `android-manifest-changes.txt` file.

## Building an APK

1. In Android Studio, go to Build > Build Bundle(s) / APK(s) > Build APK(s)
2. The APK will be generated in `android/app/build/outputs/apk/debug/app-debug.apk`

## Testing

1. Connect your Android device via USB with USB debugging enabled
2. Run the app directly to your device:
   ```
   npx cap run android
   ```

## Release Build

For a production release:

1. Generate a signing key using Android Studio (Build > Generate Signed Bundle / APK)
2. Update the `capacitor.config.ts` file with your keystore information
3. Build a release APK or Bundle in Android Studio

## Troubleshooting

If you encounter issues:
- Check that all permissions are properly set in the AndroidManifest.xml
- Verify that your device/emulator has API level 22 or higher
- Ensure USB debugging is enabled on your physical device
- Run `npx cap doctor` to check for environment issues
