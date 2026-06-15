import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Demi Koi – Pond Salt Calculator',
  description: 'Calculate exactly how much salt to add to your Koi pond, or estimate your pond volume from a known salt treatment.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
