// Centralized audit log recorder for SafeConnect
import { getAdminDb } from '@/lib/firebase/admin';

export interface RecordAuditLogParams {
  action: string;
  performedByUid: string;
  reportId?: string;
  details?: Record<string, unknown>;
}

/**
 * Appends an immutable audit log record to Firestore /auditLogs collection.
 * Ensures accountability of authorities and developers without logging student PII.
 */
export async function recordAuditLog({
  action,
  performedByUid,
  reportId = 'SYSTEM',
  details = {},
}: RecordAuditLogParams): Promise<string | null> {
  try {
    const timestamp = new Date().toISOString();
    const db = getAdminDb();

    const docRef = await db.collection('auditLogs').add({
      action,
      performedByUid,
      reportId,
      details,
      timestamp,
    });

    return docRef.id;
  } catch (error) {
    // In local dev without live Firebase, log to console
    console.warn(
      `[SafeConnect Audit] Action=${action} by=${performedByUid} case=${reportId} err=${
        error instanceof Error ? error.message : 'Unknown'
      }`
    );
    return null;
  }
}
