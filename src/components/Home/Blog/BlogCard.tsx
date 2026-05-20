import React from 'react';
import Link from 'next/link';
import Button from '@/components/_shared/Button';

interface BlogCardProps {
  id: number;
  image: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
}

export default function BlogCard({
  id,
  image,
  date,
  category,
  title,
  excerpt,
}: BlogCardProps) {
  return (
    <div className='flex flex-col bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 h-full'>
      {/* Image Container */}
      <div className='relative h-[240px] w-full shrink-0'>
        <img
          src={image}
          alt={title}
          className='w-full h-full object-cover rounded-t-[30px] rounded-bl-[32px]'
        />
        {/* Date Badge - overlapping 50% on image and content */}
        <div className='absolute bottom-0 right-0 translate-y-1/2 bg-primary text-white px-6 py-2.5 rounded-l-2xl text-sm font-bold tracking-wide shadow-md z-10'>
          {date}
        </div>
      </div>

      {/* Content Container */}
      <div className='flex flex-col flex-grow p-8 pt-10 md:p-9 md:pt-11'>
        {/* Category */}
        <span className='text-primary font-bold text-sm mb-3 tracking-wider'>
          {category}
        </span>

        {/* Title */}
        <h3 className='text-black font-extrabold text-lg md:text-xl leading-snug mb-4 uppercase tracking-wide line-clamp-2'>
          {title}
        </h3>

        {/* Excerpt */}
        <p className='text-[#8A8A8A] text-xs md:text-[13px] font-medium leading-relaxed mb-8 uppercase tracking-wide line-clamp-3 text-justify'>
          {excerpt}
        </p>

        {/* Button */}
        <div className='mt-auto flex justify-center'>
          <Link href={`/blog/${id}`} className='w-fit'>
            <Button
              variant='outline'
              colorType='primary'
              className='w-full !rounded-full px-8 py-2.5 text-sm font-bold border-2 border-primary hover:bg-primary hover:text-white transition-all duration-200'
            >
              Baca Selengkapnya
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
