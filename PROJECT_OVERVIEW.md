# InWallet - Complete Hybrid Wallet Solution

A comprehensive digital wallet platform supporting both fiat and cryptocurrency transactions, featuring a modern mobile app with QR code payments and a robust backend API.

## 🏗️ Project Architecture

```
inwallet/
├── 📱 mobile-app/          # React Native/Expo Mobile App
│   ├── src/
│   │   ├── screens/        # App screens (Splash, Auth, Home, etc.)
│   │   ├── navigation/     # Navigation setup
│   │   └── constants/      # Theme and design system
│   ├── App.tsx            # Main app component
│   └── package.json       # Mobile dependencies
│
├── 🔧 Backend API/         # Node.js/Express/Prisma Backend
│   ├── routes/            # API routes (auth, wallet, merchant, admin)
│   ├── prisma/            # Database schema and migrations
│   ├── middleware/        # Authentication and validation
│   ├── lib/              # Utility functions
│   └── server.ts         # Express server setup
│
└── 📚 Documentation/      # Project documentation
```

## ✨ Key Features

### 🎨 Mobile App Features
- **Modern UI/UX**: Inspired by Wise app with InWallet red branding
- **Multi-Currency Support**: USD, EUR, BTC, SGD with real-time balances
- **QR Code Payments**: Scan and generate QR codes for instant payments
- **Card Management**: Order physical debit cards, manage virtual cards
- **Secure Authentication**: Email/password, Apple Sign In, biometric auth
- **Transaction History**: Complete transaction tracking and reporting
- **User & Merchant Pages**: Separate interfaces for different user types

### 🔧 Backend Features
- **RESTful API**: Comprehensive API for wallet operations
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based secure authentication
- **Wallet Management**: Multi-currency wallet support
- **Transaction Processing**: Secure transaction handling
- **Merchant Support**: Dedicated merchant functionality
- **Admin Panel**: Administrative controls and monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- Expo CLI (for mobile development)
- iOS Simulator or Android Emulator

### 1. Backend Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Set up database
npx prisma migrate dev
npx prisma generate

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:5000`

### 2. Mobile App Setup

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS/Android
npm run ios    # or npm run android
```

## 📱 Mobile App Screens

### 🌟 Core Screens
1. **Splash Screen**: InWallet branding with animated logo
2. **Authentication**: Login/Register with Apple Sign In option
3. **Home Dashboard**: Multi-currency balances and quick actions
4. **QR Scanner**: Camera-based QR code scanning for payments
5. **Send Money**: Transfer funds with QR code generation
6. **Add Money**: Top up wallet with multiple payment methods
7. **Card Order**: Order physical InWallet debit cards

### 🎯 User Types
- **Regular Users**: Personal wallet management
- **Merchants**: Business payment processing
- **Admins**: System administration and monitoring

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/login       # User login
POST /api/auth/register    # User registration
POST /api/auth/refresh     # Token refresh
```

### Wallet Operations
```
GET  /api/wallet/balance/:walletId     # Get wallet balance
POST /api/wallet/send                  # Send money
GET  /api/wallet/history/:walletId     # Transaction history
GET  /api/wallet/received/:walletId    # Received transactions
```

### Merchant Operations
```
POST /api/merchant/payment             # Process merchant payment
GET  /api/merchant/transactions        # Merchant transaction history
```

### Admin Operations
```
GET  /api/admin/users                  # Manage users
GET  /api/admin/transactions           # System-wide transactions
POST /api/admin/settings               # System configuration
```

## 🎨 Design System

### Color Palette
- **Primary Red**: `#E53E3E` (InWallet brand color)
- **Primary Dark**: `#C53030` (Pressed states)
- **Success Green**: `#48BB78` (Positive actions)
- **Warning Orange**: `#ED8936` (Alerts)
- **Background**: `#FFFFFF` (Clean white)
- **Surface**: `#F7FAFC` (Card backgrounds)

### Typography
- **Headers**: Bold, clear hierarchy
- **Body Text**: Readable, accessible sizing
- **Interactive Elements**: Medium weight for buttons

## 🔒 Security Features

### Mobile App Security
- **Biometric Authentication**: Face ID/Touch ID support
- **Encrypted Storage**: Secure local data storage
- **SSL/TLS**: Encrypted API communication
- **Session Management**: Secure token handling

### Backend Security
- **JWT Authentication**: Stateless authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: API abuse prevention
- **CORS Configuration**: Secure cross-origin requests

## 🧪 Testing

### Mobile App Testing
```bash
cd mobile-app
npm test                    # Run unit tests
npm run test:e2e           # Run end-to-end tests
```

### Backend Testing
```bash
npm test                    # Run API tests
npm run test:integration   # Run integration tests
```

## 🚀 Deployment

### Backend Deployment
```bash
# Build the application
npm run build

# Deploy to production
npm start
```

### Mobile App Deployment
```bash
cd mobile-app

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Deploy to app stores
eas submit --platform all
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/inwallet"
JWT_SECRET="your-jwt-secret"
PORT=5000
NODE_ENV="development"
```

#### Mobile App (.env)
```env
API_BASE_URL="http://localhost:5000"
EXPO_PUBLIC_API_URL="http://localhost:5000"
```

## 📊 Database Schema

### Core Tables
- **Users**: User accounts and profiles
- **Wallets**: Multi-currency wallet data
- **Transactions**: All wallet transactions
- **Merchants**: Business account information

### Relationships
- User → Wallet (One-to-One)
- Wallet → Transactions (One-to-Many)
- Transactions reference sender/receiver wallets

## 🛠️ Development Workflow

1. **Backend Development**
   - Modify API routes in `/routes`
   - Update database schema in `/prisma`
   - Test with Postman or similar tools

2. **Mobile Development**
   - Create/modify screens in `/mobile-app/src/screens`
   - Update navigation in navigation files
   - Test on iOS/Android simulators

3. **Integration Testing**
   - Test API endpoints with mobile app
   - Verify QR code functionality
   - Test payment flows end-to-end

## 📈 Future Enhancements

### Planned Features
- **Push Notifications**: Real-time payment alerts
- **Biometric Payments**: Face ID/Touch ID for payments
- **Multi-Language**: Internationalization support
- **Advanced Analytics**: Spending insights and reports
- **Social Payments**: Send money via social links
- **Merchant Dashboard**: Web-based merchant portal

### Technical Improvements
- **Real-time Updates**: WebSocket integration
- **Offline Support**: Local transaction queueing
- **Performance**: Code splitting and optimization
- **Monitoring**: Error tracking and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Ensure mobile responsiveness
- Follow security best practices

## 📞 Support

- **Email**: support@inwallet.com
- **Documentation**: [docs.inwallet.com](https://docs.inwallet.com)
- **Issues**: GitHub Issues
- **Discord**: [InWallet Community](https://discord.gg/inwallet)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**InWallet** - Building the future of digital payments 🚀

Made with ❤️ by the InWallet Team