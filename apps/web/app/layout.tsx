/**
 * AI Email Marketing System
 * Copyright (c) 2024 Muhammad Ismail
 * Email: ismail@aimnovo.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.
 *
 * For commercial use, please maintain proper attribution.
 */

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { QueryProvider } from '@/lib/query-client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Email Marketing System',
  description: 'AI-powered email marketing automation platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
