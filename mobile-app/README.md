# InWallet Mobile App

A modern hybrid wallet application built with React Native and Expo, supporting both fiat and cryptocurrency transactions with QR code payment functionality.

## Features

### 🎨 UI/UX Design
- **Modern Design**: Inspired by Wise app with InWallet's red branding
- **Responsive Layout**: Optimized for iOS and Android devices
- **Beautiful Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant with proper contrast and touch targets

### 💰 Wallet Functionality
- **Multi-Currency Support**: USD, EUR, BTC, SGD, and more
- **Real-time Balance**: Live balance updates across all currencies
- **Transaction History**: Complete transaction tracking and history
- **Quick Actions**: Fast access to common operations

### 📱 QR Code Payments
- **QR Scanner**: Built-in camera scanner for payment QR codes
- **QR Generation**: Generate payment QR codes to receive money
- **Instant Payments**: Fast QR-based payment processing
- **Payment Validation**: Secure payment verification system

### 💳 Card Management
- **Physical Card**: Order InWallet debit cards
- **Virtual Cards**: Instant virtual card generation
- **Card Controls**: Freeze/unfreeze, limits, and security settings
- **Apple Pay**: Seamless Apple Pay integration

### 🔒 Security
- **Biometric Auth**: Fingerprint and Face ID support
- **Encryption**: End-to-end encryption for all transactions
- **Fraud Protection**: Advanced fraud detection and prevention
- **Secure Storage**: Encrypted local data storage

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **UI Library**: React Native Vector Icons
- **QR Codes**: react-native-qrcode-svg
- **Camera**: Expo Camera & Barcode Scanner
- **Styling**: StyleSheet with custom theme system

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

### Backend Setup

The mobile app connects to the InWallet backend API. Make sure the backend server is running:

```bash
cd ../
npm run dev
```

## Project Structure

```
mobile-app/
├── src/
│   ├── constants/
│   │   └── theme.ts           # Design system and colors
│   ├── navigation/
│   │   └── MainTabNavigator.tsx # Bottom tab navigation
│   └── screens/
│       ├── SplashScreen.tsx   # App splash screen
│       ├── AuthScreen.tsx     # Login/Register
│       ├── HomeScreen.tsx     # Main dashboard
│       ├── QRScannerScreen.tsx # QR code scanner
│       ├── SendMoneyScreen.tsx # Send money with QR
│       ├── AddMoneyScreen.tsx  # Add money to wallet
│       ├── CardOrderScreen.tsx # Order physical cards
│       └── ...
├── App.tsx                    # Main app component
├── app.json                   # Expo configuration
├── package.json               # Dependencies
└── tsconfig.json             # TypeScript config
```

## Screen Overview

### 🏠 Home Screen
- Multi-currency balance overview
- Recent transactions
- Quick action buttons
- Currency cards with flags and balances

### 📷 QR Scanner
- Camera-based QR code scanning
- Payment QR code recognition
- Flash toggle and scanning indicators
- Payment flow integration

### 💸 Send Money
- Amount and currency selection
- Recipient management
- QR code generation for receiving
- Quick amount presets
- Recent recipients list

### 💳 Card Management
- Physical card ordering
- Card feature overview
- Delivery tracking
- Card controls and settings

### 🔐 Authentication
- Email/password login
- User registration
- Apple Sign In integration
- Biometric authentication

## Customization

### Theming
The app uses a centralized theme system in `src/constants/theme.ts`:

```typescript
export const COLORS = {
  primary: '#E53E3E',        // InWallet red
  primaryDark: '#C53030',    // Darker red
  background: '#FFFFFF',     // White background
  // ... more colors
};
```

### Adding New Screens
1. Create screen component in `src/screens/`
2. Add to navigation in `App.tsx` or `MainTabNavigator.tsx`
3. Implement screen logic and styling

### API Integration
Update API endpoints in the relevant screen files to connect with your backend:

```typescript
// Example API call
const response = await fetch('http://your-api-url/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

### EAS Build (Recommended)
```bash
eas build --platform all
```

## Environment Variables

Create a `.env` file in the project root:

```env
API_BASE_URL=http://localhost:5000
EXPO_PUBLIC_API_URL=http://localhost:5000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@inwallet.com
- Documentation: [docs.inwallet.com](https://docs.inwallet.com)
- Issues: GitHub Issues

---

Built with ❤️ by the InWallet Team