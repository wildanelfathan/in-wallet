# CI/CD Pipeline Setup Guide

## Overview
This project includes a complete CI/CD pipeline using GitHub Actions and EAS Build for automated testing, building, and deployment of the IN WALLET mobile app.

## 🚀 Pipeline Components

### 1. GitHub Actions Workflow (`.github/workflows/ci-cd.yml`)
- **Testing**: TypeScript checking, ESLint, Jest tests with coverage
- **Building**: Automated Android and iOS builds using EAS Build
- **Deployment**: Expo Updates for over-the-air updates
- **Security**: npm audit, CodeQL analysis, and Trivy vulnerability scanning (all free!)

### 2. EAS Build Configuration (`eas.json`)
- **Development**: Development client builds for testing
- **Preview**: Internal distribution builds
- **Production**: App store ready builds

## 🔧 Setup Instructions

### 1. GitHub Repository Setup

#### Required Secrets
Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

```bash
# Expo (Required)
EXPO_TOKEN=your_expo_access_token

# App Store (Optional - for iOS submissions)
APPLE_ID=your_apple_id
APPLE_TEAM_ID=your_apple_team_id
ASC_APP_ID=your_app_store_connect_app_id

# Google Play (Optional - for Android submissions)
GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_json_content
```

**Note**: Security scanning now uses GitHub's free built-in features (CodeQL and Trivy) instead of Snyk.

#### How to get EXPO_TOKEN:
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Get token: `eas whoami --json`

### 2. EAS Build Setup

#### Initialize EAS Build:
```bash
eas build:configure
```

#### Build Profiles:
- **Development**: `eas build --profile development`
- **Preview**: `eas build --profile preview`
- **Production**: `eas build --profile production`

### 3. Environment Variables

Create environment-specific configurations:

```bash
# Development
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://dev-api.inwallet.com"

# Production
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.inwallet.com"
```

## 📋 Available Scripts

### Development
```bash
npm start                    # Start Expo development server
npm run android             # Run on Android device/emulator
npm run ios                 # Run on iOS device/simulator
npm test                    # Run tests
npm run test:coverage       # Run tests with coverage
npm run lint                # Run ESLint
npm run type-check          # Run TypeScript checking
```

### Building
```bash
npm run build:android       # Build Android APK (preview)
npm run build:android:prod  # Build Android AAB (production)
npm run build:ios          # Build iOS (preview)
npm run build:ios:prod     # Build iOS (production)
```

### Deployment
```bash
npm run submit:android      # Submit to Google Play Store
npm run submit:ios         # Submit to App Store
npm run update             # Deploy OTA updates
```

## 🔄 Pipeline Flow

### On Push to `main` branch:
1. ✅ **Test & Lint**: TypeScript, ESLint, Jest tests
2. ✅ **Security Scan**: npm audit, CodeQL analysis, Trivy scan
3. ✅ **Build Android**: Preview and Production builds
4. ✅ **Build iOS**: Preview build
5. ✅ **Deploy Updates**: OTA update to production

### On Pull Request:
1. ✅ **Test & Lint**: TypeScript, ESLint, Jest tests
2. ✅ **Security Scan**: npm audit, CodeQL analysis, Trivy scan

## 📊 Monitoring & Analytics

### Test Coverage
- Coverage reports are automatically generated and uploaded to Codecov
- View coverage at: `https://codecov.io/gh/your-username/your-repo`

### Build Status
- Monitor builds at: `https://expo.dev/accounts/your-username/projects/your-project/builds`

### App Analytics
- Firebase Analytics is integrated for production builds
- View analytics at: `https://console.firebase.google.com`

## 🛠️ Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clean and rebuild
npm run prebuild
eas build --platform android --profile preview
```

#### 2. Test Failures
```bash
# Run tests locally
npm test

# Check specific test file
npm test -- TransactionCard.test.tsx
```

#### 3. Linting Issues
```bash
# Fix auto-fixable issues
npm run lint:fix

# Check specific file
npm run lint -- components/TransactionCard.tsx
```

### Environment Issues
```bash
# Check environment variables
eas secret:list

# Update environment variable
eas secret:update --name EXPO_PUBLIC_API_URL --value "new-value"
```

## 📱 App Distribution

### Internal Testing
- Use **Preview** builds for internal testing
- Share via Expo's internal distribution

### Production Release
- Use **Production** builds for app store submission
- Submit using: `npm run submit:android` or `npm run submit:ios`

### Over-the-Air Updates
- Deploy updates without app store review
- Use: `npm run update`

## 🔒 Security

### Automated Security Checks
- **npm audit**: Checks for vulnerable dependencies
- **CodeQL**: GitHub's semantic code analysis for security vulnerabilities
- **Trivy**: Comprehensive vulnerability scanner for dependencies and filesystem
- **TypeScript**: Type safety and potential security issues

### Manual Security Review
- Review all third-party dependencies
- Check for sensitive data in code
- Validate API endpoints and authentication

## 📈 Performance Monitoring

### Build Performance
- Monitor build times in EAS Build dashboard
- Optimize by using build caching

### App Performance
- Firebase Performance Monitoring integration
- Monitor app crashes and performance metrics

## 🎯 Best Practices

### Code Quality
1. **Always run tests before pushing**
2. **Fix linting issues before committing**
3. **Use TypeScript for type safety**
4. **Follow React Native best practices**

### Deployment
1. **Test on multiple devices before release**
2. **Use staged rollouts for major updates**
3. **Monitor crash reports after deployment**
4. **Keep dependencies updated**

### Security
1. **Never commit sensitive data**
2. **Use environment variables for secrets**
3. **Regular security audits**
4. **Keep dependencies updated**

## 📞 Support

For issues with:
- **GitHub Actions**: Check Actions tab in your repository
- **EAS Build**: Visit https://expo.dev/build
- **Expo Updates**: Check https://expo.dev/updates
- **Firebase**: Visit https://console.firebase.google.com

---

**Your CI/CD pipeline is now ready! 🚀** 