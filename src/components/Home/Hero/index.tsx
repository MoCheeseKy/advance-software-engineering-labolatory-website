import Button from '@/components/_shared/Button';
import Wrapper from '@/components/_shared/Wrapper';

export default function Hero() {
  return (
    <section className='flex flex-col h-[calc(100vh-81px)] justify-center bg-white text-black'>
      <Wrapper>
        <div className='flex flex-col items-start gap-3 max-w-[850px]'>
          <h2 className='text-2xl md:text-3xl font-bold tracking-wide uppercase text-black'>
            WE ARE
          </h2>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-wide'>
            ADVANCED SOFTWARE ENGINEERING
          </h1>
          <p className='text-base md:text-lg text-dark-mist font-medium leading-relaxed mt-2 mb-6 text-justify lg:text-left'>
            Laboratorium Advanced Software Engineering adalah Laboratorium Riset
            Fakultas Informatika Telkom University yang berfokus pada Research &
            Study Group di bidang Software Engineering dan Game Development
            Community.
          </p>
          <Button colorType='dark-mist' className='w-fit px-8 py-3 rounded-xl text-lg'>
            Tentang Kami
          </Button>
        </div>
      </Wrapper>
    </section>
  );
}
