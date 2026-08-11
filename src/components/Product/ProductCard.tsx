import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/_shared/Button';

export interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  tags: string[];
}

export default function ProductCard({ id, image, title, description, tags }: ProductCardProps) {
  return (
    <div className='flex flex-col bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 h-full'>
      
      {/* Image Container */}
      <div className='relative h-[240px] w-full shrink-0'>
        <Image
          src={image}
          alt={title}
          fill
          className='object-cover rounded-t-[30px] rounded-bl-[32px]'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      {/* Content Container */}
      <div className='flex flex-col flex-grow p-8 pt-10 md:p-9 md:pt-11'>
        
        {/* Title */}
        <h3 className='text-black font-extrabold text-lg md:text-xl leading-snug mb-4 uppercase tracking-wide line-clamp-2'>
          {title}
        </h3>

        {/* Description */}
        <p className='text-[#8A8A8A] text-xs md:text-[13px] font-medium leading-relaxed mb-6 tracking-wide line-clamp-3 text-justify'>
          {description}
        </p>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mb-8'>
          {tags.map((tag, index) => (
            <span
              key={index}
              className='px-3 py-1 bg-orange-50 text-primary border border-orange-100 rounded-full text-[11px] font-bold uppercase tracking-wider'
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Button */}
        <div className='mt-auto flex justify-center'>
          <Link href={`/product/${id}`} className='w-fit'>
            <Button
              variant='outline'
              colorType='primary'
              className='w-full !rounded-full px-18 py-0.5 text-sm font-bold border-2 border-primary hover:bg-primary hover:text-white transition-all duration-200'
            >
              View Detail
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}