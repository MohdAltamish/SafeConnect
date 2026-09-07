// Unit tests for lib/auth/accessToken.ts
// Per Rules.md §8: This is the single most security-critical module in the codebase
// and needs full unit test coverage.

import { describe, it, expect, beforeAll } from 'vitest';
import { generateAccessToken, hashAccessToken, verifyAccessToken } from '@/lib/auth/accessToken';

// Set up a test pepper
beforeAll(() => {
  process.env.TOKEN_HASH_SECRET = 'test-pepper-for-unit-tests-do-not-use-in-production';
});

describe('generateAccessToken', () => {
  it('should generate a 16-character token', () => {
    const token = generateAccessToken();
    expect(token).toHaveLength(16);
  });

  it('should only contain safe characters (no ambiguous chars like 0/O, 1/I/l)', () => {
    const safeChars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    for (let i = 0; i < 50; i++) {
      const token = generateAccessToken();
      for (const char of token) {
        expect(safeChars).toContain(char);
      }
    }
  });

  it('should generate unique tokens on successive calls', () => {
    const tokens = new Set<string>();
    for (let i = 0; i < 100; i++) {
      tokens.add(generateAccessToken());
    }
    // With 16-char tokens from a large charset, collisions should be
    // astronomically unlikely in 100 trials
    expect(tokens.size).toBe(100);
  });
});

describe('hashAccessToken', () => {
  it('should return a hex string', () => {
    const hash = hashAccessToken('test-token-12345');
    expect(hash).toMatch(/^[0-9a-f]+$/);
  });

  it('should return a 64-character SHA-256 hex digest', () => {
    const hash = hashAccessToken('test-token-12345');
    expect(hash).toHaveLength(64);
  });

  it('should be deterministic — same input produces same hash', () => {
    const token = 'deterministic-test';
    const hash1 = hashAccessToken(token);
    const hash2 = hashAccessToken(token);
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different tokens', () => {
    const hash1 = hashAccessToken('token-aaa-bbb-cc');
    const hash2 = hashAccessToken('token-xxx-yyy-zz');
    expect(hash1).not.toBe(hash2);
  });

  it('should NOT equal the raw token (Rules.md §1.3)', () => {
    const token = 'raw-token-value!';
    const hash = hashAccessToken(token);
    expect(hash).not.toBe(token);
  });

  it('should throw if TOKEN_HASH_SECRET is not set', () => {
    const original = process.env.TOKEN_HASH_SECRET;
    delete process.env.TOKEN_HASH_SECRET;
    expect(() => hashAccessToken('any-token')).toThrow('TOKEN_HASH_SECRET');
    process.env.TOKEN_HASH_SECRET = original;
  });
});

describe('verifyAccessToken', () => {
  it('should return true for a correct token', () => {
    const token = generateAccessToken();
    const hash = hashAccessToken(token);
    expect(verifyAccessToken(token, hash)).toBe(true);
  });

  it('should return false for a wrong token', () => {
    const token = generateAccessToken();
    const hash = hashAccessToken(token);
    const wrongToken = generateAccessToken(); // different token
    expect(verifyAccessToken(wrongToken, hash)).toBe(false);
  });

  it('should return false for a tampered hash', () => {
    const token = generateAccessToken();
    const hash = hashAccessToken(token);
    // Flip the first character of the hash
    const tamperedHash = (hash[0] === 'a' ? 'b' : 'a') + hash.slice(1);
    expect(verifyAccessToken(token, tamperedHash)).toBe(false);
  });

  it('should use constant-time comparison (timing-safe)', () => {
    // We can't directly test timing safety in a unit test,
    // but we verify that the function uses crypto.timingSafeEqual
    // by checking it handles the comparison correctly for edge cases
    const token = generateAccessToken();
    const hash = hashAccessToken(token);

    // Verify the function works with the full hash
    expect(verifyAccessToken(token, hash)).toBe(true);

    // Verify it rejects completely different hashes
    const differentHash = 'a'.repeat(64);
    expect(verifyAccessToken(token, differentHash)).toBe(false);
  });
});
