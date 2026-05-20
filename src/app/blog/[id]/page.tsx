import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DUMMY_BLOGS } from '@/data/blog';
import Wrapper from '@/components/_shared/Wrapper';

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const blog = DUMMY_BLOGS.find((b) => b.id === Number(resolvedParams.id));

  if (!blog) {
    notFound();
  }

  return (
    <div className='w-full min-h-screen bg-white py-16 md:py-24'>
      <Wrapper className='flex flex-col items-center'>
        <div className='max-w-4xl w-full flex flex-col items-center text-center mb-10'>
          <h1 className='text-3xl md:text-5xl font-bold text-neutral-900 leading-snug mb-4'>
            {blog.title}
          </h1>
          <p className='text-neutral-500 text-sm md:text-base font-medium'>
            {blog.date} / {blog.author}
          </p>
        </div>

        <div className='w-full max-w-5xl mb-12 flex flex-col items-center'>
          <div className='relative w-full aspect-[16/9] md:aspect-[2/1] lg:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm mb-6'>
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className='object-cover'
              priority
            />
          </div>
          {blog.imageCaption && (
            <p className='text-neutral-700 italic text-sm md:text-base'>
              {blog.imageCaption}
            </p>
          )}
        </div>

        <div className='max-w-4xl w-full flex flex-col gap-6 text-neutral-800 text-sm md:text-[15px] lg:text-base leading-relaxed text-justify'>
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}
