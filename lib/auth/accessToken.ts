// Access Token generation, hashing, and verification
// Per Architecture.md §6.1 and Rules.md §1.3:
// - Token is 16-char cryptographically random
// - Only sha256(token + TOKEN_HASH_SECRET) is stored — NEVER the raw token
// - Verification uses constant-time comparison (Rules.md §5)

import { randomBytes, createHash, timingSafeEqual } from 'crypto';

const TOKEN_LENGTH = 16;

/**
 * Generate a 16-character cryptographically random access token.
 * This token is shown to the student EXACTLY ONCE and never stored.
 */
export function generateAccessToken(): string {
  // Generate random bytes and encode as alphanumeric
  const bytes = randomBytes(TOKEN_LENGTH);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

/**
 * Hash an access token with the server-side pepper.
 * This is the ONLY form that gets stored in Firestore.
 * Rules.md §1.3: Never store the raw token anywhere.
 */
export function hashAccessToken(token: string): string {
  const secret = process.env.TOKEN_HASH_SECRET;
  if (!secret) {
    throw new Error('TOKEN_HASH_SECRET environment variable is not set');
  }
  return createHash('sha256')
    .update(token + secret)
    .digest('hex');
}

/**
 * Verify an access token against a stored hash.
 * Uses constant-time comparison to prevent timing attacks (Rules.md §5).
 */
export function verifyAccessToken(token: string, storedHash: string): boolean {
  const computedHash = hashAccessToken(token);
  const a = Buffer.from(computedHash, 'hex');
  const b = Buffer.from(storedHash, 'hex');
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}
