import React from 'react';
import Wrapper from '@/components/_shared/Wrapper';

export default function Benefits() {
  const benefitList = [
    'Mempelajari mendalam terkait bidang-bidang Software Engineering dan Game Development',
    'Mengimplementasikan teknologi standar industri ke dalam proyek nyata',
    'Membangun koneksi baru dengan sesama member yang memiliki ketertarikan yang sama',
    'Mendapatkan pengalaman membangun proyek perangkat lunak nyata secara berkelompok',
  ];

  return (
    <section className='w-full bg-white'>
      <Wrapper className='flex flex-col items-center'>
        <div className='text-center mb-12'>
          <h2 className='text-primary text-[48px] md:text-[56px] font-bold leading-none mb-3'>
            Benefits
          </h2>
          <p className='text-dark-mist font-semibold text-sm md:text-base'>
            Keuntungan yang kamu dapat kalo join ASE!!!
          </p>
        </div>

        <div className='flex flex-col gap-6 w-full max-w-[900px]'>
          {benefitList.map((benefit, index) => (
            <div
              key={index}
              className='w-full py-4 px-6 md:px-10 text-center text-black font-medium text-sm md:text-base border border-gray-400 rounded-full hover:bg-gray-50 transition-colors shadow-sm'
            >
              {benefit}
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
