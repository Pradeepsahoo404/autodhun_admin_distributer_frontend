import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/components/providers/StoreProvider';
import { AuthSessionProvider } from '@/components/providers/AuthSessionProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'Autodhun Admin',
  description: 'Enterprise admin panel with RBAC, OTP authentication and Google OAuth',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.className}`}>
      <body className="min-h-screen antialiased">
        <StoreProvider>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
