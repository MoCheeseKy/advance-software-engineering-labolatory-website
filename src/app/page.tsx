import Hero from '@/components/Home/Hero';
import Division from '@/components/Home/Division';
import Product from '@/components/Home/Product';
import AssistanceImageCarousel from '@/components/Home/AssistanceImageCarousel';
import Blog from '@/components/Home/Blog';
import CTA from '@/components/Home/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Division />
      <div className='flex flex-col w-full gap-16 md:gap-32 bg-white pt-16 md:pt-32 pb-64'>
        <CTA />
        <Product />
        <Blog />
        <AssistanceImageCarousel />
      </div>
    </>
  );
}
