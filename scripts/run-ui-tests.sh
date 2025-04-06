
#!/bin/bash

# Print colorful messages
function print_step {
  echo -e "\n\033[1;36m===== $1 =====\033[0m"
}

function print_success {
  echo -e "\033[1;32m✓ $1\033[0m"
}

function print_error {
  echo -e "\033[1;31m✗ $1\033[0m"
}

# Check if Android Studio is available
if ! command -v $ANDROID_HOME/tools/bin/sdkmanager &> /dev/null; then
  print_error "Android SDK not found. Make sure Android Studio is installed and ANDROID_HOME is set."
  exit 1
fi

print_step "Building Android app for UI testing"
npx cap sync android || { print_error "Failed to sync Android project"; exit 1; }
cd android || { print_error "Failed to navigate to Android directory"; exit 1; }
./gradlew clean assembleDebug assembleAndroidTest || { print_error "Failed to build Android app"; exit 1; }
print_success "Android app built successfully"

print_step "Installing app and running UI Automator tests"
./gradlew installDebug installDebugAndroidTest || { print_error "Failed to install the app"; exit 1; }
./gradlew connectedAndroidTest || { print_error "Tests failed"; exit 1; }
print_success "UI tests completed successfully"

print_step "Test Results"
echo "Test results available at: android/app/build/reports/androidTests/connected/"
echo "HTML report: file://${PWD}/app/build/reports/androidTests/connected/index.html"

# Open the report if possible
if command -v xdg-open &> /dev/null; then
  xdg-open "${PWD}/app/build/reports/androidTests/connected/index.html" &
elif command -v open &> /dev/null; then
  open "${PWD}/app/build/reports/androidTests/connected/index.html" &
fi

cd ..

print_step "UI Testing Complete"
echo "To run the tests again, simply execute: ./scripts/run-ui-tests.sh"
