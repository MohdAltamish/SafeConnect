// Unit tests for lib/routing/routeReport.ts
// Per Rules.md §8: needs a test asserting every category from PRD.md maps
// to the correct department per Architecture.md §7

import { describe, it, expect } from 'vitest';
import { routeReport } from '@/lib/routing/routeReport';
import { REPORT_CATEGORY, DEPARTMENT } from '@/types';

describe('routeReport', () => {
  it('should route SEXUAL_HARASSMENT to INTERNAL_COMMITTEE', () => {
    expect(routeReport(REPORT_CATEGORY.SEXUAL_HARASSMENT)).toBe(DEPARTMENT.INTERNAL_COMMITTEE);
  });

  it('should route RAGGING to ANTI_RAGGING_CELL', () => {
    expect(routeReport(REPORT_CATEGORY.RAGGING)).toBe(DEPARTMENT.ANTI_RAGGING_CELL);
  });

  it('should route BULLYING to DISCIPLINE_COMMITTEE', () => {
    expect(routeReport(REPORT_CATEGORY.BULLYING)).toBe(DEPARTMENT.DISCIPLINE_COMMITTEE);
  });

  it('should route STALKING to DISCIPLINE_COMMITTEE', () => {
    expect(routeReport(REPORT_CATEGORY.STALKING)).toBe(DEPARTMENT.DISCIPLINE_COMMITTEE);
  });

  it('should route CYBERBULLYING to DISCIPLINE_COMMITTEE', () => {
    expect(routeReport(REPORT_CATEGORY.CYBERBULLYING)).toBe(DEPARTMENT.DISCIPLINE_COMMITTEE);
  });

  it('should route HOSTEL_ISSUE to WARDEN', () => {
    expect(routeReport(REPORT_CATEGORY.HOSTEL_ISSUE)).toBe(DEPARTMENT.WARDEN);
  });

  it('should route OTHER to PR_CELL', () => {
    expect(routeReport(REPORT_CATEGORY.OTHER)).toBe(DEPARTMENT.PR_CELL);
  });

  it('should handle every defined category (exhaustive coverage)', () => {
    const allCategories = Object.values(REPORT_CATEGORY);
    const allDepartments = Object.values(DEPARTMENT);

    for (const category of allCategories) {
      const result = routeReport(category);
      expect(allDepartments).toContain(result);
    }
  });
});
