const mockComponent = (name) => {
  return function (props) {
    return JSON.stringify({ type: name, props: props });
  };
};

const Platform = {
  OS: 'ios',
  select: (obj) => obj.ios || obj.default,
  Version: 14,
  constants: {
    isTesting: true,
    reactNativeVersion: { major: 0, minor: 71, patch: 8 },
  },
};

module.exports = {
  // Basic components
  View: mockComponent('View'),
  Text: mockComponent('Text'),
  ScrollView: mockComponent('ScrollView'),
  TextInput: mockComponent('TextInput'),
  TouchableOpacity: mockComponent('TouchableOpacity'),
  Pressable: mockComponent('Pressable'),
  
  // Lists
  FlatList: mockComponent('FlatList'),
  SectionList: mockComponent('SectionList'),
  VirtualizedList: mockComponent('VirtualizedList'),
  
  // Animation
  Animated: {
    View: mockComponent('Animated.View'),
    createAnimatedComponent: (comp) => comp,
    Value: jest.fn(),
    timing: jest.fn(),
  },
  
  // Platform
  Platform,
  
  // Dimensions
  Dimensions: {
    get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  },
  
  // Native Modules
  NativeModules: {
    ExpoNativeModuleProxy: {
      expo: {
        modules: {}
      }
    },
    PlatformConstants: {
      ...Platform.constants
    },
    StatusBarManager: {
      getHeight: jest.fn(),
      setStyle: jest.fn(),
      setHidden: jest.fn(),
    },
  },
  
  // Utilities
  StyleSheet: {
    create: (styles) => styles,
    hairlineWidth: 1,
  },
}; 