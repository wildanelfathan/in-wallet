<p align="center">
  <img src="packages/mobile/assets/inwallet-logo.png" alt="InWallet Logo with Text" width="200"/>
</p>

<p align="center">
  <img src="packages/mobile/assets/inwallet-icon.png" alt="InWallet Icon Only" width="100"/>
</p>

# Brand Assets

- **InWallet Logo with Text:** Use for documentation headers, onboarding, and marketing materials.
- **InWallet Icon Only:** Use for app icons, splash screens, navigation bars, and compact branding needs.

---

# IN WALLET — Mobile App Feature Breakdown & Architecture

A comprehensive breakdown of **IN WALLET** — a hybrid (crypto + fiat) payment mobile application designed for global use. Built with a backend-first architecture, UI powered by Stitch AI, and structured for developer clarity and scalability.

---

## 📱 App Structure Overview

```plaintext
IN WALLET
├── Onboarding
│   ├── Splash Screen
│   ├── Login / Signup (Email / Social / OTP)
│   ├── KYC (optional)
│
├── Main Navigation
│   ├── Home / Wallet Overview
│   ├── QR Pay (Scan & Generate)
│   ├── Transactions
│   ├── Bill Payment (Global)
│   └── Profile & Settings
│
├── Role-Based Screens
│   ├── User Dashboard
│   └── Merchant Dashboard
```

---

## 🔄 User Flow

```plaintext
App Launch → Auth (Login / Register) → Dashboard (User Type Split)
    ├── If User → Hybrid Wallet Dashboard
    │       ├── Toggle Balance (Show/Hide)
    │       ├── Send / Receive Money (Crypto/Fiat)
    │       ├── QR Payments (Scan/Pay)
    │       ├── View Transactions
    │       └── Bill Payments
    └── If Merchant → Merchant Dashboard
            ├── Generate Payment QR
            ├── Track Sales & Withdrawals
            ├── Transaction Reports
            └── Payout to Bank
```

---

## 📦 Feature Breakdown by Screen

### 1. Onboarding & Authentication

- Splash screen with IN WALLET logo
- Login: Email / OTP / Social login
- Optional biometric login (if device supports)
- Register user profile and role (User / Merchant)
- Optionally start KYC process

### 2. Dashboard (Role-Aware)

#### For User:
- Toggle between **Crypto** and **Fiat** wallet
- Balance summary with **eye icon** to show/hide balance
- Shortcuts:
  - Send Money
  - Receive Money
  - QR Pay
  - Bill Payment
- Widget-style latest transactions

#### For Merchant:
- View today's sales, pending payments
- Generate new QR payment
- Withdraw to fiat
- Access analytics / sales history

### 3. Send Money

- Choose currency (crypto/fiat)
- Enter recipient manually or select from contacts
- Enter amount
- Confirm and submit transaction
- Show loading + receipt

### 4. Receive Money

- Choose type: fiat or crypto
- Generate QR code with wallet address or amount
- Display and share QR

### 5. QR Payments

- Scan merchant QR code
- Autofill amount & merchant details
- Select payment type (crypto/fiat)
- Confirm payment
- Show receipt with tracking ID

### 6. Transaction History

- Tabbed interface:
  - All Transactions
  - Sent
  - Received
  - QR Payments
  - Bills
- Filters: date, type, currency
- View individual receipt details

### 7. Bill Payment (Global)

- List categories (mobile, utilities, streaming, etc.)
- Search provider or select by country
- Enter account or subscriber number
- Choose fiat wallet (Stripe)
- Confirm and pay

### 8. Profile & Settings

- View profile info
- Manage linked wallets
- Change language
- Privacy settings (toggle balance, 2FA, etc.)
- Logout

---

## 🔐 Security Features

- JWT-based authentication (Supabase Auth)
- Role-based access control middleware
- Session timeout & re-authentication
- Biometric lock integration (frontend)
- End-to-end encryption (E2EE) for sensitive transaction fields

---

## 🧠 Backend Architecture Overview

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| API Routes | Next.js API Routes (pages/api)     |
| Auth       | Supabase Auth / Privy              |
| DB         | Supabase (PostgreSQL)              |
| Payment    | Stripe (fiat) + ethers.js (crypto) |
| QR         | `qrcode` NPM library               |
| Deployment | Vercel / Railway                   |

