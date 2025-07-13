declare module '@react-native-firebase/analytics' {
  export interface Analytics {
    logEvent(eventName: string, params?: { [key: string]: any }): Promise<void>;
    setAnalyticsCollectionEnabled(enabled: boolean): Promise<void>;
  }
  export default function analytics(): Analytics;
} 