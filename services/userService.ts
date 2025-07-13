import { handleError } from '../utils/apiUtils';
import { userAPI } from './apiService';

export interface UserProfile {
  id: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  createdAt: string;
  lastSignIn?: string;
  profile: {
    full_name?: string;
    avatar_url?: string;
    phone_number?: string;
    country?: string;
    language?: string;
    created_at?: string;
    updated_at?: string;
    preferences?: Record<string, any>;
  } | null;
  isMerchant: boolean;
  merchant: {
    id: string;
    name: string;
    business_type: string;
    verified: boolean;
  } | null;
  wallets: Array<{
    id: string;
    type: string;
    currency: string;
    balance: number;
  }>;
}

/**
 * Get the current user's profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    return await userAPI.getProfile() as UserProfile;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * Get the user's fiat wallet
 */
export async function getUserFiatWallet() {
  try {
    const profile = await getUserProfile();
    return profile.wallets.find(wallet => wallet.type === 'fiat') || null;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * Get the user's crypto wallet
 */
export async function getUserCryptoWallet() {
  try {
    const profile = await getUserProfile();
    return profile.wallets.find(wallet => wallet.type === 'crypto') || null;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * Check if the user is a merchant
 */
export async function isUserMerchant(): Promise<boolean> {
  try {
    const profile = await getUserProfile();
    return profile.isMerchant;
  } catch (error) {
    throw handleError(error);
  }
} 