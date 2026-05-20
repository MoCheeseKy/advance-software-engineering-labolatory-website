import React from 'react';
import Wrapper from '@/components/_shared/Wrapper';
import Button from '@/components/_shared/Button';
import BlogCard from './BlogCard';
import { DUMMY_BLOGS } from '@/data/blog';

export default function Blog() {
  return (
    <section className='w-full bg-white'>
      <Wrapper className='flex flex-col items-center'>
        <div className='flex flex-col items-center text-center bg-white text-black mb-10'>
          <p className='text-[32px] font-semibold'>Our</p>
          <p className='text-primary text-[64px] font-bold'>Blogs</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-10'>
          {DUMMY_BLOGS.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              image={blog.image}
              date={blog.date}
              category={blog.category}
              title={blog.title}
              excerpt={blog.excerpt}
            />
          ))}
        </div>

        {/* More Blog Button */}
        <Button
          variant='solid'
          colorType='primary'
          className='w-fit !rounded-[16px] px-10 py-3 text-lg font-bold shadow-md'
        >
          More Blog
        </Button>
      </Wrapper>
    </section>
  );
}
