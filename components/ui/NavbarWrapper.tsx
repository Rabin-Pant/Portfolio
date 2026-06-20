// components/ui/NavbarWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Navbar with SSR disabled
const Navbar = dynamic(
  () => import('./Navbar').then((mod) => mod.Navbar),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed top-0 w-full z-50 h-16 md:h-20 bg-transparent" />
    )
  }
);

export function NavbarWrapper() {
  return <Navbar />;
}