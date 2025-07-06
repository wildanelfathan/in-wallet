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
                    {formatCurrency(balance, currency)}
                  </span>
                </div>
                
                {!compact && (
                  <div className="balance-details">
                    <p className="numeric-balance">
                      <span className="label">Amount:</span>
                      <span className="value">{formatNumber(balance)}</span>
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
        }

        .currency-amount {
          font-size: 2.5rem;
          font-weight: 700;
          color: #059669;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

          .card-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;