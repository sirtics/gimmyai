/**
 * Input Validation and Sanitization Utilities
 * Provides comprehensive validation and sanitization for user inputs
 */

// Maximum lengths
export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_EMAIL_LENGTH = 254;
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;

// Rate limiting constants
export const RATE_LIMITS = {
  MESSAGES_PER_MINUTE: 10,
  MESSAGES_PER_HOUR: 100,
  API_CALLS_PER_MINUTE: 20,
  API_CALLS_PER_HOUR: 200,
};

/**
 * Sanitizes text input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, "");

  // Remove potentially dangerous HTML/script tags
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, ""); // Remove event handlers like onclick=

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Validates email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: `Email must be less than ${MAX_EMAIL_LENGTH} characters` };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  // Check for dangerous patterns
  if (email.includes("<") || email.includes(">") || email.includes("'") || email.includes('"')) {
    return { valid: false, error: "Email contains invalid characters" };
  }

  return { valid: true };
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string; strength?: "weak" | "medium" | "strong" } {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    };
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `Password must be less than ${MAX_PASSWORD_LENGTH} characters`,
    };
  }

  // Check for common weak passwords
  const commonPasswords = ["password", "123456", "12345678", "qwerty", "abc123"];
  if (commonPasswords.includes(password.toLowerCase())) {
    return { valid: true, error: "Password is too common", strength: "weak" };
  }

  // Calculate password strength
  let strength: "weak" | "medium" | "strong" = "weak";
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score >= 4) strength = "strong";
  else if (score >= 3) strength = "medium";

  return { valid: true, strength };
}

/**
 * Validates message content
 */
export function validateMessage(message: string): { valid: boolean; error?: string } {
  if (!message || typeof message !== "string") {
    return { valid: false, error: "Message cannot be empty" };
  }

  const trimmed = message.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Message cannot be empty" };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  // Check for suspicious patterns (potential injection attempts)
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      return { valid: false, error: "Message contains invalid content" };
    }
  }

  // Check for excessive repetition (potential spam)
  const words = trimmed.split(/\s+/);
  if (words.length > 1) {
    const uniqueWords = new Set(words);
    if (uniqueWords.size / words.length < 0.3 && words.length > 10) {
      return { valid: false, error: "Message appears to be spam" };
    }
  }

  return { valid: true };
}

/**
 * Validates donation amount
 */
export function validateDonationAmount(amount: number): { valid: boolean; error?: string } {
  if (typeof amount !== "number" || isNaN(amount)) {
    return { valid: false, error: "Amount must be a valid number" };
  }

  if (amount < 5) {
    return { valid: false, error: "Minimum donation amount is $5" };
  }

  if (amount > 10000) {
    return { valid: false, error: "Maximum donation amount is $10,000" };
  }

  // Check for suspiciously precise amounts (potential fraud)
  const decimalPlaces = (amount.toString().split(".")[1] || "").length;
  if (decimalPlaces > 2) {
    return { valid: false, error: "Amount can only have up to 2 decimal places" };
  }

  return { valid: true };
}

/**
 * Validates and sanitizes user input for chat messages
 */
export function validateAndSanitizeMessage(message: string): {
  valid: boolean;
  sanitized?: string;
  error?: string;
} {
  const validation = validateMessage(message);
  if (!validation.valid) {
    return validation;
  }

  const sanitized = sanitizeInput(message);
  if (sanitized.length === 0) {
    return { valid: false, error: "Message cannot be empty after sanitization" };
  }

  return { valid: true, sanitized };
}

/**
 * Validates URL to prevent malicious links
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "URL is required" };
  }

  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return { valid: false, error: "Only HTTP and HTTPS URLs are allowed" };
    }

    // Block known malicious domains (basic check)
    const blockedDomains = ["localhost", "127.0.0.1", "0.0.0.0"];
    if (blockedDomains.some(domain => urlObj.hostname.includes(domain))) {
      return { valid: false, error: "Invalid URL" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}
