import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SPATIAL - VR Spatial Design Platform',
  description: 'Create, edit, test, and publish virtual environments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#09090b] text-slate-100 overflow-hidden`}>
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}

