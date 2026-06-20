// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'Rabin Pant | Full-Stack Developer',
  description: 'Full-stack developer specializing in scalable web applications, system design, and cloud architecture.',
  keywords: 'Rabin Pant, Full-Stack Developer, React, Node.js, AWS, Nepal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-16 md:pt-20">{children}</main>
      </body>
    </html>
  );
}