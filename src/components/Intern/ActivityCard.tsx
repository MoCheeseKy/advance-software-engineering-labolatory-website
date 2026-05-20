import React from 'react';

export interface ActivityCardProps {
  title: string;
  imageSrc: string;
  description: string;
}

export default function ActivityCard({
  title,
  imageSrc,
  description,
}: ActivityCardProps) {
  return (
    <div className='flex flex-col bg-[#FEEADB] p-4 md:p-5 rounded-[20px] shadow-sm w-[280px] md:w-[320px] shrink-0'>
      <div className='w-full h-[160px] md:h-[180px] relative mb-4'>
        <img
          src={imageSrc}
          alt={title}
          className='w-full h-full object-cover rounded-xl'
        />
      </div>
      <h3 className='text-primary font-bold text-xl md:text-2xl mb-2'>
        {title}
      </h3>
      <p className='text-black text-xs md:text-[13px] leading-relaxed text-justify'>
        {description}
      </p>
    </div>
  );
}
