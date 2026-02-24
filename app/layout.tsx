import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/providers';

export const metadata: Metadata = {
  title: 'EmpowerStudio - AI Video Background Marketplace',
  description: 'Premium AI-generated video backgrounds for presentations, streams, and creative projects. Powered by Monad.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
