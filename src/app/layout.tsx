import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Advance Software Engineering',
  description:
    'Telkom University Bandung Labolatory who design for the future of software engineering.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${montserrat.variable} font-sans h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
