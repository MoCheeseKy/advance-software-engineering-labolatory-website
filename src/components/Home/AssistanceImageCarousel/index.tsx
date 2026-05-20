import React from 'react';
import Image from 'next/image';

interface Assistant {
  name: string;
  image: string;
}

const assistants: Assistant[] = [
  { name: 'Hafizh', image: '/Images/labolatory-assistance/hafizh.svg' },
  { name: 'Deswita', image: '/Images/labolatory-assistance/deswiita.svg' },
  { name: 'Nadya', image: '/Images/labolatory-assistance/nadya.svg' },
  { name: 'Rifky', image: '/Images/labolatory-assistance/rifky.svg' },
  { name: 'Yappier', image: '/Images/labolatory-assistance/yappier.svg' },
  { name: 'Alvin', image: '/Images/labolatory-assistance/alvin.svg' },
  { name: 'Edsel', image: '/Images/labolatory-assistance/edsel.svg' },
  { name: 'Gavin', image: '/Images/labolatory-assistance/gavin.svg' },
  { name: 'Gillbrian', image: '/Images/labolatory-assistance/gillbrian.svg' },
  { name: 'Zhafran', image: '/Images/labolatory-assistance/zhafran.svg' },
];

export default function AssistanceImageCarousel() {
  return (
    <section className='w-full overflow-hidden bg-white'>
      <div className='flex flex-col items-center text-center bg-white text-black mb-10'>
        <p className='text-[32px] font-semibold'>Our</p>
        <p className='text-primary text-[64px] font-bold'>Blogs</p>
      </div>
      <div
        className='flex w-max'
        style={{ animation: 'marquee-right 40s linear infinite' }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className='flex gap-4 md:gap-5 px-2 md:px-2.5'>
            {assistants.map((assistant, index) => (
              <div
                key={index}
                className='relative w-[180px] h-[260px] md:w-[220px] md:h-[300px] lg:w-[260px] lg:h-[340px] rounded-[20px] overflow-hidden shrink-0 group shadow-sm'
              >
                <Image
                  src={assistant.image}
                  alt={assistant.name}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 180px, (max-width: 1024px) 220px, 260px'
                  priority={i === 0 && index < 5}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
