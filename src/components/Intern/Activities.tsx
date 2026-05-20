import React from 'react';
import ActivityCard from './ActivityCard';

const activities = [
  {
    title: 'Study Group',
    imageSrc: '/Images/activities/study-group.svg',
    description:
      'Tempat belajar dan diskusi bareng tentang Software Engineering dan Game Development, sekaligus praktek langsung guna memperdalam materi yang dipelajari',
  },
  {
    title: 'Open Project',
    imageSrc: '/Images/activities/open-project.svg',
    description:
      'Proyek open source yang terbuka untuk seluruh member ASE, bertujuan mempererat kerja sama dan meningkatkan keterampilan melalui pengembangan proyek nyata',
  },
  {
    title: 'BondASE',
    imageSrc: '/Images/activities/bond-ase.svg',
    description:
      'Acara spesial yang mengajak seluruh anggota ASE untuk berpartisipasi dalam kegiatan menyenangkan dan penuh keakraban, guna membangun hubungan lebih erat dan solid antar member',
  },
  {
    title: 'Research Group',
    imageSrc: '/Images/activities/research-group.svg',
    description:
      'Wadah kolaborasi untuk mengeksplorasi dan meneliti inovasi teknologi terbaru di bidang Software Engineering, berfokus pada analisis mendalam hingga penciptaan solusi berbasis riset.',
  },
  {
    title: 'Internship',
    imageSrc: '/Images/activities/internship.svg',
    description:
      'Proses seleksi anggota ASE yang dimulai dari seleksi dokumen dan wawancara. Peserta terpilih akan dibagi menjadi kelompok kecil (3-5 orang) untuk mengerjakan proyek aplikasi atau game.',
  },
];

export default function Activities() {
  return (
    <section className='w-full overflow-hidden bg-white'>
      <div className='flex flex-col items-center text-center bg-white text-black mb-12'>
        <h2 className='text-primary text-[48px] md:text-[56px] font-bold leading-none mb-3'>
          Activities
        </h2>
        <p className='text-black font-bold text-sm md:text-xl max-w-[800px]'>
          Aktivitas di Laboratorium Advanced Software Engineering
        </p>
      </div>

      <div
        className='flex w-max'
        style={{ animation: 'marquee-right 40s linear infinite' }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className='flex gap-4 md:gap-6 px-2 md:px-3'>
            {activities.map((activity, index) => (
              <ActivityCard
                key={index}
                title={activity.title}
                imageSrc={activity.imageSrc}
                description={activity.description}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
