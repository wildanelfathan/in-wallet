import analytics from '@react-native-firebase/analytics';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import { analyticsStorage } from '../../utils/storage';
import { AnalyticsService } from '../analyticsService';

jest.mock('@react-native-firebase/analytics');
jest.mock('@react-native-community/netinfo');
jest.mock('../../utils/storage');

const mockAnalytics = analytics as jest.Mock;
const mockNetInfo = NetInfo as jest.Mocked<typeof NetInfo>;
const mockStorage = analyticsStorage as jest.Mocked<typeof analyticsStorage>;

const connectedState: NetInfoState = {
  type: NetInfoStateType.wifi,
  isConnected: true,
  isInternetReachable: true,
  details: {
    isConnectionExpensive: false,
    ssid: null,
    bssid: null,
    strength: null,
    ipAddress: null,
    subnet: null,
    frequency: null,
    linkSpeed: null,
    rxLinkSpeed: null,
    txLinkSpeed: null
  }
};

const disconnectedState: NetInfoState = {
  type: NetInfoStateType.none,
  isConnected: false,
  isInternetReachable: false,
  details: null
};

describe('analyticsService', () => {
  let analyticsService: AnalyticsService;
  let mockLogEvent: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogEvent = jest.fn();
    mockAnalytics.mockReturnValue({
      logEvent: mockLogEvent,
      setAnalyticsCollectionEnabled: jest.fn().mockResolvedValue(undefined)
    });
    mockNetInfo.fetch.mockResolvedValue(connectedState);
    mockStorage.getItem.mockResolvedValue(null);
    mockStorage.setItem.mockResolvedValue(undefined);
    mockStorage.removeItem.mockResolvedValue(undefined);
    
    analyticsService = new AnalyticsService();
  });

  it('should initialize analytics and process offline events', async () => {
    mockNetInfo.fetch.mockResolvedValue(connectedState);
    mockStorage.getItem.mockResolvedValue(JSON.stringify([
      { name: 'offline_event', params: { test: true }, timestamp: Date.now() - 1000 }
    ]));

    await analyticsService.initialize();

    expect(mockLogEvent).toHaveBeenCalledWith('offline_event', { test: true });
    expect(mockStorage.removeItem).toHaveBeenCalledWith('offlineEvents');
  });

  it('should queue events when offline', async () => {
    mockNetInfo.fetch.mockResolvedValue(disconnectedState);
    
    const eventName = 'test_event';
    const params = { value: 123 };
    
    await analyticsService.logEvent(eventName, params);
    
    expect(mockLogEvent).not.toHaveBeenCalled();
    expect(mockStorage.setItem).toHaveBeenCalledWith('offlineEvents', expect.any(String));
    
    const storedEvents = JSON.parse(mockStorage.setItem.mock.calls[0][1]);
    expect(storedEvents).toHaveLength(1);
    expect(storedEvents[0].name).toBe(eventName);
    expect(storedEvents[0].params).toEqual(params);
  });

  it('should send events directly when online', async () => {
    mockNetInfo.fetch.mockResolvedValue(connectedState);
    
    const eventName = 'test_event';
    const params = { value: 123 };
    
    await analyticsService.logEvent(eventName, params);
    
    expect(mockLogEvent).toHaveBeenCalledWith(eventName, params);
    expect(mockStorage.setItem).not.toHaveBeenCalled();
  });

  it('should handle errors when syncing offline events', async () => {
    mockNetInfo.fetch.mockResolvedValue(disconnectedState);
    mockStorage.getItem.mockResolvedValue(JSON.stringify([
      { name: 'offline_event', params: { test: true }, timestamp: Date.now() - 1000 }
    ]));
    
    await analyticsService.syncOfflineEvents();
    
    expect(mockLogEvent).not.toHaveBeenCalled();
    expect(mockStorage.removeItem).not.toHaveBeenCalled();
  });

  it('should handle empty offline events', async () => {
    mockNetInfo.fetch.mockResolvedValue(connectedState);
    mockStorage.getItem.mockResolvedValue(null);
    
    await analyticsService.syncOfflineEvents();
    
    expect(mockLogEvent).not.toHaveBeenCalled();
    expect(mockStorage.removeItem).not.toHaveBeenCalled();
  });

  it('should append to existing offline events', async () => {
    mockNetInfo.fetch.mockResolvedValue(disconnectedState);
    mockStorage.getItem.mockResolvedValue(JSON.stringify([
      { name: 'existing_event', params: { old: true }, timestamp: Date.now() - 2000 }
    ]));
    
    await analyticsService.logEvent('new_event', { new: true });
    
    expect(mockLogEvent).not.toHaveBeenCalled();
    
    const storedEvents = JSON.parse(mockStorage.setItem.mock.calls[0][1]);
    expect(storedEvents).toHaveLength(2);
    expect(storedEvents[0].name).toBe('existing_event');
    expect(storedEvents[1].name).toBe('new_event');
  });
}); 