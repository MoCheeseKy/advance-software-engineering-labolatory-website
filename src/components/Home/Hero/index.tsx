import Link from 'next/link';
import Button from '@/components/_shared/Button';
import Wrapper from '@/components/_shared/Wrapper';

export default function Hero() {
  return (
    <section
      className='relative w-full h-[calc(100vh-81px)] bg-cover bg-center flex flex-col justify-center'
      style={{ backgroundImage: `url('/Images/labolatory-assistance/ours.jpg')` }}
    >
      {/* Black overlay */}
      <div className='absolute inset-0 bg-black/75 z-0' />

      <Wrapper className='relative z-10' backgroundColor='bg-transparent'>
        <div className='flex flex-col items-start gap-3 max-w-[850px]'>
          <h2 className='text-2xl md:text-3xl font-bold tracking-wide uppercase text-white'>
            WE ARE
          </h2>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-wide'>
            ADVANCED SOFTWARE ENGINEERING
          </h1>
          <p className='text-base md:text-lg text-white/90 font-medium leading-relaxed mt-2 mb-6 text-justify lg:text-left'>
            Laboratorium Advanced Software Engineering adalah Laboratorium Riset
            Fakultas Informatika Telkom University yang berfokus pada Research &
            Study Group di bidang Software Engineering dan Game Development
            Community.
          </p>
          <Link href='/about'>
            <Button colorType='primary' className='w-fit px-8 py-3 rounded-xl text-lg hover:scale-[1.02] transition-transform shadow-md'>
              Tentang Kami
            </Button>
          </Link>
        </div>
      </Wrapper>
    </section>
  );
}