---

## 🎨 Frontend Architecture & Home Screen Design

### Frontend Technology Stack

| Layer/Area         | Technology / Approach                |
|--------------------|-------------------------------------|
| Framework          | React Native (Expo)                  |
| State Management   | Zustand or Redux Toolkit             |
| Navigation         | React Navigation                     |
| UI Components      | NativeBase / React Native Paper      |
| Forms & Validation | React Hook Form + Zod/Yup            |
| API Integration    | React Query (TanStack Query)         |
| Auth Integration   | Supabase Auth SDK                    |
| QR Code            | `react-native-qrcode-svg`            |
| Biometric Auth     | Expo Local Authentication            |
| Localization       | i18next / react-i18next              |
| Theming            | Context API + NativeBase/Custom      |
| Testing            | Jest + React Native Testing Library  |
| OTA Updates        | Expo Updates                         |
| Error Tracking     | Sentry                               |

---

### 🗂️ Frontend Directory Structure (Recommended)

```plaintext
packages/mobile/
├── assets/                # Images, icons, fonts
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── navigation/            # Navigation stacks & tabs
├── screens/               # App screens (Home, Send, Receive, etc.)
├── services/              # API clients, Supabase, Stripe, etc.
├── store/                 # State management (Zustand/Redux)
├── utils/                 # Utility functions/helpers
├── App.tsx                # Entry point
├── theme/                 # Colors, typography, spacing
└── i18n/                  # Localization files
```

---

### ✨ Frontend Best Practices

- **Mobile-first UI:** All screens are designed for optimal mobile experience.
- **Component-driven:** Use atomic design principles for reusable, testable components.
- **Type Safety:** Use TypeScript throughout for reliability and maintainability.
- **API Layer:** Centralize API calls and error handling in `services/`.
- **Secure Storage:** Use Expo SecureStore for sensitive data (tokens, etc.).
- **Accessibility:** Ensure all components are accessible (labels, roles, contrast).
- **Performance:** Lazy load screens, optimize images, and use memoization.
- **OTA Updates:** Leverage Expo for seamless over-the-air updates.
- **Testing:** Write unit and integration tests for all business logic and UI.

---

### 🏠 Home Screen Design (Inspired by ShopeePay)

#### 1. Top Bar
- Time & Status Icons (top left/right)
- App Branding: IN WALLET logo and wallet name
- Balance Visibility Toggle: Eye icon
- Notifications: Bell icon with badge

#### 2. Wallet Overview Cards
- Main Wallet Card: Shows current balance (Fiat/Crypto toggle), quick access to "Top Up" or "Withdraw"
- Linked Accounts: Cards for connected banks, credit, or crypto wallets
- Credit/Loan Card: (Optional) For "PayLater" or credit features

#### 3. Quick Actions Grid
- Top Row (Primary Actions):
  - Top Up
  - Pay (QR Code)
  - Send Money
  - Withdraw
- Second Row (Secondary Actions):
  - Bill Payment
  - Buy Airtime/Data
  - Request Money
  - More (expandable menu)

#### 4. Promotions & Offers
- Promo Banner: Carousel or horizontal scroll for current offers, cashback, or partner promos

#### 5. Shortcuts & Services
- Grid of Services: (e.g., Food Delivery, E-Wallet Transfer, Crypto Exchange, etc.)
- Customizable: User can pin/unpin favorite services

#### 6. Personalized Section
- Special Offers: "Claim your reward" or "Special for you" card
- Recent Activity: Quick view of last transactions

#### 7. Bottom Navigation Bar
- Home
- Wallet
- QR Scan
- History
- Profile

---

#### ✨ Improvements for IN WALLET
- Hybrid Wallet Toggle: Easily switch between Fiat and Crypto balances at the top.
- Personalized Insights: Show spending analytics or savings tips.
- Security Shortcuts: Quick access to lock wallet, enable 2FA, or view security status.
- Accessibility: High-contrast mode, larger tap targets, and voice-over support.
- Customizable Quick Actions: Let users reorder or hide actions they don't use.

---

#### 🧩 Example Directory Structure for Home Screen

