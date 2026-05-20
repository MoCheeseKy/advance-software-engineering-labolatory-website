import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  tags: string[];
}

export default function ProductCard({
  id,
  image,
  title,
  description,
  tags,
}: ProductCardProps) {
  return (
    <div className='flex flex-col bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 w-full border border-gray-100/50'>
      {/* Image Container */}
      <div className='relative w-full aspect-[288/140] bg-white'>
        <Image
          src={image}
          alt={title}
          fill
          className='object-cover rounded-t-[24px]'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      {/* Content Container */}
      <div className='flex flex-col p-5 md:p-6 flex-grow bg-white'>
        <h3 className='text-primary font-bold text-lg md:text-xl mb-2'>
          {title}
        </h3>
        <p className='text-black text-xs md:text-sm leading-relaxed mb-4 flex-grow font-semibold'>
          {description}
        </p>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mb-6'>
          {tags.map((tag, index) => (
            <span
              key={index}
              className='border border-gray-500 text-black text-[11px] md:text-xs font-bold px-4 py-1.5 rounded-lg'
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Button */}
        <Link href={`/product/${id}`} className='w-full'>
          <button className='w-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 font-bold text-xs md:text-sm py-2.5 rounded-full'>
            Ketahui Lebih Lanjut
          </button>
        </Link>
      </div>
    </div>
  );
}
