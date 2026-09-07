import { describe, it, expect } from 'vitest';
import {
  GLBITM_INFO,
  IC_MEMBERS,
  SEXUAL_HARASSMENT_DEFINITION,
  POLICY_TIMELINES,
  POLICY_PROTECTIONS,
  STATUTORY_COMMITTEES,
  OTHER_GLBITM_CELLS,
} from '@/lib/constants/glbitm';

describe('GLBITM Constants & Data Integrity', () => {
  it('should have correct institutional and regulatory information', () => {
    expect(GLBITM_INFO.institutionName).toContain('G.L. Bajaj Institute of Technology and Management');
    expect(GLBITM_INFO.email).toBe('wgc@glbitm.ac.in');
    expect(GLBITM_INFO.onlinePortalUrl).toBe('https://tinyurl.com/5cpu863a');
    expect(GLBITM_INFO.policyPdfUrl).toBe('https://www.glbitm.org/Uploads/2023/Grievance%20Policy.PDF');
    expect(GLBITM_INFO.aicteRegulation).toContain('F.AICTE/WH/2016/01');
  });

  it('should contain all 9 reconstituted Internal Committee members', () => {
    expect(IC_MEMBERS).toHaveLength(9);

    const presidingOfficer = IC_MEMBERS.find((m) => m.category === 'Presiding Officer');
    expect(presidingOfficer?.name).toBe('Dr. Rashmi Mishra');
    expect(presidingOfficer?.designationCommittee).toBe('Presiding Officer');

    const facultyMembers = IC_MEMBERS.filter((m) => m.category === 'Faculty Member');
    expect(facultyMembers).toHaveLength(2);
    expect(facultyMembers.map((m) => m.name)).toEqual(
      expect.arrayContaining(['Dr. Nivedita Singh', 'Dr. Arun Kumar'])
    );

    const nonTeachingMembers = IC_MEMBERS.filter((m) => m.category === 'Non-Teaching Member');
    expect(nonTeachingMembers).toHaveLength(2);
    expect(nonTeachingMembers.map((m) => m.name)).toEqual(
      expect.arrayContaining(['Mr. Barun Kumar Singh', 'Ms. Anjana'])
    );

    const studentMembers = IC_MEMBERS.filter((m) => m.category === 'Student Member');
    expect(studentMembers).toHaveLength(3);
    const rollNumbers = studentMembers.map((m) => m.rollNumber);
    expect(rollNumbers).toContain('2401920100223'); // Palak Chadha
    expect(rollNumbers).toContain('2501920700306'); // Palak Tripathi
    expect(rollNumbers).toContain('2501920140183'); // Simran Singh

    const ngoMember = IC_MEMBERS.find((m) => m.category === 'Member (NGO)');
    expect(ngoMember?.name).toBe('Ms. Aayesha Khan');
    expect(ngoMember?.organization).toBe('Katalyst, Delhi');
  });

  it('should contain full sexual harassment definition clauses', () => {
    expect(SEXUAL_HARASSMENT_DEFINITION.length).toBeGreaterThanOrEqual(5);
    expect(SEXUAL_HARASSMENT_DEFINITION).toContain('Demand or request for sexual favours');
  });

  it('should specify accurate timeline and quorum rules', () => {
    expect(POLICY_TIMELINES.meetingConvened).toContain('1 week');
    expect(POLICY_TIMELINES.recommendations).toContain('14 days');
    expect(POLICY_TIMELINES.quorum).toContain('3 members');
    expect(POLICY_PROTECTIONS.protectionAgainstVictimization).toContain('Policy §1.2.7');
    expect(STATUTORY_COMMITTEES).toHaveLength(3);
  });

  it('should maintain verified reference directories for other grievance cells', () => {
    expect(OTHER_GLBITM_CELLS).toHaveLength(3);

    const sgrc = OTHER_GLBITM_CELLS.find((c) => c.shortName === 'SGRC');
    expect(sgrc?.email).toBe('stugc@glbitm.ac.in');
    expect(sgrc?.members).toHaveLength(7);
    expect(sgrc?.members.find((m) => m.position === 'Chairperson')?.name).toContain('Manas Kumar Mishra');
    expect(sgrc?.members.find((m) => m.position === 'Convener')?.name).toContain('Mahaveer Singh Naruka');
    expect(sgrc?.members.find((m) => m.rollNumber === '2201921520057')?.name).toContain('Deepanshu Gupta');

    const casteCell = OTHER_GLBITM_CELLS.find((c) => c.shortName.includes('SC/ST'));
    expect(casteCell?.email).toBe('disgc@glbitm.ac.in');
    expect(casteCell?.members).toHaveLength(6);
    expect(casteCell?.members.find((m) => m.position === 'Convener')?.name).toContain('Manvinder Singh');

    const facultyCell = OTHER_GLBITM_CELLS.find((c) => c.shortName === 'FSGC');
    expect(facultyCell?.email).toBe('facgc@glbitm.ac.in');
    expect(facultyCell?.members).toHaveLength(5);
    expect(facultyCell?.members.find((m) => m.position === 'Convener')?.name).toContain('Satyendra Sharma');
    expect(facultyCell?.members.some((m) => m.isExternal)).toBe(true);
  });
});