```plaintext
packages/mobile/screens/HomePage.tsx
packages/mobile/components/WalletCard.tsx
packages/mobile/components/QuickActionsGrid.tsx
packages/mobile/components/PromoBanner.tsx
packages/mobile/components/ServicesGrid.tsx
packages/mobile/components/RecentActivity.tsx
packages/mobile/components/BottomNavBar.tsx
```

---

#### 🖼️ Example Wireframe (Text)

```plaintext
-------------------------------------------------
| 11:10        IN WALLET [👁️]        [🔔99+]     |
-------------------------------------------------
| [Fiat Wallet] Rp 4.977   [Crypto Wallet] 0.02BTC |
| [Top Up] [Withdraw] [Switch]                    |
-------------------------------------------------
| [Top Up] [Pay QR] [Send Money] [Withdraw]       |
| [Bills] [Airtime] [Request] [More]              |
-------------------------------------------------
| [Promo Banner: Cashback, Offers, etc.]          |
-------------------------------------------------
| [Food] [E-Wallet] [Crypto] [More Services]      |
-------------------------------------------------
| [Special for you: Claim 36,000]                 |
-------------------------------------------------
| [Recent Transactions]                           |
-------------------------------------------------
| [Home] [Wallet] [QR] [History] [Profile]        |
-------------------------------------------------
```

---

