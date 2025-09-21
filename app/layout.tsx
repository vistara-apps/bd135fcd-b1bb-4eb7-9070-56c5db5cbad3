import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Schedulr - Effortless Group Scheduling',
  description: 'Find niche services, schedule group events easily, and manage appointment waitlists.',
  openGraph: {
    title: 'Schedulr - Effortless Group Scheduling',
    description: 'Find niche services, schedule group events easily, and manage appointment waitlists.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Schedulr - Effortless Group Scheduling',
    description: 'Find niche services, schedule group events easily, and manage appointment waitlists.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
