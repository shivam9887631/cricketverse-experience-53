
#!/bin/bash

echo "Building Android app..."
npx cap sync android
cd android
./gradlew clean assembleDebug assembleAndroidTest

echo "Installing app and running tests..."
./gradlew installDebug installDebugAndroidTest
./gradlew connectedAndroidTest

echo "Test results available at: android/app/build/reports/androidTests/connected/"
