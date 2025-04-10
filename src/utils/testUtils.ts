
/**
 * Test utilities for UI testing
 * 
 * This file provides helper functions and constants for UI testing
 * with UI Automator. These can be used by both the test frameworks
 * and the application to make elements more testable.
 */

/**
 * Add data-testid attributes to DOM elements to make them easily 
 * findable by UI Automator tests
 * 
 * @param testId The unique test identifier
 * @returns Props object with data-testid attribute
 */
export const testId = (id: string) => ({
  'data-testid': id,
  // For accessibility and UI Automator
  'contentDescription': id
});

/**
 * Common test IDs used throughout the application
 */
export const TEST_IDS = {
  // Navigation elements
  NAV_MENU: 'navigation-menu',
  NAV_MENU_ITEM_PREFIX: 'nav-item-',
  
  // Location feature elements
  LOCATION_CARD: 'location-feature-card',
  GET_LOCATION_BUTTON: 'get-location-button',
  REFRESH_LOCATION_BUTTON: 'refresh-location-button',
  VIEW_MAP_BUTTON: 'view-map-button',
  LOCATION_DISPLAY: 'location-display',
  
  // Device info elements
  DEVICE_INFO_CARD: 'device-info-card',
  GET_DEVICE_INFO_BUTTON: 'get-device-info-button',
  REFRESH_DEVICE_INFO_BUTTON: 'refresh-device-info-button',
  
  // Motion feature elements
  MOTION_FEATURE_CARD: 'motion-feature-card',
  TOGGLE_MOTION_BUTTON: 'toggle-motion-button',
  MOTION_DATA_DISPLAY: 'motion-data-display',
  SHAKE_COUNT: 'shake-count'
};
