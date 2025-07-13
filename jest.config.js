module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', './jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js'
  ],
  // Add projects for different test environments
  projects: [
    {
      displayName: 'utility',
      testMatch: ['<rootDir>/utils/__tests__/**/*.test.ts'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transform: {
        '^.+\\.(js|ts|tsx)$': 'babel-jest',
      },
    },
    {
      displayName: 'react-native',
      testMatch: [
        '<rootDir>/components/__tests__/**/*.test.tsx',
        '<rootDir>/services/__tests__/**/*.test.ts',
        '<rootDir>/__tests__/**/*.test.tsx'
      ],
      preset: 'jest-expo',
      setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', './jest.setup.js'],
      transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
      ],
    }
  ]
}; 