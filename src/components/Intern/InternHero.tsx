import React from 'react';
import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import Button from '@/components/_shared/Button';

export default function InternHero() {
  return (
    <section
      className='relative w-full h-[calc(100vh-81px)] bg-cover bg-center flex items-center'
      style={{ backgroundImage: `url('/Images/ase-group-photo-1.svg')` }}
    >
      {/* Black overlay */}
      <div className='absolute inset-0 bg-black/75 z-0' />

      <Wrapper className='relative z-10' backgroundColor='bg-transparent'>
        <div className='flex flex-col items-start text-white'>
          <h1 className='text-3xl md:text-5xl lg:text-[56px] font-bold mb-6 leading-tight md:leading-snug'>
            Internship Bersama <br />
            <span className='text-primary'>
              Advanced Software Engineering
            </span>{' '}
            Laboratory
          </h1>
          <p className='text-sm md:text-lg text-white/80 font-medium mb-10 leading-relaxed max-w-[720px]'>
            Kembangkan potensimu bersama ASE Lab. Di sini, kamu akan terjun
            langsung mengerjakan proyek real-world seru di bidang Software
            Engineering dan Game Development.
          </p>
          <Link href='/intern/register'>
            <Button
              colorType='primary'
              className='!w-auto !rounded-lg !px-8 !py-4 !text-base md:!text-lg font-bold shadow-md hover:scale-[1.02] transition-transform'
            >
              Daftar Intern Sekarang!!
            </Button>
          </Link>
        </div>
      </Wrapper>
    </section>
  );
}
