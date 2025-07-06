import React, { useState, useEffect } from 'react';

interface WalletBalance {
  walletId: string;
  balance: number;
}

interface DashboardProps {
  walletId: string;
  apiBaseUrl?: string;
  currency?: string;
  autoRefreshInterval?: number; // in milliseconds
  compact?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  walletId, 
  apiBaseUrl = '/api',
  currency = 'USD',
  autoRefreshInterval,
  compact = false
}) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showBalance, setShowBalance] = useState<boolean>(true);

  // Format number with thousand separators and currency symbol
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    // Handle cryptocurrency formatting
    if (currency === 'BTC' || currency === 'ETH' || currency === 'USDC' || currency === 'USDT') {
      return `${formatNumber(amount)} ${currency}`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 8, // Support for crypto decimals
    }).format(amount);
  };

  // Format number with thousand separators (without currency symbol)
  const formatNumber = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(amount);
  };

  // Fetch wallet balance from API
  const fetchWalletBalance = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/wallet/balance/${walletId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WalletBalance = await response.json();
      setBalance(data.balance);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet balance';
      setError(errorMessage);
      console.error('Error fetching wallet balance:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh balance
  const handleRefresh = (): void => {
    fetchWalletBalance();
  };

  // Toggle balance visibility
  const toggleBalanceVisibility = (): void => {
    setShowBalance(!showBalance);
  };

  // Mask balance with asterisks
  const getMaskedBalance = (currency: string): string => {
    if (currency === 'BTC' || currency === 'ETH' || currency === 'USDC' || currency === 'USDT') {
      return `••••••• ${currency}`;
    }
    return '$•••,•••.••';
  };

  // Fetch balance on component mount and when walletId changes
  useEffect(() => {
    if (walletId) {
      fetchWalletBalance();
    }
  }, [walletId, apiBaseUrl]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefreshInterval && autoRefreshInterval > 0) {
      const interval = setInterval(() => {
        fetchWalletBalance();
      }, autoRefreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval, walletId]);

      return (
      <div className="dashboard-container">
        <div className={`wallet-balance-card ${compact ? 'compact' : ''}`}>
        <div className="card-header">
          <h2 className="card-title">Wallet Balance</h2>
          <button 
            onClick={handleRefresh} 
            disabled={loading}
            className="refresh-button"
            aria-label="Refresh balance"
          >
            {loading ? '⟳' : '↻'}
          </button>
        </div>
        
        <div className="card-content">
          <div className="wallet-info">
            <p className="wallet-id">
              <span className="label">Wallet ID:</span>
              <span className="value">{walletId}</span>
            </p>
          </div>

          <div className="balance-display">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading balance...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p className="error-message">❌ {error}</p>
                <button onClick={handleRefresh} className="retry-button">
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && balance !== null && (
              <div className="balance-info">
                <div className="primary-balance">
                  <span className="currency-amount">
                    {showBalance ? formatCurrency(balance, currency) : getMaskedBalance(currency)}
                  </span>
                  <button 
                    onClick={toggleBalanceVisibility}
                    className="eye-toggle-button"
                    aria-label={showBalance ? "Hide balance" : "Show balance"}
                    title={showBalance ? "Hide balance" : "Show balance"}
                  >
                    {showBalance ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      </svg>
                    )}
                  </button>
                </div>
                
                {!compact && (
                  <div className="balance-details">
                    <p className="numeric-balance">
                      <span className="label">Amount:</span>
                      <span className="value">
                        {showBalance ? formatNumber(balance) : '•••,•••.••'}
                      </span>
                    </p>
                    
                    <p className="last-updated">
                      <span className="label">Last updated:</span>
                      <span className="value">
                        {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
                      </span>
                    </p>
                    
                    {autoRefreshInterval && (
                      <p className="auto-refresh">
                        <span className="label">Auto-refresh:</span>
                        <span className="value">Every {Math.round(autoRefreshInterval / 1000)}s</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

        .wallet-balance-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .card-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .refresh-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .refresh-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .card-content {
          padding: 24px;
        }

        .wallet-info {
          margin-bottom: 20px;
        }

        .wallet-id {
          margin: 0;
          font-size: 0.9rem;
          color: #64748b;
        }

        .label {
          font-weight: 500;
          margin-right: 8px;
        }

        .value {
          color: #1e293b;
          font-family: 'Monaco', 'Courier New', monospace;
        }

        .balance-display {
          min-height: 120px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          color: #64748b;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state {
          text-align: center;
          padding: 40px 0;
        }

        .error-message {
          color: #dc2626;
          margin-bottom: 16px;
          font-weight: 500;
        }

        .retry-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .retry-button:hover {
          background: #b91c1c;
        }

        .balance-info {
          text-align: center;
        }

        .primary-balance {
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .currency-amount {
          font-size: 2.5rem;
          font-weight: 700;
          color: #059669;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .eye-toggle-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 40px;
          min-height: 40px;
          opacity: 0.7;
          color: #059669;
        }

        .eye-toggle-button svg {
          width: 24px;
          height: 24px;
        }

        .eye-toggle-button:hover {
          background: rgba(5, 150, 105, 0.1);
          opacity: 1;
          transform: scale(1.1);
        }

        .eye-toggle-button:active {
          transform: scale(0.95);
        }

        .eye-toggle-button:focus {
          outline: 2px solid #059669;
          outline-offset: 2px;
        }

        .balance-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-top: 1px solid #e2e8f0;
          padding-top: 16px;
        }

        .numeric-balance,
        .last-updated,
        .auto-refresh {
          margin: 0;
          font-size: 0.9rem;
          color: #64748b;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .auto-refresh .value {
          color: #059669;
          font-size: 0.8rem;
        }

        .balance-details .value {
          font-weight: 600;
          color: #1e293b;
        }

        /* Compact mode styles */
        .wallet-balance-card.compact {
          max-width: 300px;
        }

        .wallet-balance-card.compact .card-content {
          padding: 16px;
        }

        .wallet-balance-card.compact .currency-amount {
          font-size: 1.8rem;
        }

        .wallet-balance-card.compact .wallet-info {
          margin-bottom: 12px;
        }

        @media (max-width: 480px) {
          .dashboard-container {
            padding: 12px;
          }

          .card-header {
            padding: 16px;
          }

          .card-title {
            font-size: 1.25rem;
          }

          .currency-amount {
            font-size: 2rem;
          }

          .eye-toggle-button {
            min-width: 36px;
            min-height: 36px;
            padding: 6px;
          }

          .eye-toggle-button svg {
            width: 20px;
            height: 20px;
          }

          .card-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;