import React from 'react';
import { cookies } from 'next/headers';
import { AdminHeader } from '@/components/admin/AdminHeader';
import type { AuthenticatedUser } from '@/lib/admin/session';

const DEV_MOCK_USERS: Record<string, AuthenticatedUser> = {
  superadmin: {
    uid: 'dev-superadmin-uid',
    email: 'altamish@glbitm.ac.in',
    name: 'Mohd Altamish (Creator)',
    department: 'INTERNAL_COMMITTEE',
    role: 'superadmin',
    active: true,
  },
  ic_head: {
    uid: 'dev-ic-head-uid',
    email: 'rashmi.mishra@glbitm.ac.in',
    name: 'Dr. Rashmi Mishra (Presiding Officer)',
    department: 'INTERNAL_COMMITTEE',
    role: 'authority',
    active: true,
  },
  warden: {
    uid: 'dev-warden-uid',
    email: 'warden@glbitm.ac.in',
    name: 'Hostel Warden',
    department: 'WARDEN',
    role: 'authority',
    active: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const mockCookie = cookieStore.get('__dev_mock')?.value;
  const user = (mockCookie && DEV_MOCK_USERS[mockCookie]) || (process.env.NODE_ENV !== 'production' ? DEV_MOCK_USERS.superadmin : null);

  return (
    <div className="min-h-screen bg-surface-tint flex flex-col font-sans">
      <AdminHeader user={user} />
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </div>
    </div>
  );
}
