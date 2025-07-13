import analytics from '@react-native-firebase/analytics';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyticsEvent } from '../types';

const ANALYTICS_EVENTS_KEY = '@analytics_events';
const MAX_CACHED_EVENTS = 100;

// Export the analytics instance for direct use
export { analytics };

export class AnalyticsService {
  private isOnline: boolean = true;
  private pendingEvents: AnalyticsEvent[] = [];
  
  constructor() {
    this.setupNetworkListener();
    this.loadPendingEvents();
  }

  /**
   * Initialize the analytics service
   * @returns Promise resolving when initialization is complete
   */
  async initialize(): Promise<void> {
    try {
      await this.loadPendingEvents();
      // Check network status
      const netInfo = await NetInfo.fetch();
      this.isOnline = netInfo.isConnected ?? false;
    } catch (error) {
      console.error('Failed to initialize analytics service:', error);
    }
  }
  
  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // If we just came back online, try to send pending events
      if (wasOffline && this.isOnline) {
        this.processPendingEvents();
      }
    });
  }
  
  private async loadPendingEvents() {
    try {
      const eventsJson = await AsyncStorage.getItem(ANALYTICS_EVENTS_KEY);
      if (eventsJson) {
        this.pendingEvents = JSON.parse(eventsJson);
      }
    } catch (error) {
      console.error('Failed to load pending analytics events:', error);
    }
  }
  
  private async savePendingEvents() {
    try {
      // Limit the number of cached events to prevent excessive storage use
      if (this.pendingEvents.length > MAX_CACHED_EVENTS) {
        this.pendingEvents = this.pendingEvents.slice(-MAX_CACHED_EVENTS);
      }
      
      await AsyncStorage.setItem(
        ANALYTICS_EVENTS_KEY,
        JSON.stringify(this.pendingEvents)
      );
    } catch (error) {
      console.error('Failed to save pending analytics events:', error);
    }
  }
  
  async logEvent(name: string, params?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      params,
      timestamp: Date.now(),
    };
    
    if (this.isOnline) {
      try {
        await analytics().logEvent(name, params);
      } catch (error) {
        // If logging fails, queue the event
        this.pendingEvents.push(event);
        await this.savePendingEvents();
        console.warn('Failed to log analytics event, queued for later:', error);
      }
    } else {
      // Queue the event if offline
      this.pendingEvents.push(event);
      await this.savePendingEvents();
    }
  }
  
  async processPendingEvents() {
    if (!this.isOnline || this.pendingEvents.length === 0) {
      return;
    }
    
    const events = [...this.pendingEvents];
    this.pendingEvents = [];
    
    for (const event of events) {
      try {
        await analytics().logEvent(event.name, event.params);
      } catch (error) {
        // Put the event back in the queue
        this.pendingEvents.push(event);
        console.warn('Failed to process pending analytics event:', error);
      }
    }
    
    await this.savePendingEvents();
  }
  
  async setUserId(id: string | null) {
    if (this.isOnline) {
      try {
        await analytics().setUserId(id);
      } catch (error) {
        console.warn('Failed to set analytics user ID:', error);
      }
    }
  }
  
  async setUserProperties(properties: Record<string, string | null>) {
    if (this.isOnline) {
      try {
        await analytics().setUserProperties(properties);
      } catch (error) {
        console.warn('Failed to set analytics user properties:', error);
      }
    }
  }
  
  async clearPendingEvents() {
    this.pendingEvents = [];
    await AsyncStorage.removeItem(ANALYTICS_EVENTS_KEY);
  }

  /**
   * Sync offline events to Firebase Analytics
   * @returns Promise resolving when sync is complete
   */
  async syncOfflineEvents(): Promise<void> {
    await this.processPendingEvents();
  }
}

export const analyticsService = new AnalyticsService();

// Export individual functions for convenience
export const logEvent = (name: string, params?: Record<string, any>) => 
  analyticsService.logEvent(name, params);

export default analyticsService; 