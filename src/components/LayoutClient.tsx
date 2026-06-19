'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/lib/auth-context';

const PUBLIC_ROUTES = ['/login', '/signup'];

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const isAuthPage = PUBLIC_ROUTES.includes(pathname);

  // Gate rendering until the guard has run, so protected content never flashes
  // before a redirect and we never touch localStorage during SSR.
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  const authCheck = useCallback(() => {
    const hasToken = !!localStorage.getItem('auth_token');

    // Logged-in users have no business on the login/signup pages.
    if (hasToken && isAuthPage) {
      router.replace('/autofill');
      return false;
    }
    // No token on a protected route → login.
    if (!hasToken && !isAuthPage) {
      router.replace('/login');
      return false;
    }
    return true;
  }, [isAuthPage, router]);

  useEffect(() => {
    setIsChecking(true);
    const ok = authCheck();
    setIsAllowed(ok);
    setIsChecking(false);
  }, [pathname, authCheck]);

  // Any API 401 → clear the session and route back to login.
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
      router.replace('/login');
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout, router]);

  if (isChecking || !isAllowed) return null;

  return (
    <>
      {!isAuthPage && <Sidebar />}
      <main className="flex-1 p-4">{children}</main>
    </>
  );
}
