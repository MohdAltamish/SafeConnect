// Category → Department routing logic
// Per Architecture.md §7 and Workflow.md §5

import { type ReportCategory, type Department, REPORT_CATEGORY, DEPARTMENT } from '@/types';

/**
 * Route a report to the correct department based on its category.
 * This mirrors how Indian colleges typically split responsibility:
 * - ICC under the POSH Act for harassment
 * - Anti-Ragging Committee per UGC regulations
 * - Warden for hostel matters
 */
export function routeReport(category: ReportCategory): Department {
  switch (category) {
    case REPORT_CATEGORY.SEXUAL_HARASSMENT:
    case REPORT_CATEGORY.RAGGING:
      return DEPARTMENT.ANTI_RAGGING_CELL;

    case REPORT_CATEGORY.BULLYING:
    case REPORT_CATEGORY.STALKING:
    case REPORT_CATEGORY.CYBERBULLYING:
      return DEPARTMENT.DISCIPLINE_COMMITTEE;

    case REPORT_CATEGORY.HOSTEL_ISSUE:
      return DEPARTMENT.WARDEN;

    case REPORT_CATEGORY.OTHER:
      return DEPARTMENT.PR_CELL;

    default: {
      // Exhaustive check — TypeScript will catch if a new category is added
      // but not handled here
      const _exhaustive: never = category;
      throw new Error(`Unknown category: ${_exhaustive}`);
    }
  }
}
