// SafeConnect — TypeScript Types
// Per Architecture.md §5 — Firestore Schema

// ── Enums ──────────────────────────────────────────────────────────────

export const REPORT_CATEGORY = {
  SEXUAL_HARASSMENT: 'SEXUAL_HARASSMENT',
  BULLYING: 'BULLYING',
  RAGGING: 'RAGGING',
  STALKING: 'STALKING',
  CYBERBULLYING: 'CYBERBULLYING',
  HOSTEL_ISSUE: 'HOSTEL_ISSUE',
  OTHER: 'OTHER',
} as const;

export type ReportCategory = (typeof REPORT_CATEGORY)[keyof typeof REPORT_CATEGORY];

export const DEPARTMENT = {
  INTERNAL_COMMITTEE: 'INTERNAL_COMMITTEE',
  WARDEN: 'WARDEN',
  DISCIPLINE_COMMITTEE: 'DISCIPLINE_COMMITTEE',
  ANTI_RAGGING_CELL: 'ANTI_RAGGING_CELL',
  PR_CELL: 'PR_CELL',
} as const;

export type Department = (typeof DEPARTMENT)[keyof typeof DEPARTMENT];

export const REPORT_STATUS = {
  NEW: 'NEW',
  UNDER_REVIEW: 'UNDER_REVIEW',
  ACTION_TAKEN: 'ACTION_TAKEN',
  CLOSED: 'CLOSED',
} as const;

export type ReportStatus = (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS];

export const SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export type Severity = (typeof SEVERITY)[keyof typeof SEVERITY];

export const SENDER_ROLE = {
  STUDENT: 'student',
  AUTHORITY: 'authority',
} as const;

export type SenderRole = (typeof SENDER_ROLE)[keyof typeof SENDER_ROLE];

export const AUTHORITY_ROLE = {
  AUTHORITY: 'authority',
  SUPERADMIN: 'superadmin',
} as const;

export type AuthorityRole = (typeof AUTHORITY_ROLE)[keyof typeof AUTHORITY_ROLE];

// ── Category labels (human-readable) ──────────────────────────────────

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  SEXUAL_HARASSMENT: 'Sexual Harassment',
  BULLYING: 'Bullying',
  RAGGING: 'Ragging',
  STALKING: 'Stalking',
  CYBERBULLYING: 'Cyberbullying',
  HOSTEL_ISSUE: 'Hostel Issue',
  OTHER: 'Other',
};

export const DEPARTMENT_LABELS: Record<Department, string> = {
  INTERNAL_COMMITTEE: "Internal Committee (IC) / Women's Grievance Cell",
  WARDEN: 'Warden',
  DISCIPLINE_COMMITTEE: 'Discipline Committee',
  ANTI_RAGGING_CELL: 'Anti-Ragging Committee',
  PR_CELL: 'PR Cell',
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  NEW: 'New',
  UNDER_REVIEW: 'Under Review',
  ACTION_TAKEN: 'Action Taken',
  CLOSED: 'Closed',
};

// ── Interfaces ─────────────────────────────────────────────────────────

// Architecture.md §5.1 — reports collection
// PRIVACY: No name, roll number, email, phone, IP, device fingerprint,
//          user-agent, or session cookies. (Rules.md §1)
export interface Report {
  id: string;
  caseId: string;
  accessTokenHash: string;
  category: ReportCategory;
  description: string;
  location: string | null;
  incidentDate: string | null; // ISO string
  evidenceUrls: string[];
  routedTo: Department;
  status: ReportStatus;
  severity: Severity | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  closedAt: string | null; // ISO string
  closureNote?: string | null;
  quorumMembers?: string[]; // UIDs or names of attending committee members
  piiSanitized?: boolean;
}

// Architecture.md §5.2 — reports/{reportId}/messages subcollection
// PRIVACY: No sender name, uid, or identity — only the role.
export interface Message {
  id: string;
  senderRole: SenderRole;
  text: string;
  createdAt: string; // ISO string
}

// Internal committee notes (confidential to authorities)
export interface CommitteeNote {
  id: string;
  authorUid: string;
  authorName: string;
  department: Department;
  noteText: string;
  isFormalMinute: boolean;
  createdAt: string; // ISO string
}

// Case resolution record (GLBITM Grievance Policy §1.2.6)
export interface CaseResolution {
  resolvedByUid: string;
  actionSummary: string;
  quorumMembers: string[]; // Minimum 3 attending members required
  statutoryOutcome: 'SUBMITTED_TO_DIRECTOR' | 'DISMISSED_NO_FOUNDATION' | 'MUTUAL_RESOLUTION' | 'POLICE_ESCALATION';
  resolvedAt: string; // ISO string
  sanitizedPdfUrl?: string;
}

// System configuration document (stored at system/config)
export interface SystemConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  rateLimitPerMinute: number;
  readOnlyMode: boolean;
  alertBanner?: {
    enabled: boolean;
    text: string;
    level: 'info' | 'warning' | 'urgent';
  };
  lastHealthCheck: string; // ISO string
}

// Architecture.md §5.3 — authorities collection
export interface Authority {
  uid: string;
  name: string;
  email: string;
  department: Department;
  role: AuthorityRole;
  active: boolean;
}

// Architecture.md §5.4 — auditLogs collection
// Audit logs exist to keep authorities accountable, not to track students.
export interface AuditLog {
  id: string;
  action: string;
  performedByUid: string;
  reportId: string;
  details?: Record<string, unknown>;
  timestamp: string; // ISO string
}

// ── API Request/Response Types ─────────────────────────────────────────

export interface CreateReportRequest {
  category: ReportCategory;
  description: string;
  location?: string;
  incidentDate?: string;
  evidenceUrls?: string[];
}

export interface CreateReportResponse {
  caseId: string;
  accessToken: string;
}

export interface VerifyTokenRequest {
  caseId: string;
  accessToken: string;
}

export interface SendMessageRequest {
  caseId: string;
  accessToken?: string; // student provides this
  text: string;
  senderRole: SenderRole;
}

export interface UpdateStatusRequest {
  status: ReportStatus;
  severity?: Severity | null;
  closureNote?: string;
  quorumMembers?: string[];
}

export interface CreateNoteRequest {
  noteText: string;
  isFormalMinute?: boolean;
}

