import React from 'react';
import Wrapper from '@/components/_shared/Wrapper';

export default function Requirements() {
  const reqs = [
    'Dokumen Curriculum Vitae',
    'Dokumen Motivation Letter',
    'Dokumen Portofolio (Jika Ada)',
  ];

  return (
    <section className='w-full bg-white'>
      <Wrapper className='flex flex-col items-center'>
        <div className='text-center mb-12'>
          <h2 className='text-primary text-[48px] md:text-[56px] font-bold leading-none mb-3'>
            Requirements
          </h2>
          <p className='text-dark-mist font-semibold text-sm md:text-base'>
            Dokumen yang harus disiapkan untuk mendaftar
          </p>
        </div>

        <div className='flex flex-col gap-6 w-full max-w-[700px]'>
          {reqs.map((req, index) => (
            <div
              key={index}
              className='flex items-center gap-4 md:gap-6 w-full'
            >
              {/* Number Circle */}
              <div className='w-14 h-14 rounded-full bg-[#3A3A3A] text-white flex items-center justify-center font-bold text-lg md:text-xl shrink-0 shadow-sm'>
                {index + 1}
              </div>

              {/* Requirement Pill */}
              <div className='flex-grow bg-[#FEEADB] text-black font-bold text-sm md:text-base py-4 px-6 md:px-8 rounded-[16px] shadow-sm hover:scale-[1.01] transition-transform duration-200'>
                {req}
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
