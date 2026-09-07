// Zod schemas for report validation
// Per Rules.md §3: Zod schemas in lib/validators/ are the single source of truth
// for both client-side form validation and server-side request validation

import { z } from 'zod';
import { REPORT_CATEGORY } from '@/types';

const categoryValues = Object.values(REPORT_CATEGORY) as [string, ...string[]];

export const reportSchema = z.object({
  category: z.enum(categoryValues, {
    message: 'Please select a valid category',
  }),
  description: z
    .string()
    .min(20, 'A few more details will help the team act on this — please write at least 20 characters')
    .max(5000, 'Description is too long — please keep it under 5000 characters'),
  location: z
    .string()
    .max(200, 'Location is too long')
    .optional()
    .nullable()
    .transform((val) => val || null),
  incidentDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || null),
  evidenceUrls: z
    .array(z.string())
    .max(3, 'You can attach up to 3 files')
    .optional()
    .default([]),
});

export type ReportFormData = z.infer<typeof reportSchema>;

// Schema for verifying access token
export const verifyTokenSchema = z.object({
  caseId: z
    .string()
    .min(1, 'Please enter your Case ID')
    .regex(/^SC-[A-HJ-NP-Z2-9]{5}$/, 'That doesn\'t look like a valid Case ID'),
  accessToken: z
    .string()
    .min(1, 'Please enter your Access Token')
    .length(16, 'Access token should be 16 characters'),
});

export type VerifyTokenData = z.infer<typeof verifyTokenSchema>;

// Schema for sending a chat message
export const messageSchema = z.object({
  caseId: z.string().min(1),
  text: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message is too long — please keep it under 2000 characters'),
  accessToken: z.string().optional(), // student provides this
  senderRole: z.enum(['student', 'authority']),
});

export type MessageFormData = z.infer<typeof messageSchema>;
