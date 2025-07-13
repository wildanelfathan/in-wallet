import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export type Wallet = {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const useWallet = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [activeWallet, setActiveWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadWallets();
    }
  }, [user]);

  const loadWallets = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      if (data) {
        setWallets(data);
        // Set first wallet as active if none is active
        if (!activeWallet && data.length > 0) {
          setActiveWallet(data[0]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallets');
    } finally {
      setLoading(false);
    }
  };

  const selectWallet = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (wallet) {
      setActiveWallet(wallet);
    }
  };

  const refreshBalance = async (walletId?: string) => {
    try {
      const targetWalletId = walletId || activeWallet?.id;
      if (!targetWalletId) return;

      const { data, error: fetchError } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', targetWalletId)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setWallets(prev => prev.map(w => 
          w.id === targetWalletId ? data : w
        ));
        if (activeWallet?.id === targetWalletId) {
          setActiveWallet(data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh balance');
    }
  };

  return {
    wallets,
    activeWallet,
    loading,
    error,
    selectWallet,
    refreshBalance,
    reload: loadWallets,
  };
}; 