import React from 'react';
import { cookies } from 'next/headers';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getSessionUser } from '@/lib/admin/session';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const mockCookie = cookieStore.get('__dev_mock')?.value;
  const sessionCookie = cookieStore.get('__session')?.value;
  const user = await getSessionUser(sessionCookie, mockCookie);

  return (
    <div className="min-h-screen bg-surface-tint flex flex-col font-sans">
      <AdminHeader user={user} />
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </div>
    </div>
  );
}
