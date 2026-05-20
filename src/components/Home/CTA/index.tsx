import React from 'react';
import Wrapper from '@/components/_shared/Wrapper';
import Button from '@/components/_shared/Button';

export default function CTA() {
  return (
    <section className='w-full bg-white'>
      <Wrapper>
        <div
          className='relative w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-cover bg-center py-16 px-6 md:py-20 md:px-16 shadow-lg'
          style={{ backgroundImage: `url('/Images/ase-group-photo-1.svg')` }}
        >
          {/* Transparent black overlay to make bg darker */}
          <div className='absolute inset-0 bg-black/70 z-0' />

          {/* Content */}
          <div className='relative z-10 max-w-[850px] flex flex-col items-start text-white'>
            <h2 className='text-2xl md:text-[40px] font-bold mb-5 leading-tight md:leading-snug'>
              Bergabung dengan <br className='hidden md:block' />
              <span className='text-primary'>
                Advanced Software Engineering
              </span>{' '}
              Laboratory
            </h2>
            <p className='text-sm md:text-base text-white/80 font-medium mb-8 leading-relaxed max-w-[720px]'>
              Kembangkan potensimu bersama ASE Lab. Di sini, kamu akan terjun
              langsung mengerjakan proyek real-world seru di bidang Software
              Engineering dan Game Development.
            </p>
            <Button
              colorType='primary'
              className='!w-auto !rounded-lg !px-6 !py-3.5 !text-sm md:!text-base font-bold shadow-md hover:scale-[1.02] transition-transform'
            >
              Daftar Intern Sekarang!!
            </Button>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
