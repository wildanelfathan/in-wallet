import { retryWithBackoff, APIError } from '../apiUtils';

describe('apiUtils', () => {
  describe('APIError', () => {
    it('creates an error with correct properties', () => {
      const error = new APIError('Test error', { status: 400, code: 'TEST_ERROR' });
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.isRetryable).toBe(true);
    });

    it('sets isRetryable correctly', () => {
      const error = new APIError('Test error', { status: 400, isRetryable: false });
      expect(error.isRetryable).toBe(false);
    });
  });

  describe('retryWithBackoff', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('resolves immediately if operation succeeds', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = retryWithBackoff(operation);

      await expect(result).resolves.toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('retries on retryable errors', async () => {
      const error = new APIError('Network error', {
        code: 'NETWORK_ERROR',
        status: 503,
        isRetryable: true,
      });
      const operation = jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValue('success');

      const result = retryWithBackoff(operation, { maxRetries: 3 });

      // Fast-forward timers for each retry
      jest.advanceTimersByTime(1000); // First retry after 1s
      jest.advanceTimersByTime(2000); // Second retry after 2s

      await expect(result).resolves.toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('fails immediately on non-retryable errors', async () => {
      const error = new APIError('Validation error', {
        code: 'VALIDATION_ERROR',
        status: 400,
        isRetryable: false,
      });
      const operation = jest.fn().mockRejectedValue(error);

      await expect(retryWithBackoff(operation)).rejects.toThrow(error);
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('fails after max retries', async () => {
      const error = new APIError('Network error', {
        code: 'NETWORK_ERROR',
        status: 503,
        isRetryable: true,
      });
      const operation = jest.fn().mockRejectedValue(error);

      const result = retryWithBackoff(operation, { maxRetries: 3 });

      // Fast-forward timers for each retry
      jest.advanceTimersByTime(1000); // First retry after 1s
      jest.advanceTimersByTime(2000); // Second retry after 2s
      jest.advanceTimersByTime(4000); // Third retry after 4s

      await expect(result).rejects.toThrow(error);
      expect(operation).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    it('respects custom retry options', async () => {
      const error = new APIError('Network error', {
        code: 'NETWORK_ERROR',
        status: 503,
        isRetryable: true,
      });
      const operation = jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValue('success');

      const result = retryWithBackoff(operation, {
        maxRetries: 2,
        initialDelay: 500,
        maxDelay: 1000,
        backoffFactor: 3,
      });

      // Fast-forward timer for first retry
      jest.advanceTimersByTime(500);

      await expect(result).resolves.toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });
}); 