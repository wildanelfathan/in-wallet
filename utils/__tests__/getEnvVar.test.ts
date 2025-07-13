/**
 * @jest-environment node
 */
import { getEnvVar, getEnvVarOptional } from '../getEnvVar';

// Mock process.env
const originalEnv = process.env;

describe('getEnvVar', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns environment variable value when set', () => {
    process.env.TEST_VAR = 'test_value';
    expect(getEnvVar('TEST_VAR')).toBe('test_value');
  });

  it('returns fallback in development when environment variable is not set', () => {
    delete process.env.TEST_VAR;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true
    });
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    expect(getEnvVar('TEST_VAR')).toBe('DUMMY_FALLBACK');
    expect(consoleSpy).toHaveBeenCalledWith('⚠️ Environment variable "TEST_VAR" is not set. Using fallback.');
    
    consoleSpy.mockRestore();
  });

  it('throws error in production when environment variable is not set', () => {
    delete process.env.TEST_VAR;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true
    });
    
    expect(() => getEnvVar('TEST_VAR')).toThrow('❌ Environment variable "TEST_VAR" must be set in production.');
  });

  it('returns fallback when environment variable is empty string', () => {
    process.env.TEST_VAR = '';
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true
    });
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    expect(getEnvVar('TEST_VAR')).toBe('DUMMY_FALLBACK');
    expect(consoleSpy).toHaveBeenCalledWith('⚠️ Environment variable "TEST_VAR" is not set. Using fallback.');
    
    consoleSpy.mockRestore();
  });
});

describe('getEnvVarOptional', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns environment variable value when set', () => {
    process.env.TEST_VAR = 'test_value';
    expect(getEnvVarOptional('TEST_VAR')).toBe('test_value');
  });

  it('returns undefined when environment variable is not set', () => {
    delete process.env.TEST_VAR;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true
    });
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    expect(getEnvVarOptional('TEST_VAR')).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith('⚠️ Optional environment variable "TEST_VAR" is not set.');
    
    consoleSpy.mockRestore();
  });

  it('returns undefined when environment variable is empty string', () => {
    process.env.TEST_VAR = '';
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true
    });
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    expect(getEnvVarOptional('TEST_VAR')).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith('⚠️ Optional environment variable "TEST_VAR" is not set.');
    
    consoleSpy.mockRestore();
  });

  it('logs warning in production when environment variable is not set', () => {
    delete process.env.TEST_VAR;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true
    });
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    expect(getEnvVarOptional('TEST_VAR')).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith('⚠️ Optional environment variable "TEST_VAR" is not set in production.');
    
    consoleSpy.mockRestore();
  });
}); 