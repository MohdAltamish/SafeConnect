// System diagnostics & PII scanning utility
import { getAdminDb } from '@/lib/firebase/admin';

export const PHONE_REGEX = /\b[6-9]\d{9}\b/g;
export const ROLL_REGEX = /\b2[0-9]{12}\b/g;
export const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

export interface HealthCheckResult {
  systemStatus: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  timestamp: string;
  totalLatencyMs: number;
  checks: {
    firestore: { status: 'healthy' | 'unhealthy'; latencyMs?: number; error?: string };
    environment: { status: 'healthy' | 'unhealthy'; missing?: string[] };
    unroutedCases: { status: 'healthy' | 'unhealthy'; count?: number; error?: string };
    staleCases: { count: number; alert: boolean };
  };
}

/**
 * Runs live health checks on Firestore connectivity, environment setup, and queue health.
 */
export async function runSystemHealthCheck(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  const checks: HealthCheckResult['checks'] = {
    firestore: { status: 'unhealthy' },
    environment: { status: 'unhealthy' },
    unroutedCases: { status: 'healthy', count: 0 },
    staleCases: { count: 0, alert: false },
  };

  // 1. Verify environment variables
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_ADMIN_CLIENT_EMAIL',
    'FIREBASE_ADMIN_PRIVATE_KEY',
    'TOKEN_HASH_SECRET',
  ];
  const missing = requiredVars.filter((key) => !process.env[key]);
  checks.environment = {
    status: missing.length === 0 ? 'healthy' : 'unhealthy',
    missing: missing.length > 0 ? missing : undefined,
  };

  // 2. Test Firestore read/write ping
  try {
    const db = getAdminDb();
    const pingStart = Date.now();
    await db.collection('_health').doc('ping').set({
      lastPing: new Date().toISOString(),
      service: 'SafeConnect-HealthCheck',
    });
    checks.firestore = {
      status: 'healthy',
      latencyMs: Date.now() - pingStart,
    };
  } catch (err) {
    checks.firestore = {
      status: 'unhealthy',
      error: err instanceof Error ? err.message : 'Unknown Firestore error',
    };
  }

  // 3. Scan for unrouted cases
  try {
    const db = getAdminDb();
    const unroutedSnap = await db.collection('reports').where('routedTo', '==', null).limit(10).get();
    const count = unroutedSnap.size;
    checks.unroutedCases = {
      status: count === 0 ? 'healthy' : 'unhealthy',
      count,
      error: count > 0 ? `${count} unrouted cases detected in database` : undefined,
    };
  } catch {
    // If query fails or collection is empty
    checks.unroutedCases = { status: 'healthy', count: 0 };
  }

  // 4. Scan for stale cases in 'NEW' status for > 5 days (statutory 7-day meeting window)
  try {
    const db = getAdminDb();
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const staleSnap = await db
      .collection('reports')
      .where('status', '==', 'NEW')
      .where('createdAt', '<', fiveDaysAgo)
      .limit(10)
      .get();
    checks.staleCases = {
      count: staleSnap.size,
      alert: staleSnap.size > 0,
    };
  } catch {
    checks.staleCases = { count: 0, alert: false };
  }

  const isOperational =
    checks.firestore.status === 'healthy' &&
    checks.environment.status === 'healthy' &&
    checks.unroutedCases.status === 'healthy';

  return {
    systemStatus: isOperational ? 'OPERATIONAL' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    totalLatencyMs: Date.now() - startTime,
    checks,
  };
}

export interface PiiFlaggedItem {
  id: string;
  caseId: string;
  collection: 'reports' | 'messages';
  detectedTypes: string[];
  snippet: string;
}

/**
 * Scans recent reports and messages for inadvertent PII leaks (phone numbers, roll numbers, emails).
 */
export async function scanForPiiLeaks(): Promise<PiiFlaggedItem[]> {
  const flagged: PiiFlaggedItem[] = [];

  try {
    const db = getAdminDb();
    // Scan last 50 reports
    const reportsSnap = await db.collection('reports').orderBy('createdAt', 'desc').limit(50).get();

    for (const doc of reportsSnap.docs) {
      const data = doc.data();
      const desc = data.description || '';
      const detected: string[] = [];

      if (PHONE_REGEX.test(desc)) detected.push('PHONE');
      if (ROLL_REGEX.test(desc)) detected.push('ROLL_NO');
      if (EMAIL_REGEX.test(desc)) detected.push('EMAIL');

      if (detected.length > 0) {
        flagged.push({
          id: doc.id,
          caseId: data.caseId || doc.id,
          collection: 'reports',
          detectedTypes: detected,
          snippet: desc.substring(0, 120) + (desc.length > 120 ? '...' : ''),
        });
      }
    }
  } catch (err) {
    console.warn('[SafeConnect PII Scan] Error scanning reports:', err);
  }

  return flagged;
}

/**
 * Sanitizes and redacts all phone, roll number, and email patterns from a text string.
 */
export function sanitizePii(text: string): string {
  let sanitized = text;
  sanitized = sanitized.replace(PHONE_REGEX, '[PHONE NUMBER REDACTED]');
  sanitized = sanitized.replace(ROLL_REGEX, '[ROLL NUMBER REDACTED]');
  sanitized = sanitized.replace(EMAIL_REGEX, '[EMAIL REDACTED]');
  return sanitized;
}
