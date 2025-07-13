import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn()
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn().mockResolvedValue({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
    details: {
      isConnectionExpensive: false,
      ssid: null,
      strength: null,
      ipAddress: null,
      subnet: null,
      frequency: null,
      bssid: null,
      linkSpeed: null,
      rxLinkSpeed: null,
      txLinkSpeed: null
    }
  }),
  useNetInfo: jest.fn()
}));

// Mock Firebase Analytics
jest.mock('@react-native-firebase/analytics', () => ({
  __esModule: true,
  default: () => ({
    logEvent: jest.fn(),
    setAnalyticsCollectionEnabled: jest.fn()
  })
}));

// Mock custom error types
global.NetworkError = class NetworkError extends Error {
  constructor(message = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
};

global.TimeoutError = class TimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
};

// Mock RetryConfig type and default config
global.RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 5000,
  backoffFactor: 2
};

global.defaultRetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 5000,
  backoffFactor: 2
}; 