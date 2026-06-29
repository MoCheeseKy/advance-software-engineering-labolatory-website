import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
