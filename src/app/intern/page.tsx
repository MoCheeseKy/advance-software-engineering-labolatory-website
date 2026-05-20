import React from 'react';
import InternHero from '@/components/Intern/InternHero';
import Division from '@/components/Home/Division';
import Activities from '@/components/Intern/Activities';
import Benefits from '@/components/Intern/Benefits';
import Timeline from '@/components/Intern/Timeline';
import Requirements from '@/components/Intern/Requirements';

export default function InternPage() {
  return (
    <>
      <InternHero />
      <Division />
      <div className='flex flex-col w-full gap-16 md:gap-32 bg-white pt-16 md:pt-32 pb-64'>
        <Activities />
        <Benefits />
        <Timeline />
        <Requirements />
      </div>
    </>
  );
}
