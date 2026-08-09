import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Wrapper from '@/components/_shared/Wrapper';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default async function BlogDetail({ params,}: {params: Promise<{ id: string }>;}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/blog/${id}`, {
    cache: 'no-store' 
  });

  if (!res.ok) {
    notFound(); 
  }

  const result = await res.json();
  const blog = result.data; 

  if (!blog) {
    notFound();
  }

  const imageUrl = (Array.isArray(blog.images) && blog.images.length > 0)
    ? blog.images[0]
    : (typeof blog.images === 'string' ? blog.images : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800');

  const authorName = (Array.isArray(blog.authors) && blog.authors.length > 0)
    ? blog.authors.join(', ')
    : (blog.admin?.username || 'Admin');

  const contentHtml = Array.isArray(blog.texts) ? blog.texts.join('<br><br>') : (blog.texts || '');

  return (
    <div className='w-full min-h-screen bg-white py-16 md:py-24'>
      <Wrapper className='flex flex-col items-center'>
        <div className='max-w-4xl w-full flex flex-col items-center text-center mb-10'>
          <h1 className='text-3xl md:text-5xl font-bold text-neutral-900 leading-snug mb-4'>
            {blog.title}
          </h1>
          <p className='text-neutral-500 text-sm md:text-base font-medium uppercase tracking-wider'>
            {formatDate(blog.createdAt)} / {authorName}
          </p>
        </div>

        <div className='w-full max-w-5xl mb-12 flex flex-col items-center'>
          <div className='relative w-full flex justify-center mb-6'>
            <Image
              src={imageUrl}
              alt={blog.title}
              width={1200}
              height={675}
              className='w-full h-auto max-h-[70vh] object-contain rounded-2xl md:rounded-3xl shadow-sm bg-gray-50'
              priority
            />
          </div>
        </div>

        <div 
          className='max-w-4xl w-full flex flex-col text-neutral-800 text-sm md:text-[15px] lg:text-base leading-relaxed text-justify
          [&_b]:font-bold [&_i]:italic [&_u]:underline 
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5
          [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-neutral-600
          [&_a]:text-primary [&_a]:underline hover:[&_a]:text-orange-600
          [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-6 [&_img]:mx-auto [&_img]:shadow-sm
          [&_p]:mb-4'
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        
      </Wrapper>
    </div>
  );
}