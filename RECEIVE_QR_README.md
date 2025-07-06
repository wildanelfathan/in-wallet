# ReceiveQR Component

A comprehensive React component that generates QR codes for cryptocurrency wallet addresses, making it easy for users to receive payments by scanning the code.

## Features

✅ **QR Code Generation** - Uses `qrcode.react` for high-quality QR codes  
✅ **Multiple Formats** - Address only, payment URI, or custom format  
✅ **Copy to Clipboard** - One-click address copying with visual feedback  
✅ **Mobile Share** - Native mobile sharing support  
✅ **Download QR** - Save QR code as PNG image  
✅ **Amount Display** - Optional payment amount with currency formatting  
✅ **Responsive Design** - Works perfectly on mobile and desktop  
✅ **Custom Styling** - Configurable colors, size, and error correction  
✅ **Accessibility** - Full keyboard navigation and screen reader support  

## Installation

The component requires `qrcode.react`:

```bash
npm install qrcode.react @types/qrcode.react
```

## Basic Usage

```tsx
import ReceiveQR from './components/ReceiveQR';

function App() {
  return (
    <ReceiveQR 
      walletAddress="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
      currency="BTC"
    />
  );
}
```

## Advanced Examples

### Bitcoin with Amount Request
```tsx
<ReceiveQR 
  walletAddress="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
  currency="BTC"
  amount={0.001}
  message="Coffee payment"
  label="Local Coffee Shop"
  format="uri"
/>
```

### Ethereum Payment Request
```tsx
<ReceiveQR 
  walletAddress="0x742d35Cc6634C0532925a3b8D444D4DD73d2c3F4"
  currency="ETH"
  amount={0.05}
  label="NFT Purchase"
  onAddressCopy={() => console.log('Address copied!')}
/>
```

### Custom Styled QR Code
```tsx
<ReceiveQR 
  walletAddress="LdP8Qox1VAhCzLJNqrr74YovaWYyNBUWvL"
  currency="LTC"
  size={300}
  bgColor="#f0f9ff"
  fgColor="#1e40af"
  level="H"
  includeImage={true}
/>
```

### USDC Stablecoin
```tsx
<ReceiveQR 
  walletAddress="0x742d35Cc6634C0532925a3b8D444D4DD73d2c3F4"
  currency="USDC"
  amount={250.00}
  message="Invoice #12345"
  format="uri"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `walletAddress` | `string` | **Required** | Wallet address to encode in QR code |
| `amount` | `number` | `undefined` | Payment amount (optional) |
| `currency` | `string` | `'USD'` | Currency type (BTC, ETH, USDC, etc.) |
| `label` | `string` | `undefined` | Label for payment request |
| `message` | `string` | `undefined` | Message/memo for payment |
| `size` | `number` | `256` | QR code size in pixels |
| `bgColor` | `string` | `'#FFFFFF'` | Background color |
| `fgColor` | `string` | `'#000000'` | Foreground color |
| `level` | `'L'\|'M'\|'Q'\|'H'` | `'M'` | Error correction level |
| `includeImage` | `boolean` | `false` | Show currency overlay |
| `onAddressCopy` | `function` | `undefined` | Callback when address copied |
| `format` | `'address'\|'uri'\|'custom'` | `'address'` | QR content format |
| `customFormat` | `string` | `undefined` | Custom QR content |

## QR Code Formats

### Address Format (Default)
```
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

### URI Format
```
bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001&label=Coffee&message=Payment
```

### Custom Format
```tsx
<ReceiveQR 
  format="custom"
  customFormat="ethereum:0x742d35Cc6634C0532925a3b8D444D4DD73d2c3F4?value=1000000000000000000"
/>
```

## Features Overview

### 📋 Copy to Clipboard
- Click the copy button next to the address
- Visual feedback with checkmark icon
- Fallback support for older browsers
- Triggers optional `onAddressCopy` callback

### 📱 Mobile Share
- Native share functionality on supported devices
- Fallback to copy on unsupported devices
- Shares wallet address with context

### 💾 Download QR Code
- Download QR code as PNG image
- Automatic filename generation
- High-quality canvas export

### 🎨 Visual Design
- Clean, modern card-based design
- Responsive grid layout
- Professional color scheme
- Hover and focus states

### 🔧 Customization
- **Size**: 50px to 1000px+ supported
- **Colors**: Any hex/RGB color combination
- **Error Correction**: L (7%), M (15%), Q (25%), H (30%)
- **Currency Overlay**: Optional branding element

## Error Correction Levels

| Level | Error Correction | Use Case |
|-------|------------------|----------|
| `L` | ~7% | Clean environments |
| `M` | ~15% | Normal usage (default) |
| `Q` | ~25% | Moderate damage expected |
| `H` | ~30% | High damage, small size |

## Mobile Support

### Touch-Friendly
- 44px minimum touch targets
- Responsive breakpoints
- Thumb-accessible buttons

### Native Features
- Share API integration
- Haptic feedback support
- Clipboard API compatibility

## Browser Support

- ✅ Chrome 63+
- ✅ Firefox 53+
- ✅ Safari 13.1+
- ✅ Edge 79+

## Security Considerations

### Address Validation
- Always validate wallet addresses server-side
- Use checksum validation where applicable
- Consider address format validation

### QR Content
- URI format follows BIP-21 standard
- Amount encoding prevents manipulation
- Custom format allows flexibility

## Integration Examples

### With React Hooks
```tsx
import { useState, useEffect } from 'react';

function DynamicReceiveQR() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletAddress()
      .then(setAddress)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ReceiveQR 
      walletAddress={address}
      currency="BTC"
      onAddressCopy={() => console.log('Copied!')}
    />
  );
}
```

### With Form Input
```tsx
function PaymentRequest() {
  const [amount, setAmount] = useState(0);

  return (
    <div>
      <input 
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder="Enter amount"
      />
      
      <ReceiveQR 
        walletAddress="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
        currency="BTC"
        amount={amount || undefined}
        format={amount > 0 ? "uri" : "address"}
      />
    </div>
  );
}
```

### Multiple Wallets
```tsx
function MultiWalletReceive() {
  const wallets = [
    { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', currency: 'BTC' },
    { address: '0x742d35Cc6634C0532925a3b8D444D4DD73d2c3F4', currency: 'ETH' },
    { address: '0x742d35Cc6634C0532925a3b8D444D4DD73d2c3F4', currency: 'USDC' }
  ];

  return (
    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {wallets.map((wallet, index) => (
        <ReceiveQR 
          key={index}
          walletAddress={wallet.address}
          currency={wallet.currency}
          size={200}
        />
      ))}
    </div>
  );
}
```

## Performance Tips

### Optimization
- Use reasonable QR sizes (256px recommended)
- Cache wallet addresses when possible
- Debounce amount changes in forms
- Use error correction level M for most cases

### Bundle Size
- Component adds ~15KB to bundle
- QR generation is client-side only
- No external API dependencies

---

The ReceiveQR component provides a complete solution for cryptocurrency payment requests with professional design, mobile optimization, and comprehensive feature set for production applications.