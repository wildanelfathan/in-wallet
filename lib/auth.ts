import { PrivyClient } from '@privy-io/server-auth';

// Initialize Privy client
const privy = new PrivyClient(
  process.env.PRIVY_APP_ID || '',
  process.env.PRIVY_APP_SECRET || ''
);

export interface AuthUser {
  id: string;
  appId: string;
  issuer: string;
  sessionId: string;
  issuedAt: number;
  expiration: number;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

/**
 * Verify and authenticate a user using their Privy access token
 * @param accessToken - The Privy access token from the client
 * @returns Promise<AuthResult> - Authentication result with user data
 */
export async function loginUser(accessToken: string): Promise<AuthResult> {
  try {
    if (!accessToken) {
      return {
        success: false,
        error: 'Access token is required',
      };
    }

    // Verify the access token with Privy
    const verifiedClaims = await privy.verifyAuthToken(accessToken);
    
    if (!verifiedClaims) {
      return {
        success: false,
        error: 'Invalid or expired token',
      };
    }

    // Transform verified claims to our AuthUser format
    const authUser: AuthUser = {
      id: verifiedClaims.userId,
      appId: verifiedClaims.appId,
      issuer: verifiedClaims.issuer,
      sessionId: verifiedClaims.sessionId,
      issuedAt: new Date(verifiedClaims.issuedAt).getTime(),
      expiration: new Date(verifiedClaims.expiration).getTime(),
    };

    return {
      success: true,
      user: authUser,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Get current user information from access token
 * @param accessToken - The Privy access token
 * @returns Promise<AuthResult> - Current user data
 */
export async function getCurrentUser(accessToken: string): Promise<AuthResult> {
  try {
    if (!accessToken) {
      return {
        success: false,
        error: 'Access token is required',
      };
    }

    // Verify the token and get user data
    const verifiedClaims = await privy.verifyAuthToken(accessToken);
    
    if (!verifiedClaims) {
      return {
        success: false,
        error: 'Invalid or expired token',
      };
    }

    const authUser: AuthUser = {
      id: verifiedClaims.userId,
      appId: verifiedClaims.appId,
      issuer: verifiedClaims.issuer,
      sessionId: verifiedClaims.sessionId,
      issuedAt: new Date(verifiedClaims.issuedAt).getTime(),
      expiration: new Date(verifiedClaims.expiration).getTime(),
    };

    return {
      success: true,
      user: authUser,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      error: 'Failed to get user information',
    };
  }
}

/**
 * Handle user logout
 * @param userId - The user ID to logout
 * @returns Promise<AuthResult> - Logout result
 */
export async function logoutUser(userId?: string): Promise<AuthResult> {
  try {
    // For server-side logout, we typically just return success
    // The actual token invalidation happens on the client side with Privy
    
    console.log(`User ${userId || 'unknown'} logged out`);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Logout failed',
    };
  }
}

/**
 * Middleware helper to extract user from request headers
 * @param authHeader - Authorization header value
 * @returns Promise<AuthUser | null> - User data or null if not authenticated
 */
export async function getUserFromAuthHeader(authHeader: string): Promise<AuthUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const result = await getCurrentUser(token);
  
  return result.success ? result.user || null : null;
}

/**
 * Utility function to check if user is authenticated
 * @param accessToken - The Privy access token
 * @returns Promise<boolean> - Whether user is authenticated
 */
export async function isAuthenticated(accessToken: string): Promise<boolean> {
  const result = await getCurrentUser(accessToken);
  return result.success;
}