/**
 * Client-Side Rate Limiting Utility
 * Prevents abuse by limiting user actions
 */

import { RATE_LIMITS } from "./inputValidation";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory storage for rate limiting (per session)
// In production, consider using localStorage or a backend service
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Cleans up expired rate limit entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Checks if an action is allowed based on rate limits
 */
export function checkRateLimit(
  action: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  cleanupExpiredEntries();

  const key = action;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newEntry);
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: newEntry.resetTime,
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Checks if user can send a message
 */
export function canSendMessage(userId?: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  error?: string;
} {
  const userKey = userId ? `message:${userId}` : "message:anonymous";
  
  // Check per-minute limit
  const minuteCheck = checkRateLimit(
    `${userKey}:minute`,
    RATE_LIMITS.MESSAGES_PER_MINUTE,
    60 * 1000
  );

  if (!minuteCheck.allowed) {
    const secondsUntilReset = Math.ceil((minuteCheck.resetTime - Date.now()) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: minuteCheck.resetTime,
      error: `Rate limit exceeded. Please wait ${secondsUntilReset} seconds before sending another message.`,
    };
  }

  // Check per-hour limit
  const hourCheck = checkRateLimit(
    `${userKey}:hour`,
    RATE_LIMITS.MESSAGES_PER_HOUR,
    60 * 60 * 1000
  );

  if (!hourCheck.allowed) {
    const minutesUntilReset = Math.ceil((hourCheck.resetTime - Date.now()) / (60 * 1000));
    return {
      allowed: false,
      remaining: 0,
      resetTime: hourCheck.resetTime,
      error: `Hourly limit exceeded. Please wait ${minutesUntilReset} minutes before sending more messages.`,
    };
  }

  return {
    allowed: true,
    remaining: Math.min(minuteCheck.remaining, hourCheck.remaining),
    resetTime: Math.min(minuteCheck.resetTime, hourCheck.resetTime),
  };
}

/**
 * Checks if user can make an API call
 */
export function canMakeAPICall(userId?: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  error?: string;
} {
  const userKey = userId ? `api:${userId}` : "api:anonymous";
  
  // Check per-minute limit
  const minuteCheck = checkRateLimit(
    `${userKey}:minute`,
    RATE_LIMITS.API_CALLS_PER_MINUTE,
    60 * 1000
  );

  if (!minuteCheck.allowed) {
    const secondsUntilReset = Math.ceil((minuteCheck.resetTime - Date.now()) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: minuteCheck.resetTime,
      error: `API rate limit exceeded. Please wait ${secondsUntilReset} seconds.`,
    };
  }

  // Check per-hour limit
  const hourCheck = checkRateLimit(
    `${userKey}:hour`,
    RATE_LIMITS.API_CALLS_PER_HOUR,
    60 * 60 * 1000
  );

  if (!hourCheck.allowed) {
    const minutesUntilReset = Math.ceil((hourCheck.resetTime - Date.now()) / (60 * 1000));
    return {
      allowed: false,
      remaining: 0,
      resetTime: hourCheck.resetTime,
      error: `Hourly API limit exceeded. Please wait ${minutesUntilReset} minutes.`,
    };
  }

  return {
    allowed: true,
    remaining: Math.min(minuteCheck.remaining, hourCheck.remaining),
    resetTime: Math.min(minuteCheck.resetTime, hourCheck.resetTime),
  };
}

/**
 * Resets rate limit for a specific action (useful for testing or admin)
 */
export function resetRateLimit(action: string): void {
  rateLimitStore.delete(action);
}

/**
 * Gets current rate limit status
 */
export function getRateLimitStatus(action: string): {
  count: number;
  remaining: number;
  resetTime: number;
} | null {
  const entry = rateLimitStore.get(action);
  if (!entry) {
    return null;
  }

  const now = Date.now();
  if (now > entry.resetTime) {
    rateLimitStore.delete(action);
    return null;
  }

  // This is a simplified version - you'd need to pass the limit to calculate remaining
  return {
    count: entry.count,
    remaining: 0, // Would need limit parameter to calculate
    resetTime: entry.resetTime,
  };
}

/**
 * Cleanup expired entries periodically (call this on app mount/unmount)
 */
export function startRateLimitCleanup(intervalMs: number = 60000): () => void {
  const intervalId = setInterval(() => {
    cleanupExpiredEntries();
  }, intervalMs);

  // Return cleanup function
  return () => clearInterval(intervalId);
}

/**
 * Checks if user can create a new account (signup rate limiting)
 */
export function canSignUp(ipAddress?: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  error?: string;
} {
  const userKey = ipAddress ? `signup:${ipAddress}` : "signup:anonymous";
  
  // Check per-hour limit
  const hourCheck = checkRateLimit(
    `${userKey}:hour`,
    RATE_LIMITS.SIGNUPS_PER_HOUR,
    60 * 60 * 1000
  );

  if (!hourCheck.allowed) {
    const minutesUntilReset = Math.ceil((hourCheck.resetTime - Date.now()) / (60 * 1000));
    return {
      allowed: false,
      remaining: 0,
      resetTime: hourCheck.resetTime,
      error: `Too many signup attempts. Please wait ${minutesUntilReset} minutes before trying again.`,
    };
  }

  // Check per-day limit
  const dayCheck = checkRateLimit(
    `${userKey}:day`,
    RATE_LIMITS.SIGNUPS_PER_DAY,
    24 * 60 * 60 * 1000
  );

  if (!dayCheck.allowed) {
    const hoursUntilReset = Math.ceil((dayCheck.resetTime - Date.now()) / (60 * 60 * 1000));
    return {
      allowed: false,
      remaining: 0,
      resetTime: dayCheck.resetTime,
      error: `Daily signup limit reached. Please wait ${hoursUntilReset} hours before trying again.`,
    };
  }

  return {
    allowed: true,
    remaining: Math.min(hourCheck.remaining, dayCheck.remaining),
    resetTime: Math.min(hourCheck.resetTime, dayCheck.resetTime),
  };
}
