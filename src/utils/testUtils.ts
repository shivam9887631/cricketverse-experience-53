
/**
 * Test ID constants and utility functions
 * For use with UI Automator testing in Android/iOS
 */

// Define all test IDs centrally
export const TEST_IDS = {
  // Navigation elements
  NAV_MENU: "navigation-menu",
  NAV_MENU_ITEM_PREFIX: "nav-item-",
  
  // Location feature elements
  LOCATION_CARD: "location-feature-card",
  GET_LOCATION_BUTTON: "get-location-button",
  REFRESH_LOCATION_BUTTON: "refresh-location-button",
  VIEW_MAP_BUTTON: "view-map-button",
  LOCATION_DISPLAY: "location-display",
  
  // Device info elements
  DEVICE_INFO_CARD: "device-info-card",
  GET_DEVICE_INFO_BUTTON: "get-device-info-button",
  REFRESH_DEVICE_INFO_BUTTON: "refresh-device-info-button",
  
  // Motion feature elements
  MOTION_FEATURE_CARD: "motion-feature-card",
  TOGGLE_MOTION_BUTTON: "toggle-motion-button",
  MOTION_DATA_DISPLAY: "motion-data-display",
  SHAKE_COUNT: "shake-count"
};

/**
 * Utility to add test IDs to elements
 * Returns an object with data-testid attribute
 * 
 * @param id Test ID to apply
 * @returns Object with data-testid attribute
 */
export const testId = (id: string) => {
  return {
    "data-testid": id,
    "aria-label": id // For additional accessibility
  };
};
