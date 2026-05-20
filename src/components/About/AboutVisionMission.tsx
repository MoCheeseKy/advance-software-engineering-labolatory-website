import React from 'react';
import Wrapper from '@/components/_shared/Wrapper';

export default function AboutVisionMission() {
  const missions = [
    'Menciptakan lingkungan kerja dan kegiatan yang nyaman serta profesional.',
    'Menjalin sinergi luas lintas laboratorium dan fakultas dalam rumpun rekayasa perangkat lunak.',
    'Menghasilkan lulusan IT yang kompeten dan relevan dengan kebutuhan dunia kerja.',
  ];

  return (
    <section className='w-full  bg-[#F8F5F4] text-black'>
      <Wrapper className='flex flex-col items-center gap-16'>
        {/* Vision */}
        <div className='flex flex-col items-center text-center max-w-[850px] w-full'>
          <h2 className='text-[32px] md:text-[40px] font-bold mb-6'>
            Our <span className='text-primary'>Vision</span>
          </h2>
          <p className='text-base md:text-xl font-semibold leading-relaxed text-[#333] px-4 italic'>
            &ldquo;Membangun Laboratorium Advanced Software Engineering sebagai
            ruang berkembang yang nyaman dan suportif, menjadi wadah kolaborasi
            yang aktif, serta mencetak SDM IT yang kompeten dan siap terjun ke
            industri.&rdquo;
          </p>
        </div>

        {/* Mission */}
        <div className='flex flex-col items-center w-full max-w-[900px]'>
          <h2 className='text-[32px] md:text-[40px] font-bold mb-10'>
            Our <span className='text-primary'>Mission</span>
          </h2>

          <div className='flex flex-col gap-5 w-full'>
            {missions.map((mission, index) => (
              <div
                key={index}
                className='w-full py-4.5 px-6 md:px-10 text-center text-black font-semibold text-sm md:text-base border border-gray-300 rounded-full bg-white hover:bg-gray-50/80 transition-colors shadow-sm'
              >
                {mission}
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
