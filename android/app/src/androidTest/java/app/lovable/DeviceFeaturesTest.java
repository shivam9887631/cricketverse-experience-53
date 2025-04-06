
package app.lovable;

import android.content.Context;
import android.content.Intent;

import androidx.test.core.app.ApplicationProvider;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.Until;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@RunWith(AndroidJUnit4.class)
public class DeviceFeaturesTest {
    private static final String PACKAGE_NAME = "app.lovable.04aae878a9224ddd929dad380c1154d8";
    private static final int LAUNCH_TIMEOUT = 5000;
    private UiDevice mDevice;

    @Before
    public void startMainActivityFromHomeScreen() {
        // Initialize UiDevice instance
        mDevice = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());

        // Start from the home screen
        mDevice.pressHome();

        // Wait for launcher
        final String launcherPackage = mDevice.getLauncherPackageName();
        assertNotNull(launcherPackage);
        mDevice.wait(Until.hasObject(By.pkg(launcherPackage).depth(0)), LAUNCH_TIMEOUT);

        // Launch the app
        Context context = ApplicationProvider.getApplicationContext();
        final Intent intent = context.getPackageManager()
                .getLaunchIntentForPackage(PACKAGE_NAME);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(intent);

        // Wait for the app to appear
        mDevice.wait(Until.hasObject(By.pkg(PACKAGE_NAME).depth(0)), LAUNCH_TIMEOUT);
    }

    @Test
    public void testLocationFeature() {
        // Navigate to Device Features screen using data-testid
        UiObject2 navMenu = mDevice.wait(
            Until.findObject(By.desc(TestConstants.NAV_MENU)), 
            LAUNCH_TIMEOUT
        );
        assertNotNull("Navigation menu not found", navMenu);
        navMenu.click();
        
        UiObject2 deviceFeatureLink = mDevice.wait(
            Until.findObject(By.text("Device Features")), 
            LAUNCH_TIMEOUT
        );
        assertNotNull("Device Features link not found", deviceFeatureLink);
        deviceFeatureLink.click();
        
        // Test the Location feature
        UiObject2 locationCard = mDevice.wait(
            Until.findObject(By.desc(TestConstants.LOCATION_CARD)), 
            LAUNCH_TIMEOUT
        );
        assertNotNull("Location feature card not found", locationCard);
        
        // Click on Get Location button if visible
        UiObject2 getLocationButton = mDevice.findObject(By.desc(TestConstants.GET_LOCATION_BUTTON));
        if (getLocationButton != null) {
            getLocationButton.click();
            // Wait for location to be retrieved
            boolean locationFound = mDevice.wait(
                Until.hasObject(By.textContains("Latitude:")), 
                10000 // 10 seconds timeout for GPS
            );
            assertTrue("Location not retrieved successfully", locationFound);
        } else {
            // If button is not visible, location might already be displayed
            UiObject2 latitudeText = mDevice.findObject(By.textContains("Latitude:"));
            assertNotNull("Location information not displayed", latitudeText);
        }
        
        // Test View on Map button if location is found
        UiObject2 viewMapButton = mDevice.findObject(By.desc(TestConstants.VIEW_MAP_BUTTON));
        if (viewMapButton != null) {
            viewMapButton.click();
            // Wait for maps to open (can't fully test external app)
            // Just verify our app is still running after returning
            mDevice.pressBack(); // Return from maps
            boolean appReturned = mDevice.wait(
                Until.hasObject(By.desc(TestConstants.LOCATION_CARD)),
                LAUNCH_TIMEOUT
            );
            assertTrue("Failed to return to app after viewing map", appReturned);
        }
    }
    
    @Test
    public void testDeviceInfoFeature() {
        // Navigate to Device Features screen
        UiObject2 navMenu = mDevice.wait(
            Until.findObject(By.desc(TestConstants.NAV_MENU)), 
            LAUNCH_TIMEOUT
        );
        assertNotNull("Navigation menu not found", navMenu);
        navMenu.click();
        
        UiObject2 deviceFeatureLink = mDevice.wait(
            Until.findObject(By.text("Device Features")), 
            LAUNCH_TIMEOUT
        );
        assertNotNull("Device Features link not found", deviceFeatureLink);
        deviceFeatureLink.click();
        
        // Test the Device Info feature
        UiObject2 deviceInfoCard = mDevice.wait(
            Until.findObject(By.desc(TestConstants.DEVICE_INFO_CARD)), 
            LAUNCH_TIMEOUT
        );
        assertNotNull("Device info card not found", deviceInfoCard);
        
        // Click on Get Device Info button if it exists
        UiObject2 getDeviceInfoButton = mDevice.findObject(By.text("Get Device Info"));
        if (getDeviceInfoButton != null) {
            getDeviceInfoButton.click();
            
            // Wait for device info to be retrieved
            boolean deviceInfoDisplayed = mDevice.wait(
                Until.hasObject(By.text("Platform:")), 
                LAUNCH_TIMEOUT
            );
            assertTrue("Device info not retrieved successfully", deviceInfoDisplayed);
        } else {
            // If button not found, info might already be displayed
            UiObject2 platformText = mDevice.findObject(By.text("Platform:"));
            assertNotNull("Device information not displayed", platformText);
        }
    }
}
