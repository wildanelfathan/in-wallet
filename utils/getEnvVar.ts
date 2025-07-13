/**
 * Safe environment variable getter with validation and fallbacks
 * @param name Environment variable name
 * @returns Environment variable value or fallback
 */
export function getEnvVar(name: string): string {
  const value = process.env[name];
  
  if (!value || value.trim() === '') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`❌ Environment variable "${name}" must be set in production.`);
    }
    console.warn(`⚠️ Environment variable "${name}" is not set. Using fallback.`);
    return 'DUMMY_FALLBACK';
  }
  
  return value;
}

/**
 * Safe environment variable getter that allows undefined values
 * @param name Environment variable name
 * @returns Environment variable value or undefined
 */
export function getEnvVarOptional(name: string): string | undefined {
  const value = process.env[name];
  
  if (!value || value.trim() === '') {
    if (process.env.NODE_ENV === 'production') {
      console.warn(`⚠️ Optional environment variable "${name}" is not set in production.`);
    } else {
      console.warn(`⚠️ Optional environment variable "${name}" is not set.`);
    }
    return undefined;
  }
  
  return value;
} 