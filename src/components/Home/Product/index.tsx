'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import { DUMMY_PRODUCTS } from '@/data/product';

export default function Product() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DUMMY_PRODUCTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className='w-full bg-white'>
      <Wrapper className='flex flex-col items-center'>
        <div className='flex flex-col items-center text-center text-black mb-10'>
          <p className='text-[32px] font-semibold leading-tight'>Our</p>
          <h2 className='text-primary text-[56px] md:text-[64px] font-bold leading-tight'>
            Product
          </h2>
        </div>

        <div className='relative w-full max-w-[900px] overflow-hidden rounded-[24px] md:rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] bg-white'>
          <div
            className='flex transition-transform duration-700 ease-in-out'
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {DUMMY_PRODUCTS.map((product) => (
              <div
                key={product.id}
                className='relative w-full shrink-0 aspect-[16/9] md:aspect-[2/1] group'
              >
                <Link href={`/product/${product.id}`} className='block w-full h-full relative'>
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className='object-cover md:object-contain p-0 md:p-4'
                  />

                  {/* Hover Overlay */}
                  <div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-8 backdrop-blur-sm'>
                    <h3 className='text-white text-2xl md:text-4xl font-bold mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
                      {product.title}
                    </h3>
                    <p className='text-neutral-200 text-sm md:text-lg max-w-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75'>
                      {product.description}
                    </p>
                    <div className='mt-8 px-6 py-2 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150'>
                      View Detail
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10'>
            {DUMMY_PRODUCTS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-neutral-300 hover:bg-primary/50 w-2.5'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <Link
          href='/product'
          className='mt-12 bg-primary hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm md:text-base'
        >
          More Product
        </Link>
      </Wrapper>
    </section>
  );
}
