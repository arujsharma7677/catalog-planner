import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { LayoutClient } from '@/components/LayoutClient';

export const metadata: Metadata = {
  title: ' Forecast - Catalog Planning & Demand Forecasting',
  description: 'Plan your  catalog with data-driven demand forecasting and AI-powered auto-fill',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}
