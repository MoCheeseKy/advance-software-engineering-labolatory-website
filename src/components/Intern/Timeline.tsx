import React from 'react';
import Wrapper from '@/components/_shared/Wrapper';
import {
  FiChevronRight,
  FiChevronDown,
  FiFileText,
  FiUsers,
  FiCode,
} from 'react-icons/fi';

export default function Timeline() {
  const steps = [
    {
      label: 'Seleksi Berkas',
      icon: <FiFileText className='text-5xl text-black' />,
    },
    {
      label: 'Wawancara',
      icon: <FiUsers className='text-5xl text-black' />,
    },
    {
      label: 'Internship',
      icon: <FiCode className='text-5xl text-black' />,
    },
  ];

  return (
    <section className='w-full bg-white'>
      <Wrapper className='flex flex-col items-center'>
        <div className='text-center mb-12'>
          <h2 className='text-primary text-[48px] md:text-[56px] font-bold leading-none mb-3'>
            Timeline Internship
          </h2>
          <p className='text-dark-mist font-semibold text-sm md:text-base'>
            Timeline pelaksanaan internship
          </p>
        </div>

        <div className='flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 w-full max-w-[1000px]'>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Step Card */}
              <div className='flex flex-col items-center justify-center bg-[#FEEADB] rounded-[24px] w-64 h-44 shadow-sm transition-transform hover:scale-[1.02] duration-300 shrink-0'>
                <div className='mb-4'>{step.icon}</div>
                <span className='text-black font-bold text-base md:text-lg'>
                  {step.label}
                </span>
              </div>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <>
                  <FiChevronRight className='hidden lg:block text-primary text-4xl shrink-0' />
                  <FiChevronDown className='lg:hidden text-primary text-4xl shrink-0 my-2' />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </Wrapper>
    </section>
  );
}
