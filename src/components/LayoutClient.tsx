'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <>
      {!isAuthPage && <Sidebar />}
      <main className="flex-1 p-4">{children}</main>
    </>
  );
}
