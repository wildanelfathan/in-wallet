import { Request } from 'express';

// Type for translation keys
export type TranslationKey = 
  | 'auth.emailRequired'
  | 'auth.loginSuccess'
  | 'auth.userInfo'
  | 'wallet.notFound'
  | 'wallet.balanceRetrieved'
  | 'wallet.invalidInput'
  | 'wallet.walletNotFound'
  | 'wallet.insufficientBalance'
  | 'wallet.transactionSuccess'
  | 'wallet.receivedTransactions'
  | 'wallet.transactionHistory'
  | 'merchant.info'
  | 'merchant.nameRequired'
  | 'merchant.registrationSuccess'
  | 'merchant.dashboardInfo'
  | 'admin.info'
  | 'admin.usersRetrieved'
  | 'admin.transactionsRetrieved'
  | 'server.running'
  | 'common.error'
  | 'common.success'
  | 'common.notFound'
  | 'common.unauthorized'
  | 'common.badRequest';

// Helper function for type-safe translations
export const t = (req: Request, key: TranslationKey, options?: any) => {
  return req.t(key, options);
};

// Language detection helper
export const getCurrentLanguage = (req: Request): string => {
  return req.language || 'en';
};

// Available languages
export const SUPPORTED_LANGUAGES = ['en', 'id', 'es'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];