#### 🔗 Useful Libraries

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeBase](https://nativebase.io/) / [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [i18next](https://www.i18next.com/)
- [Sentry](https://sentry.io/)

---

## 🔗 API Endpoints Overview (Sample)

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| GET    | `/api/fiat/balance` | Get fiat balance            |
| POST   | `/api/fiat/topup`   | Top-up fiat wallet          |
| POST   | `/api/crypto/send`  | Send crypto                 |
| POST   | `/api/merchant/qr`  | Generate QR code (merchant) |
| POST   | `/api/bills/pay`    | Pay bill                    |
| GET    | `/api/transactions` | List transactions           |

---

## ✅ Developer Notes

- **Mobile-first:** All screens must be optimized for mobile devices.
- **Backend verification:** All transactions must be verified server-side for security.
- **Session ID:** Use session ID for integration with Stitch AI frontend.
- **QR code caching:** QR codes can be cached in Supabase Storage if needed.

---

### 💼 Wallet Screen Design (Enhanced for IN WALLET)

#### 1. Top Bar
- Time & Status Icons (top left/right)
- App Branding: IN WALLET logo and "Wallet"
- Notifications: Bell icon with badge

#### 2. Balance & Price Cards (Top Section)
- **Crypto Price Card:**
  - Shows mock data for a selected cryptocurrency (e.g., "BTC Price: $65,000 (+2.5%)")
  - Percentage change indicator (green for up, red for down)
  - Optionally, allow switching between different cryptos (BTC, ETH, etc.)
- **Fiat Balance Card:**
  - Shows available fiat balance (e.g., "IDR 4,977,000")
  - Optionally, show mock exchange rate (e.g., "1 USD = 15,000 IDR")

#### 3. Quick Actions
- **Top Up:** Add funds to fiat or crypto wallet
- **Withdraw:** Withdraw funds from fiat or crypto wallet
- **Send Money:** Send fiat or crypto to another user
- **Receive Money:** Generate QR or address to receive fiat or crypto

#### 4. Wallet Services Grid
- **Bank Integration:** (e.g., SeaBank)
- **PayLater QR Payment**
- **PayLater Limit Xtra**
- **Ecommerce Payment**
- **Insurance**
- **Wallet Meter** (e.g., spending insights)

#### 5. Insurance Banner
- Highlight insurance offers (e.g., "FREE accident protection Rp1JT")

#### 6. Promotions & Offers
- Carousel or horizontal scroll for current offers (e.g., 0% Installment, cashback, etc.)

#### 7. Installment Section
- 0% Installment offers with "See All" link

#### 8. Bottom Navigation Bar
- Home
- Wallet
- QR Scan
- History
- Profile

---

#### 🖼️ Example Wireframe (Text)

```plaintext
-------------------------------------------------
| 11:11        IN WALLET           [🔔99+] [💳]   |
-------------------------------------------------
| WALLET                                    |
| [BTC]   $65,000 (+2.5%) ↑                 |
| [Fiat]  IDR 4,977,000                     |
-------------------------------------------------
| [Top Up] [Withdraw] [Send] [Receive]      |
-------------------------------------------------
| [SeaBank] [PayLater QR] [Limit Xtra] [Ecom] |
| [Insurance] [Wallet Meter]                |
-------------------------------------------------
| [Insurance Banner: FREE accident cover]   |
-------------------------------------------------
| [Promo Banner: 0% Installment, Cashback]  |
-------------------------------------------------
| [Installment 0%] [See All >]              |
-------------------------------------------------
| [Home] [Wallet] [QR] [History] [Profile]  |
-------------------------------------------------
```

---

#### ✨ Improvements for IN WALLET
- Prominent display of mock crypto price (with real-time dummy update and percentage change)
- Clear fiat balance card
- Quick access to top up, withdraw, send, and receive for both wallet types
- Modular, customizable services grid
- Accessibility and localization support

---

### 📷 QR Page Design (Inspired by ShopeePay)

#### 1. Top Bar
- Time & status icons (top left/right)
- Back button (top left)
- Flashlight toggle (top center)
- Gallery/image picker (top right)

#### 2. Camera View & Scan Area
- Fullscreen camera preview
- Framed scan area (rounded corners or border)
- Instructional text: "Scan QR Code Here"

#### 3. Promo & Info
- Promo or info text below scan area (e.g., "Win an iPhone 15 & Free Coins up to 200K, ShopeePay App Only")
- QRIS or supported QR logo

#### 4. Bottom Action
- Large button: "QR Code" (to switch to QR code generation page)

---

#### 🖼️ Example Wireframe (Text)

```plaintext
-------------------------------------------------
| 11:11        [●]           [🔦]      [🖼️]      |
-------------------------------------------------
| ← |                                 |         |
|                                             |
|         [ Camera Preview ]                  |
|                                             |
|   ┌───────────────────────────────┐         |
|   |      [ Scan Area Frame ]      |         |
|   └───────────────────────────────┘         |
|                                             |
|      Scan QR Code Here                      |
|                                             |
|  Win iPhone 15 & Free Coins up to 200K      |
|  InWallet App Only                         |
|                                             |
|                [QRIS]                       |
|                                             |
| [──────────── QR Code Button ────────────]   |
-------------------------------------------------
```

---

#### ✨ Features for IN WALLET
- Fast QR code scanning (camera integration)
- Flashlight toggle for low-light scanning
- Gallery/image picker for scanning QR from images
- Instructional and promotional text
- QRIS or supported QR logo for trust
- Easy switch to QR code generation (for receiving payments)
- Accessibility: clear instructions, large tap targets

---

### 👤 Profile Page Design (Inspired by ShopeePay, Enhanced for InWallet)

#### 1. Top Bar & Header
- Time & status icons (top left/right)
- Notification bell with badge (top right)
- Banner/button: "Register as Merchant" (if not a merchant)
- User avatar and username (centered)
- QR code shortcut: "Show My QR Code"

#### 2. Profile Actions List
- **My Profile:** View and edit personal info
- **My Bills:** View and pay bills (with promo badge if available)
- **Daily Rewards:** Claim daily bonuses or coins
- **Invite Friends:** Referral program with bonus info
- **My Vouchers:** List of available vouchers
- **Verification:** KYC or account verification status
- **Wallet Meter:** Spending insights or wallet health score
- **Payment Methods:** Manage linked payment options
- **Settings:** App and account settings

#### 3. Bottom Navigation Bar
- Home
- Wallet
- QR
- History
- Profile

---

#### 🖼️ Example Wireframe (Text)

```Profile
-------------------------------------------------
| 20:29        IN WALLET           [🔔99+]       |
-------------------------------------------------
| [Register as Merchant]                        |
|                                               |
|   (Avatar)   username244 [PLUS]               |
|   [Show My QR Code >]                         |
-------------------------------------------------
| [My Profile]                                  |
| [My Bills]        Promo   Free admin fee      |
| [Daily Rewards]   Claim 50K coins             |
| [Invite Friends]  Bonus up to 1M!             |
| [My Vouchers]                                 |
| [Verification]                                |
| [Wallet Meter]    See your score              |
| [Payment Methods]                             |
| [Settings]                                    |
-------------------------------------------------
| [Home] [Wallet] [QR] [History] [Profile]      |
-------------------------------------------------
```

---

#### ✨ Features for InWallet
- User avatar and username display
- QR code shortcut for receiving payments
- Merchant registration prompt (if not a merchant)
- Notification bell with badge
- List of profile-related actions:
  - Edit profile
  - View/pay bills (with promo info)
  - Claim daily rewards
  - Referral/invite friends with bonus
  - Manage vouchers
  - KYC/account verification
  - Wallet health meter/spending insights
  - Manage payment methods
  - Access app/account settings
- Clean, mobile-first layout
- Accessibility: large tap targets, clear icons

---
    
### 📜 History Page Design (Enhanced for IN WALLET)

#### 1. Top Bar
- Time & Status Icons (top left/right)
- App Branding: IN WALLET logo and "History"
- Filter icon (top right)
- Search icon (top right)

#### 2. Transaction Filter Tabs
- **All Transactions**
- **Sent**
- **Received**
- **QR Payments**
- **Bills**

#### 3. Date Groups
- Today
- Yesterday
- This Week
- This Month
- Earlier

#### 4. Transaction List
Each transaction item includes:
- Transaction icon (varies by type)
- Transaction details:
  - Title/Merchant name
  - Date and time
  - Transaction ID (optional)
  - Status (Success, Pending, Failed)
- Amount (+ for received, - for sent)
- Category tag (optional)

#### 5. Filter Modal (when filter icon is tapped)
- **Date Range**
  - Custom date picker
  - Preset ranges (Last 7 days, Last 30 days, etc.)
- **Transaction Type**
  - All
  - Send Money
  - Receive Money
  - QR Payment
  - Bill Payment
  - Top Up
  - Withdraw
- **Status**
  - All
  - Success
  - Pending
  - Failed
- **Amount Range**
  - Min amount
  - Max amount

#### 6. Search Functionality
- Search by:
  - Transaction ID
  - Merchant name
  - Amount
  - Notes/description

#### 7. Transaction Detail View (when item is tapped)
- Full transaction details
- Receipt number
- Payment method used
- Merchant details (if applicable)
- Notes/description
- Share receipt button
- Report issue button

---

#### 🖼️ Example Wireframe (Text)

```plaintext
-------------------------------------------------
| 11:11        History           [🔍] [⚡]       |
-------------------------------------------------
| [All] [Sent] [Received] [QR] [Bills]          |
-------------------------------------------------
| Today                                         |
| [↑] Coffee Shop               - $5.00         |
|     11:00 AM • Success       QR Payment       |
|                                              |
| [↓] John Smith               + $50.00        |
|     09:30 AM • Success       Received        |
-------------------------------------------------
| Yesterday                                     |
| [↑] Electric Bill            - $75.00        |
|     3:45 PM • Success        Bill Payment    |
|                                              |
| [↑] Grocery Store            - $32.50        |
|     2:15 PM • Success        QR Payment      |
-------------------------------------------------
| This Week                                    |
| [transactions...]                            |
-------------------------------------------------
| [Home] [Wallet] [QR] [History] [Profile]     |
-------------------------------------------------
```

---

#### ✨ Features for IN WALLET History
- Real-time transaction updates
- Pull to refresh
- Infinite scroll for older transactions
- Transaction status indicators with colors
- Quick filters via tabs
- Advanced filtering options
- Searchable transaction history
- Detailed transaction view
- Share transaction receipt
- Export transaction history
- Group transactions by date
- Multiple currency support
- Transaction categories with icons
- Quick action shortcuts
- Offline access to recent history

---

#### 🔍 Search & Filter Implementation
- **Instant Search**
  - Search as you type
  - Highlight matching text
  - Recent searches
  - Search suggestions
- **Smart Filters**
  - Combine multiple filters
  - Save filter presets
  - Clear all filters
  - Filter by date range
  - Filter by amount range
  - Filter by status
  - Filter by category
  - Filter by payment method

---

#### 📊 Transaction Categories
- Food & Drinks
- Shopping
- Transportation
- Bills & Utilities
- Entertainment
- Transfer
- Top Up
- Withdraw
- Others

---

#### 💡 UX Improvements
- Swipe actions on transactions
- Pull to refresh animation
- Skeleton loading states
- Error states & retry
- Empty state illustrations
- Filter chips for active filters
- Transaction status colors
- Smooth animations
- Haptic feedback
- Context menus
    