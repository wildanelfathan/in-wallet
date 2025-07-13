import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Wallet: undefined;
  History: undefined;
  Profile: undefined;
  EditProfile: undefined;
  QR: undefined;
  BillPayment: undefined;
  BillReceipt: {
    bill: any;
  };
  Receipt: {
    transactionId: string;
    receiptUrl: string;
  };
  KYC: undefined;
  Referral: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 