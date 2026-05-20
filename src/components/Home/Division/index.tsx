'use client';

import React, { useState } from 'react';
import Button from '@/components/_shared/Button';
import Wrapper from '@/components/_shared/Wrapper';
import SheetModal from '@/components/_shared/SheetModal';
import DivisionItem from './DivisionItem';
import {
  DivisionData,
  topDivisions,
  middleLeftDivisions,
  middleRightDivisions,
  bottomDivisions,
} from './divisionsData';

export default function Division() {
  const [selectedDivision, setSelectedDivision] = useState<DivisionData | null>(
    null,
  );

  const handleOpenModal = (division: DivisionData) => {
    setSelectedDivision(division);
  };

  const handleCloseModal = () => {
    setSelectedDivision(null);
  };

  return (
    <Wrapper
      className='flex flex-col items-center justify-center relative w-full max-w-6xl min-h-[100vh] py-16 md:py-32 lg:py-0'
      backgroundColor='bg-[#F8F5F4]'
    >
      <div className='flex flex-col items-center text-center text-black mb-10'>
        <p className='text-[32px] font-semibold'>Our</p>
        <p className='text-primary text-[64px] font-bold'>Divisions</p>
      </div>
      <div className='flex lg:hidden justify-center relative w-48 h-48 mb-8 shrink-0 z-0'>
        <div className='absolute w-40 h-40 bg-[#FDD9B5] rounded-[32px] transform rotate-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
        <div className='absolute w-40 h-40 bg-primary rounded-[32px] transform -rotate-3 flex items-center justify-center shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <span className='text-white text-6xl font-bold tracking-tighter'>
            &lt;/&gt;
          </span>
        </div>
      </div>

      {/* Top Row */}
      <div className='flex flex-col md:flex-row items-center gap-4 md:gap-10 w-full justify-center'>
        {topDivisions.map((item, index) => (
          <DivisionItem
            key={index}
            title={item.title}
            icon={item.icon}
            iconPosition={item.iconPosition}
            onClick={() => handleOpenModal(item)}
          />
        ))}
      </div>

      {/* Middle Row */}
      <div className='flex flex-col lg:flex-row justify-between items-center w-full gap-4 md:gap-10 py-4 md:py-10'>
        <div className='flex flex-col gap-4 md:gap-10 grow items-center lg:items-end w-full lg:w-auto'>
          {middleLeftDivisions.map((item, index) => (
            <DivisionItem
              key={index}
              title={item.title}
              icon={item.icon}
              iconPosition={item.iconPosition}
              onClick={() => handleOpenModal(item)}
            />
          ))}
        </div>

        {/* Desktop Center Logo (Visible only on desktop lg+) */}
        <div className='hidden lg:flex justify-center self-center relative w-56 h-56 shrink-0 z-0'>
          <div className='absolute w-48 h-48 bg-[#FDD9B5] rounded-[36px] transform rotate-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
          <div className='absolute w-48 h-48 bg-primary rounded-[36px] transform -rotate-3 flex items-center justify-center shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <span className='text-white text-7xl font-bold tracking-tighter'>
              &lt;/&gt;
            </span>
          </div>
        </div>

        <div className='flex flex-col gap-4 md:gap-10 grow items-center lg:items-start w-full lg:w-auto'>
          {middleRightDivisions.map((item, index) => (
            <DivisionItem
              key={index}
              title={item.title}
              icon={item.icon}
              iconPosition={item.iconPosition}
              onClick={() => handleOpenModal(item)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className='flex flex-col md:flex-row items-center gap-4 md:gap-10 w-full justify-center'>
        {bottomDivisions.map((item, index) => (
          <DivisionItem
            key={index}
            title={item.title}
            icon={item.icon}
            iconPosition={item.iconPosition}
            onClick={() => handleOpenModal(item)}
          />
        ))}
      </div>

      {/* Button */}
      <div className='mt-16 z-20'>
        <Button
          colorType='primary'
          className='!rounded-lg px-8 py-3.5 text-base md:text-lg w-fit shadow-md font-semibold tracking-wide'
        >
          Learn More About our Division
        </Button>
      </div>

      {/* Sheet Modal */}
      <SheetModal
        isOpen={!!selectedDivision}
        onClose={handleCloseModal}
        title={selectedDivision?.title || ''}
        icon={selectedDivision?.icon}
        description={selectedDivision?.description || ''}
      />
    </Wrapper>
  );
}
