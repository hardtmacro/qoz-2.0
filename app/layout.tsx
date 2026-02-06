import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QOZ 2.0 Investment Dashboard | Alpharetta GA',
  description: 'Discover land and lot investment opportunities in Qualified Opportunity Zones near Alpharetta, Georgia. QOZ 2.0 2027 eligibility tracker.',
  keywords: ['QOZ', 'Qualified Opportunity Zone', 'Alpharetta', 'Real Estate', 'Investment', 'Land', 'Commercial'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
