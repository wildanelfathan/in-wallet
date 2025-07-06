import React, { useState, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface ReceiveQRProps {
  walletAddress: string;
  amount?: number;
  currency?: string;
  label?: string;
  message?: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeImage?: boolean;
  onAddressCopy?: () => void;
  format?: 'address' | 'uri' | 'custom';
  customFormat?: string;
}

const ReceiveQR: React.FC<ReceiveQRProps> = ({
  walletAddress,
  amount,
  currency = 'USD',
  label,
  message,
  size = 256,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  level = 'M',
  includeImage = false,
  onAddressCopy,
  format = 'address',
  customFormat
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [shareSupported, setShareSupported] = useState<boolean>(
    typeof navigator !== 'undefined' && 'share' in navigator
  );

  // Generate QR code content based on format
  const generateQRContent = (): string => {
    switch (format) {
      case 'uri':
        // Create payment URI (supports Bitcoin-style URIs)
        let uri = `${currency.toLowerCase()}:${walletAddress}`;
        const params: string[] = [];
        
        if (amount) {
          params.push(`amount=${amount}`);
        }
        if (label) {
          params.push(`label=${encodeURIComponent(label)}`);
        }
        if (message) {
          params.push(`message=${encodeURIComponent(message)}`);
        }
        
        if (params.length > 0) {
          uri += `?${params.join('&')}`;
        }
        
        return uri;
        
      case 'custom':
        return customFormat || walletAddress;
        
      case 'address':
      default:
        return walletAddress;
    }
  };

  // Copy wallet address to clipboard
  const copyToClipboard = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      onAddressCopy?.();
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = walletAddress;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopied(true);
        onAddressCopy?.();
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      
      document.body.removeChild(textArea);
    }
  }, [walletAddress, onAddressCopy]);

  // Share functionality (mobile)
  const shareAddress = useCallback(async (): Promise<void> => {
    if (shareSupported) {
      try {
        await navigator.share({
          title: 'Wallet Address',
          text: `Send ${currency} to this address: ${walletAddress}`,
          url: generateQRContent()
        });
      } catch (error) {
        console.error('Share failed:', error);
        // Fallback to copy
        copyToClipboard();
      }
    }
  }, [shareSupported, currency, walletAddress, copyToClipboard, generateQRContent]);

  // Format wallet address for display (truncate middle)
  const formatAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
    if (address.length <= startChars + endChars) {
      return address;
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  };

  // Download QR code as image
  const downloadQR = useCallback((): void => {
    const canvas = document.querySelector('#qr-code-canvas canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `wallet-qr-${walletAddress.slice(0, 8)}.png`;
      link.href = url;
      link.click();
    }
  }, [walletAddress]);

  const qrContent = generateQRContent();

  return (
    <div className="receive-qr-container">
      <div className="qr-card">
        {/* Header */}
        <div className="qr-header">
          <h3 className="qr-title">Receive {currency}</h3>
          {label && <p className="qr-label">{label}</p>}
        </div>

        {/* QR Code */}
        <div className="qr-code-wrapper" id="qr-code-canvas">
          <QRCodeCanvas
            value={qrContent}
            size={size}
            bgColor={bgColor}
            fgColor={fgColor}
            level={level}
            includeMargin={true}
          />
          
          {includeImage && (
            <div className="qr-overlay">
              <div className="qr-logo">
                {currency}
              </div>
            </div>
          )}
        </div>

        {/* Amount Display */}
        {amount && (
          <div className="amount-display">
            <span className="amount-label">Requested Amount:</span>
            <span className="amount-value">
              {new Intl.NumberFormat('en-US', {
                style: currency === 'USD' ? 'currency' : 'decimal',
                currency: currency === 'USD' ? 'USD' : undefined,
                minimumFractionDigits: 2,
                maximumFractionDigits: 8
              }).format(amount)} {currency !== 'USD' ? currency : ''}
            </span>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="message-display">
            <p className="message-text">{message}</p>
          </div>
        )}

        {/* Wallet Address */}
        <div className="address-section">
          <label className="address-label">Wallet Address:</label>
          <div className="address-container">
            <span className="address-full" title={walletAddress}>
              {formatAddress(walletAddress)}
            </span>
            <button
              onClick={copyToClipboard}
              className={`copy-button ${copied ? 'copied' : ''}`}
              aria-label="Copy wallet address"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              )}
            </button>
          </div>
          <div className="address-full-text">
            <code>{walletAddress}</code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={downloadQR} className="action-button download-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download QR
          </button>
          
          {shareSupported ? (
            <button onClick={shareAddress} className="action-button share-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
              </svg>
              Share
            </button>
          ) : (
            <button onClick={copyToClipboard} className="action-button copy-full-button">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              Copy Address
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="instructions">
          <p className="instruction-text">
            Scan this QR code with any compatible wallet app to send {currency} to this address.
          </p>
        </div>
      </div>

      <style>{`
        .receive-qr-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .qr-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          padding: 24px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .qr-header {
          margin-bottom: 24px;
        }

        .qr-title {
          margin: 0 0 8px 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
        }

        .qr-label {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .qr-code-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 20px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .qr-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 8px;
          padding: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .qr-logo {
          font-weight: 700;
          font-size: 0.8rem;
          color: #059669;
        }

        .amount-display {
          margin-bottom: 20px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .amount-label {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 4px;
        }

        .amount-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #059669;
        }

        .message-display {
          margin-bottom: 20px;
          padding: 12px;
          background: #fef3c7;
          border-radius: 8px;
          border: 1px solid #fbbf24;
        }

        .message-text {
          margin: 0;
          color: #92400e;
          font-size: 0.9rem;
        }

        .address-section {
          margin-bottom: 24px;
          text-align: left;
        }

        .address-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .address-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
        }

        .address-full {
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.9rem;
          color: #1e293b;
          flex: 1;
        }

        .copy-button {
          background: none;
          border: none;
          color: #059669;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .copy-button:hover {
          background: #dcfce7;
        }

        .copy-button.copied {
          color: #16a34a;
        }

        .address-full-text {
          background: #f1f5f9;
          border-radius: 6px;
          padding: 8px;
          font-size: 0.75rem;
          word-break: break-all;
        }

        .address-full-text code {
          color: #475569;
          background: none;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .download-button {
          background: #3b82f6;
          color: white;
        }

        .download-button:hover {
          background: #2563eb;
        }

        .share-button,
        .copy-full-button {
          background: #059669;
          color: white;
        }

        .share-button:hover,
        .copy-full-button:hover {
          background: #047857;
        }

        .instructions {
          text-align: center;
        }

        .instruction-text {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .receive-qr-container {
            padding: 12px;
          }

          .qr-card {
            padding: 16px;
          }

          .qr-title {
            font-size: 1.25rem;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          .address-container {
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }

          .address-full {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ReceiveQR;