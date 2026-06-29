import React from 'react';
import Wrapper from '@/components/_shared/Wrapper';
import ProductCard from '@/components/Product/ProductCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { DUMMY_PRODUCTS } from '@/data/product';

export default function ProductPage() {
  return (
    <section className='w-full bg-white text-black'>
      <Wrapper className='flex flex-col items-center pt-16 md:pt-32 pb-64'>
        {/* Title */}
        <div className='flex flex-col items-center mb-16'>
          <h2 className='text-primary text-[32px] md:text-[40px] font-bold pb-2 relative after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-[4px] after:bg-primary'>
            Product
          </h2>
        </div>

        {/* Product Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full mb-16'>
          {DUMMY_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              description={product.description}
              tags={product.tags}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-center gap-3 mt-4'>
          {/* Previous Button */}
          <button className='flex items-center gap-1.5 border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm md:text-base transition-colors duration-200 cursor-pointer shadow-sm'>
            <FiChevronLeft className='text-lg md:text-xl' />
            <span>Previous</span>
          </button>

          {/* Page 1 (Active) */}
          <button className='w-11 h-11 bg-primary text-white rounded-xl font-bold text-sm md:text-base flex items-center justify-center cursor-pointer shadow-sm'>
            1
          </button>

          {/* Page 2 (Inactive) */}
          <button className='w-11 h-11 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-bold text-sm md:text-base flex items-center justify-center transition-colors duration-200 cursor-pointer shadow-sm'>
            2
          </button>

          {/* Next Button */}
          <button className='flex items-center gap-1.5 border-2 border-primary text-primary hover:bg-primary hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm md:text-base transition-colors duration-200 cursor-pointer shadow-sm'>
            <span>Next</span>
            <FiChevronRight className='text-lg md:text-xl' />
          </button>
        </div>
      </Wrapper>
    </section>
  );
}
