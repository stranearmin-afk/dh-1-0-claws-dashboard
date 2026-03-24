import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Agent Command Center v1.0',
  description: 'Dashboard for monitoring agents and APIs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className="dark"><body className="bg-[#0a0a0a] text-gray-300">{children}</body></html>;
}
