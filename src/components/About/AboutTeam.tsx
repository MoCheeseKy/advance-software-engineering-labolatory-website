import React from 'react';
import Wrapper from '@/components/_shared/Wrapper';

export default function AboutTeam() {
  const assistants = [
    { name: 'Zhafran', src: '/images/labolatory-assistance/zhafran.svg' },
    { name: 'Hafizh', src: '/images/labolatory-assistance/hafizh.svg' },
    { name: 'Deswita', src: '/images/labolatory-assistance/deswiita.svg' },
    { name: 'Nadya', src: '/images/labolatory-assistance/nadya.svg' },
    { name: 'Rifky', src: '/images/labolatory-assistance/rifky.svg' },
    { name: 'Yappier', src: '/images/labolatory-assistance/yappier.svg' },
    { name: 'Alvin', src: '/images/labolatory-assistance/alvin.svg' },
    { name: 'Edsel', src: '/images/labolatory-assistance/edsel.svg' },
    { name: 'Gavin', src: '/images/labolatory-assistance/gavin.svg' },
    { name: 'Gillbrian', src: '/images/labolatory-assistance/gillbrian.svg' },
  ];

  return (
    <section className='w-full  bg-white text-black'>
      <Wrapper className='flex flex-col items-center gap-16'>
        {/* Supervising Lecturer */}
        <div className='flex flex-col items-center w-full'>
          <h2 className='text-[30px] md:text-[36px] font-bold text-center mb-8'>
            Our <span className='text-primary'>Supervising Lecturer</span>
          </h2>
          <div className='flex justify-center'>
            <img
              src='/images/labolatory-assistance/fadhil.svg'
              alt='Fadil Al Afgani'
              className='w-full max-w-[200px] h-auto rounded-[20px] shadow-md hover:scale-[1.03] transition-transform duration-300'
            />
          </div>
        </div>

        {/* Lab's Assistance */}
        <div className='flex flex-col items-center w-full'>
          <h2 className='text-[30px] md:text-[36px] font-bold text-center mb-10'>
            Our <span className='text-primary'>Lab&apos;s Assistance</span>
          </h2>

          <div className='grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 justify-items-center w-full max-w-[700px]'>
            {assistants.map((assistant, index) => (
              <div
                key={index}
                className={`w-full max-w-[180px] md:max-w-[200px] flex justify-center ${
                  index === 9 ? 'col-span-2 md:col-span-1 md:col-start-2' : ''
                }`}
              >
                <img
                  src={assistant.src}
                  alt={assistant.name}
                  className='w-full h-auto rounded-[20px] shadow-md hover:scale-[1.03] transition-transform duration-300'
                />
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
