import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Define custom error types
export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class APIError extends Error {
  status: number;
  code?: string;
  isRetryable: boolean;

  constructor(message: string, options: { status: number; code?: string; isRetryable?: boolean }) {
    super(message);
    this.name = 'APIError';
    this.status = options.status;
    this.code = options.code;
    this.isRetryable = options.isRetryable ?? true;
  }
}

// Define retry configuration interface
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  shouldRetry?: (error: Error) => boolean;
}

// Default retry configuration
export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000,
  backoffFactor: 2,
  shouldRetry: (error: Error) => error instanceof NetworkError || error instanceof TimeoutError
};

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let attempt = 0;
  let delay = retryOptions.initialDelay;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (!(error instanceof APIError) || !error.isRetryable) {
        throw error;
      }

      attempt++;
      if (attempt > retryOptions.maxRetries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(
        delay * retryOptions.backoffFactor,
        retryOptions.maxDelay
      );
    }
  }
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof APIError) {
    return error.code === 'NETWORK_ERROR';
  }
  return false;
}

export function isAuthenticationError(error: unknown): boolean {
  if (error instanceof APIError) {
    return error.status === 401 || error.status === 403;
  }
  return false;
}

export function isValidationError(error: unknown): boolean {
  if (error instanceof APIError) {
    return error.status === 400 && error.code === 'VALIDATION_ERROR';
  }
  return false;
}

export function createAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    return new APIError(error.message, { status: 500 });
  }

  return new APIError('An unknown error occurred', { status: 500 });
}

export const handleError = (error: unknown): Error => {
  if (error instanceof APIError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new APIError(error.message, { status: 500 });
  }
  
  return new APIError('An unknown error occurred', { status: 500 });
};

export const wait = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const checkConnectivity = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected && netInfo.isInternetReachable;
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> => {
  const finalConfig = { ...defaultRetryConfig, ...config };
  let lastError: Error;
  let attempt = 0;

  while (attempt < finalConfig.maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (finalConfig.shouldRetry && !finalConfig.shouldRetry(lastError)) {
        throw lastError;
      }

      attempt++;
      if (attempt === finalConfig.maxRetries) {
        throw lastError;
      }

      const delay = Math.min(
        finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, attempt - 1),
        finalConfig.maxDelay
      );

      await wait(delay);
    }
  }

  throw lastError!;
};

export const handleAPIResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage: string;
    let errorCode: string | undefined;
    let isRetryable = true;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || 'An error occurred';
      errorCode = errorData.code;
      // Consider certain status codes as non-retryable
      isRetryable = ![400, 401, 403, 404].includes(response.status);
    } catch {
      errorMessage = `HTTP error! status: ${response.status}`;
    }

    throw new APIError(errorMessage, {
      status: response.status,
      code: errorCode,
      isRetryable
    });
  }

  return response;
};

export const createAPIRequest = async (
  url: string,
  options: RequestInit = {},
  retryConfig?: RetryConfig
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await withRetry(
      async () => {
        const fetchOptions: RequestInit = {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        };

        try {
          const response = await fetch(url, fetchOptions);
          return await handleAPIResponse(response);
        } catch (error) {
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              throw new TimeoutError();
            }
            if (!navigator.onLine || error.message.includes('network request failed')) {
              throw new NetworkError();
            }
          }
          throw error;
        }
      },
      retryConfig
    );

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}; 

// Fix the fetchWithTimeout function
export const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs: number = 30000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new TimeoutError(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw new NetworkError(`Failed to fetch from ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}; 