/**
 * GLBITM Women Grievance Cell / Internal Committee (IC) & Grievance Policy Data
 *
 * Source:
 * 1. AICTE Regulations, 2016 vide No. F.AICTE/WH/2016/01 dated 10th June, 2016
 * 2. GLBITM Internal Complaint Committee (IC) Reconstitution Notification
 * 3. GLBITM Grievance Policy (Approved in 20th BOG meeting held on 19-05-2018 vide agenda Item no. 20.8)
 */

export interface CommitteeMember {
  sNo: number;
  name: string;
  designationOrg: string;
  designationCommittee: string;
  category: 'Presiding Officer' | 'Faculty Member' | 'Non-Teaching Member' | 'Student Member' | 'Member (NGO)';
  department?: string;
  rollNumber?: string;
  organization?: string;
}

export const GLBITM_INFO = {
  institutionName: 'G.L. Bajaj Institute of Technology and Management',
  shortName: 'GLBITM',
  address: 'Plot No. 2, Knowledge Park-III, Greater Noida - 201306 (U.P.)',
  managedBy: 'Rajiv Memorial Academic Welfare Society, Mathura',
  approvedBy: 'All India Council for Technical Education, New Delhi (AICTE)',
  affiliatedTo: 'Dr. A.P.J. Abdul Kalam Technical University, Lucknow (AKTU)',
  bogApproval: 'Approved in the 20th BOG meeting held on 19-05-2018 vide agenda Item no. 20.8',
  email: 'wgc@glbitm.ac.in',
  meetingSchedule: 'General Meeting as per the need.',
  onlinePortalUrl: 'https://tinyurl.com/5cpu863a',
  policyPdfUrl: 'https://www.glbitm.org/Uploads/2023/Grievance%20Policy.PDF',
  aicteRegulation: 'Regulations, 2016 vide No. F.AICTE/WH/2016/01 dated 10th June, 2016',
};

export const IC_MEMBERS: CommitteeMember[] = [
  {
    sNo: 1,
    name: 'Dr. Rashmi Mishra',
    designationOrg: 'Professor, Deptt. of Applied Science and Humanities',
    designationCommittee: 'Presiding Officer',
    category: 'Presiding Officer',
    department: 'Applied Science and Humanities',
  },
  {
    sNo: 2,
    name: 'Dr. Nivedita Singh',
    designationOrg: 'Assoc. Professor, Deptt. of MBA',
    designationCommittee: 'Faculty Member',
    category: 'Faculty Member',
    department: 'MBA',
  },
  {
    sNo: 3,
    name: 'Dr. Arun Kumar',
    designationOrg: 'Assoc. Professor, Deptt. of Computer Science and Engg.',
    designationCommittee: 'Faculty Member',
    category: 'Faculty Member',
    department: 'Computer Science and Engg.',
  },
  {
    sNo: 4,
    name: 'Mr. Barun Kumar Singh',
    designationOrg: 'Administrative Officer',
    designationCommittee: 'Non-Teaching Member',
    category: 'Non-Teaching Member',
    department: 'Administration',
  },
  {
    sNo: 5,
    name: 'Ms. Anjana',
    designationOrg: 'Associate NCC Officer',
    designationCommittee: 'Non-Teaching Member',
    category: 'Non-Teaching Member',
    department: 'NCC',
  },
  {
    sNo: 6,
    name: 'Ms. Palak Chadha',
    designationOrg: 'Student, B.Tech. CSE',
    designationCommittee: 'Student Member',
    category: 'Student Member',
    department: 'B.Tech. CSE',
    rollNumber: '2401920100223',
  },
  {
    sNo: 7,
    name: 'Ms. Palak Tripathi',
    designationOrg: 'Student, MBA',
    designationCommittee: 'Student Member',
    category: 'Student Member',
    department: 'MBA',
    rollNumber: '2501920700306',
  },
  {
    sNo: 8,
    name: 'Ms. Simran Singh',
    designationOrg: 'Student, MCA',
    designationCommittee: 'Student Member',
    category: 'Student Member',
    department: 'MCA',
    rollNumber: '2501920140183',
  },
  {
    sNo: 9,
    name: 'Ms. Aayesha Khan',
    designationOrg: 'Sr. Program Manager, Katalyst, Delhi',
    designationCommittee: 'Member (NGO)',
    category: 'Member (NGO)',
    organization: 'Katalyst, Delhi',
  },
];

export const SEXUAL_HARASSMENT_DEFINITION = [
  'Physical contact and advances',
  'Demand or request for sexual favours',
  'Sexually coloured remarks',
  'Display of pornography',
  'Any other unwelcome physical, verbal and non-verbal conduct of a sexual nature',
  'Any unwelcome words or actions of sexual nature',
];

export const POLICY_TIMELINES = {
  meetingConvened: 'Within 1 week upon receipt of grievance',
  recommendations: 'Within a fortnight (14 days) to the Director',
  quorum: '3 members physically present',
  recusalRule: 'If a complaint is lodged against a member of the committee, said member is precluded from participating in the quorum/proceedings.',
};

export const POLICY_PROTECTIONS = {
  anonymity: 'The committee guarantees the anonymity of the complainant, preferably to all parties involved (Policy §1.1.1).',
  protectionAgainstVictimization: 'GLBITM guarantees the safeguarding of individuals who file a complaint in good faith and without malicious intent, preventing any form of retaliation against those who raise concerns. Disciplinary measures will be taken against perpetrators of retaliation (Policy §1.2.7).',
  representationRight: 'The complainant has the right to be accompanied by a representative during inquiry proceedings (Policy §1.2.6).',
};

export const STATUTORY_COMMITTEES = [
  {
    name: "Women Grievance / Anti-Sexual Harassment Cell (Internal Committee - IC)",
    clause: "Section 1.2.1",
    description: "Dedicated to addressing grievances related to women (students, faculty, and staff), offering a secure and empathetic setting, counselling resources, and prompt redressal as per AICTE 2016 Regulations.",
  },
  {
    name: "Anti-Ragging Committee",
    clause: "Section 1.3.1",
    description: "In charge of overseeing, advising, and inspecting campus areas (hostels, buses, canteens, classrooms) to preserve a culture strictly devoid of ragging.",
  },
  {
    name: "Caste-Based Discrimination Prevention Committee (SC/ST/OBC/Minority Cell)",
    clause: "Section 1.4.1",
    description: "Ensures inclusion, support, financial scheme dissemination, and upliftment of SC/ST/OBC/Minority community members in a secure environment.",
  },
];

export const POLICY_SECTIONS = [
  {
    title: "1.1.1",
    description: "The committee guarantees the anonymity of the complainant, preferably to all parties involved.",
  },
  {
    title: "1.2.7",
    description: "GLBITM guarantees the safeguarding of individuals who file a complaint in good faith and without malicious intent, preventing any form of retaliation against those who raise concerns. Disciplinary measures will be taken against perpetrators of retaliation.",
  },
  {
    title: "1.2.6",
    description: "The complainant has the right to be accompanied by a representative during inquiry proceedings.",
  },
] as const;