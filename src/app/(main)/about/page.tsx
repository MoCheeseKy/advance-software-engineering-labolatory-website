import React from 'react';
import AboutHistory from '@/components/About/AboutHistory';
import AboutVisionMission from '@/components/About/AboutVisionMission';
import AboutTeam from '@/components/About/AboutTeam';

export default function AboutPage() {
  return (
    <>
      <div className='flex flex-col w-full gap-16 md:gap-32 bg-white pt-16 md:pt-32 pb-64'>
        <AboutHistory />
        <AboutVisionMission />
        <AboutTeam />
      </div>
    </>
  );
}
