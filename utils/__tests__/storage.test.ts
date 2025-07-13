import AsyncStorage from '@react-native-async-storage/async-storage';
import { Storage } from '../storage';

jest.mock('@react-native-async-storage/async-storage');

describe('Storage', () => {
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('set', () => {
    it('stores data correctly', async () => {
      const storage = new Storage('test');
      const data = { id: 1, name: 'Test' };

      await storage.set('key', data);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'test:key',
        JSON.stringify(data)
      );
    });

    it('handles errors', async () => {
      const storage = new Storage('test');
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      await expect(storage.set('key', { id: 1 })).rejects.toThrow('Storage error');
    });
  });

  describe('get', () => {
    it('retrieves data correctly', async () => {
      const storage = new Storage('test');
      const data = { id: 1, name: 'Test' };
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(data));

      const result = await storage.get('key');

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('test:key');
      expect(result).toEqual(data);
    });

    it('returns null for non-existent data', async () => {
      const storage = new Storage('test');
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await storage.get('key');

      expect(result).toBeNull();
    });

    it('handles invalid JSON', async () => {
      const storage = new Storage('test');
      mockAsyncStorage.getItem.mockResolvedValue('invalid json');

      await expect(storage.get('key')).rejects.toThrow(SyntaxError);
    });
  });

  describe('remove', () => {
    it('removes data correctly', async () => {
      const storage = new Storage('test');

      await storage.remove('key');

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('test:key');
    });

    it('handles errors', async () => {
      const storage = new Storage('test');
      mockAsyncStorage.removeItem.mockRejectedValue(new Error('Remove error'));

      await expect(storage.remove('key')).rejects.toThrow('Remove error');
    });
  });

  describe('clear', () => {
    it('clears all data with prefix', async () => {
      const storage = new Storage('test');
      mockAsyncStorage.getAllKeys.mockResolvedValue([
        'test:key1',
        'test:key2',
        'other:key',
      ]);

      await storage.clear();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        'test:key1',
        'test:key2',
      ]);
    });

    it('handles empty storage', async () => {
      const storage = new Storage('test');
      mockAsyncStorage.getAllKeys.mockResolvedValue([]);

      await storage.clear();

      expect(mockAsyncStorage.multiRemove).not.toHaveBeenCalled();
    });

    it('handles errors', async () => {
      const storage = new Storage('test');
      mockAsyncStorage.getAllKeys.mockRejectedValue(new Error('Clear error'));

      await expect(storage.clear()).rejects.toThrow('Clear error');
    });
  });

  describe('getAll', () => {
    it('retrieves all data with prefix', async () => {
      const storage = new Storage('test');
      mockAsyncStorage.getAllKeys.mockResolvedValue([
        'test:key1',
        'test:key2',
        'other:key',
      ]);
      mockAsyncStorage.multiGet.mockResolvedValue([
        ['test:key1', JSON.stringify({ id: 1 })],
        ['test:key2', JSON.stringify({ id: 2 })],
      ]);

      const result = await storage.getAll();

      expect(mockAsyncStorage.multiGet).toHaveBeenCalledWith([
        'test:key1',
        'test:key2',
      ]);
      expect(result).toEqual([
        { key: 'key1', value: { id: 1 } },
        { key: 'key2', value: { id: 2 } },
      ]);
    });

    it('handles empty storage', async () => {
      const storage = new Storage('test');
      mockAsyncStorage.getAllKeys.mockResolvedValue([]);

      const result = await storage.getAll();

      expect(result).toEqual([]);
    });

    it('handles invalid JSON', async () => {
      const storage = new Storage('test');
      mockAsyncStorage.getAllKeys.mockResolvedValue(['test:key']);
      mockAsyncStorage.multiGet.mockResolvedValue([['test:key', 'invalid json']]);

      await expect(storage.getAll()).rejects.toThrow(SyntaxError);
    });
  });
}); 