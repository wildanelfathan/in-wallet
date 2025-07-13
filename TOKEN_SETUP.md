# Token Setup Guide for CI/CD

This guide will help you get the required token for your CI/CD pipeline.

## 🔑 Required Token

Your CI/CD pipeline needs one token:
1. **EAS_TOKEN** - For Expo Application Services (builds, deployments)

**Note**: Security scanning now uses GitHub's free built-in features (CodeQL and Trivy) instead of Snyk.

---

## 📱 Expo Token (EAS_TOKEN)

### Method 1: Via Expo Website (Recommended)

1. **Go to Expo**: Visit [https://expo.dev](https://expo.dev)
2. **Sign in** with your account (`wildanelfathan`)
3. **Navigate to Account Settings**:
   - Click on your profile picture/username
   - Select "Account Settings"
4. **Find Access Tokens**:
   - Look for "Access Tokens" or "API Tokens" section
   - Click "Create Token" or "Generate Token"
5. **Copy the Token**:
   - The token starts with `exp_`
   - Example: `exp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Method 2: Via EAS CLI (Alternative)

```bash
# You're already logged in, so you can try:
eas account:view
```

---

## 🛡️ Security Scanning (Free GitHub Features)

Your CI/CD pipeline now uses GitHub's free built-in security features:

### CodeQL Analysis
- **What it does**: Scans your code for security vulnerabilities and coding errors
- **Cost**: Completely free
- **Features**: 
  - Detects common security issues
  - Finds coding errors and anti-patterns
  - Provides detailed reports in GitHub Security tab

### Trivy Vulnerability Scanner
- **What it does**: Scans dependencies and filesystem for known vulnerabilities
- **Cost**: Completely free
- **Features**:
  - Scans npm dependencies
  - Checks for known CVEs
  - Generates SARIF reports

### GitHub Security Tab
- **What it does**: Centralized view of all security findings
- **Cost**: Completely free
- **Features**:
  - View all security alerts
  - Track vulnerability status
  - Manage security policies

---

## 🔧 Setting Up GitHub Secrets

### Step 1: Go to Your Repository

1. Navigate to your GitHub repository
2. Click on **Settings** tab
3. Click on **Secrets and variables** → **Actions**

### Step 2: Add Repository Secret

Click **New repository secret** and add:

#### EAS_TOKEN
- **Name**: `EAS_TOKEN`
- **Value**: Your Expo token (starts with `exp_`)

### Step 3: Verify Setup

Your secret should look like this:
```
EAS_TOKEN = exp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note**: No additional tokens needed for security scanning - it uses GitHub's free features!

---

## ✅ Testing Your Token

Use the provided test script to verify your Expo token works:

```bash
node test-tokens.js <EXPO_TOKEN>
```

Example:
```bash
node test-tokens.js exp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Expected output:
```
🔑 Token Testing Script
========================

Testing token...

✅ Expo token is valid!
   Logged in as: wildanelfathan
```

---

## 🚀 Next Steps

Once you have your Expo token set up in GitHub secrets:

1. **Push your code** to trigger the CI/CD pipeline
2. **Monitor the workflow** in GitHub Actions
3. **Check build status** in Expo dashboard
4. **Review security reports** in GitHub Security tab (free!)

---

## 🔒 Security Notes

- **Never commit tokens** to your repository
- **Use GitHub secrets** for all sensitive data
- **Rotate tokens** periodically for security
- **Monitor token usage** in respective dashboards

---

## 🆘 Troubleshooting

### Expo Token Issues
- Ensure you're logged in to the correct Expo account
- Check if the token has the necessary permissions
- Verify the token hasn't expired

### Security Scanning Issues
- GitHub CodeQL and Trivy are completely free
- No additional accounts or tokens needed
- Security reports appear in GitHub Security tab

### GitHub Secrets Issues
- Ensure secrets are added to the correct repository
- Check that secret names match exactly (case-sensitive)
- Verify the repository has Actions enabled 