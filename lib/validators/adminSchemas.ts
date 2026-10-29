// Zod schemas for Admin and Developer panel operations
import { z } from 'zod';
import { REPORT_STATUS, SEVERITY, DEPARTMENT, AUTHORITY_ROLE } from '@/types';

const statusValues = Object.values(REPORT_STATUS) as [string, ...string[]];
const severityValues = Object.values(SEVERITY) as [string, ...string[]];
const departmentValues = Object.values(DEPARTMENT) as [string, ...string[]];
const roleValues = Object.values(AUTHORITY_ROLE) as [string, ...string[]];

// Status update with GLBITM statutory quorum enforcement (§1.2.6)
export const updateStatusSchema = z
  .object({
    status: z.enum(statusValues, {
      message: 'Invalid status value',
    }),
    severity: z.enum(severityValues).nullable().optional(),
    closureNote: z
      .string()
      .max(2000, 'Closure note must be under 2000 characters')
      .optional()
      .nullable(),
    quorumMembers: z
      .array(z.string().min(1, 'Member name/UID cannot be empty'))
      .optional()
      .default([]),
  })
  .refine(
    (data) => {
      // If closing case, closure note is required
      if (data.status === REPORT_STATUS.CLOSED) {
        return !!data.closureNote && data.closureNote.trim().length >= 10;
      }
      return true;
    },
    {
      message: 'A formal closure note of at least 10 characters is required to close a case',
      path: ['closureNote'],
    }
  )
  .refine(
    (data) => {
      // If resolving or closing case, statutory quorum of at least 3 members is required per BOG policy §1.2.6
      if (data.status === REPORT_STATUS.ACTION_TAKEN || data.status === REPORT_STATUS.CLOSED) {
        return Array.isArray(data.quorumMembers) && data.quorumMembers.length >= 3;
      }
      return true;
    },
    {
      message: 'Statutory quorum requirement: at least 3 committee members must be present to resolve or close a grievance',
      path: ['quorumMembers'],
    }
  );

export type UpdateStatusData = z.infer<typeof updateStatusSchema>;

// Confidential Committee Notes & Minutes of Meeting
export const committeeNoteSchema = z.object({
  noteText: z
    .string()
    .min(5, 'Committee note must be at least 5 characters')
    .max(5000, 'Committee note must be under 5000 characters'),
  isFormalMinute: z.boolean().optional().default(false),
});

export type CommitteeNoteData = z.infer<typeof committeeNoteSchema>;

// Developer System Maintenance & Emergency Killswitches
export const maintenanceToggleSchema = z.object({
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().max(500).optional(),
  rateLimitPerMinute: z.number().int().min(1).max(1000).optional(),
  readOnlyMode: z.boolean().optional(),
  alertBanner: z
    .object({
      enabled: z.boolean(),
      text: z.string().max(300),
      level: z.enum(['info', 'warning', 'urgent']),
    })
    .optional(),
});

export type MaintenanceToggleData = z.infer<typeof maintenanceToggleSchema>;

// Zero-PII Redaction Schema
export const piiRedactSchema = z.object({
  docId: z.string().min(1, 'Document ID is required'),
});

export type PiiRedactData = z.infer<typeof piiRedactSchema>;

// Authority Account Provisioning
export const provisionAuthoritySchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .refine(
      (email) => email.toLowerCase().endsWith('@glbitm.ac.in'),
      'Authority accounts must use the official institutional domain (@glbitm.ac.in)'
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  department: z.enum(departmentValues, {
    message: 'Invalid department',
  }),
  role: z.enum(roleValues).optional().default('authority'),
  active: z.boolean().optional().default(true),
});

export type ProvisionAuthorityData = z.infer<typeof provisionAuthoritySchema>;
