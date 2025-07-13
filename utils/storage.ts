import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utility for handling AsyncStorage operations
 */
export class Storage {
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  private getPrefixedKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key;
  }

  /**
   * Set an item in storage
   * @param key Storage key
   * @param value Value to store
   * @returns Promise resolving when the operation completes
   */
  async set(key: string, value: any): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      await AsyncStorage.setItem(prefixedKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key} in storage:`, error);
      throw error;
    }
  }

  /**
   * Get an item from storage
   * @param key Storage key
   * @returns Promise resolving to the stored value or null if not found
   */
  async get(key: string): Promise<any | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const value = await AsyncStorage.getItem(prefixedKey);
      if (value === null) return null;
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error getting item ${key} from storage:`, error);
      if (error instanceof SyntaxError) {
        throw error;
      }
      return null;
    }
  }

  /**
   * Remove an item from storage
   * @param key Storage key
   * @returns Promise resolving when the operation completes
   */
  async remove(key: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      await AsyncStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Error removing item ${key} from storage:`, error);
      throw error;
    }
  }

  /**
   * Clear all items with the current prefix
   * @returns Promise resolving when the operation completes
   */
  async clear(): Promise<void> {
    try {
      if (!this.prefix) {
        await AsyncStorage.clear();
        return;
      }

      const keys = await AsyncStorage.getAllKeys();
      const prefixedKeys = keys.filter(key => key.startsWith(`${this.prefix}:`));
      if (prefixedKeys.length > 0) {
        await AsyncStorage.multiRemove(prefixedKeys);
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Get all items with the current prefix
   * @returns Promise resolving to an array of {key, value} objects
   */
  async getAll(): Promise<Array<{key: string, value: any}>> {
    try {
      if (!this.prefix) {
        const keys = await AsyncStorage.getAllKeys();
        const keyValuePairs = await AsyncStorage.multiGet(keys);
        return keyValuePairs
          .filter(([_, value]) => value !== null)
          .map(([key, value]) => ({
            key: key,
            value: JSON.parse(value!)
          }));
      }

      const keys = await AsyncStorage.getAllKeys();
      const prefixedKeys = keys.filter(key => key.startsWith(`${this.prefix}:`));
      
      if (prefixedKeys.length === 0) {
        return [];
      }

      const keyValuePairs = await AsyncStorage.multiGet(prefixedKeys);
      return keyValuePairs
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => ({
          key: key.replace(`${this.prefix}:`, ''),
          value: JSON.parse(value!)
        }));
    } catch (error) {
      console.error('Error getting all items from storage:', error);
      if (error instanceof SyntaxError) {
        throw error;
      }
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async getItem(key: string): Promise<string | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      return await AsyncStorage.getItem(prefixedKey);
    } catch (error) {
      console.error(`Error getting item ${key} from storage:`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      await AsyncStorage.setItem(prefixedKey, value);
    } catch (error) {
      console.error(`Error setting item ${key} in storage:`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      await AsyncStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error(`Error removing item ${key} from storage:`, error);
      throw error;
    }
  }

  async multiGet(keys: string[]): Promise<readonly [string, string | null][]> {
    try {
      const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
      return await AsyncStorage.multiGet(prefixedKeys);
    } catch (error) {
      console.error('Error getting multiple items from storage:', error);
      throw error;
    }
  }

  async multiSet(keyValuePairs: readonly [string, string][]): Promise<void> {
    try {
      const prefixedPairs = keyValuePairs.map(([key, value]) => [
        this.getPrefixedKey(key),
        value
      ]) as [string, string][];
      await AsyncStorage.multiSet(prefixedPairs);
    } catch (error) {
      console.error('Error setting multiple items in storage:', error);
      throw error;
    }
  }

  async multiRemove(keys: readonly string[]): Promise<void> {
    try {
      const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
      await AsyncStorage.multiRemove(prefixedKeys);
    } catch (error) {
      console.error('Error removing multiple items from storage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<readonly string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (!this.prefix) return keys;
      return keys.filter(key => key.startsWith(`${this.prefix}:`));
    } catch (error) {
      console.error('Error getting all keys from storage:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const storage = new Storage();

// Analytics-specific storage
export const analyticsStorage = new Storage('analytics'); 