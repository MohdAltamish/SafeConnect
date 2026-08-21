// Case ID generator
// Format: SC-XXXXX (5 uppercase alphanumeric chars, avoiding ambiguous characters)
// Per Architecture.md §6.1: short, human-readable, safe to say out loud

import { randomBytes } from 'crypto';

// Avoid ambiguous characters: 0/O, 1/I/L
const SAFE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const ID_LENGTH = 5;

/**
 * Generate a human-readable case ID in the format SC-XXXXX.
 * Uses crypto.randomBytes for unpredictability.
 */
export function generateCaseId(): string {
  const bytes = randomBytes(ID_LENGTH);
  let id = '';
  for (let i = 0; i < ID_LENGTH; i++) {
    id += SAFE_CHARS[bytes[i] % SAFE_CHARS.length];
  }
  return `SC-${id}`;
}
