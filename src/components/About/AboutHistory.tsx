import React from 'react';
import Wrapper from '@/components/_shared/Wrapper';

export default function AboutHistory() {
  const timelineItems = [
    {
      year: 'XX XXXXX 20XX',
      desc: 'Pak Dana Sulistiyo Kusumo, S.T, M.T mendirikan Laboratorium Rekayasa Perangkat Lunak (RPL)',
    },
    {
      year: '2010',
      desc: 'Laboratorium Rekayasa Perangkat Lunak (RPL) berubah nama menjadi Laboratorium Rekayasa Perangkat Lunak dan Game Development Community (RPL-GDC)',
    },
    {
      year: '2020',
      desc: 'Laboratorium Rekayasa Perangkat Lunak dan Game Development Community (RPL-GDC) berubah nama menjadi Laboratorium Advanced Software Engineering (ASE)',
    },
  ];

  return (
    <section className='w-full bg-white text-black'>
      <Wrapper className='flex flex-col items-center'>
        {/* Title */}
        <div className='flex flex-col items-center mb-16'>
          <h2 className='text-primary text-[32px] md:text-[40px] font-bold pb-2 relative after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-[4px] after:bg-primary'>
            About Us
          </h2>
        </div>

        {/* Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full items-start'>
          {/* Left Column: History Details */}
          <div className='flex flex-col items-start'>
            <span className='text-black font-semibold text-lg md:text-xl mb-1'>
              History
            </span>
            <h1 className='text-3xl md:text-[40px] font-extrabold leading-tight mb-6 tracking-wide'>
              <span className='text-primary'>ADVANCED</span> <br />
              <span className='text-black'>SOFTWARE ENGINEERING</span>
            </h1>
            <p className='text-[#333] text-sm md:text-base leading-relaxed text-justify'>
              Laboratorium Advanced Software Engineering didirikan pada tahun
              20xx oleh Pak Dana Sulistiyo Kusumo, S.T, M.T dibawah nama
              Laboratorium Rekayasa Perangkat Lunak (RPL). Pada Tahun 2010
              berubah nama menjadi Laboratorium Rekayasa Perangkat Lunak dan
              Game Development Community (RPL-GDC). Dan terakhir pada tahun 2020
              berubah nama menjadi Laboratorium Advanced Software Engineering
              (ASE).
            </p>
          </div>

          {/* Right Column: Timeline */}
          <div className='relative flex flex-col gap-10 py-2'>
            {/* Vertical Line */}
            <div className='absolute left-3 md:left-4 top-2 bottom-2 w-[3px] bg-[#FDD9B5]' />

            {timelineItems.map((item, index) => (
              <div
                key={index}
                className='relative pl-10 md:pl-14 flex flex-col gap-1'
              >
                {/* Dot */}
                <div className='absolute left-0 top-1 w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary border-[4px] border-white shadow-md' />

                {/* Year */}
                <h3 className='text-black font-bold text-base md:text-lg leading-none mb-1'>
                  {item.year}
                </h3>
                {/* Description */}
                <p className='text-[#555] text-xs md:text-sm font-medium leading-relaxed max-w-[450px]'>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
