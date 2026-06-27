import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DUMMY_PRODUCTS } from '@/data/product';
import Wrapper from '@/components/_shared/Wrapper';

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = DUMMY_PRODUCTS.find((p) => p.id === Number(resolvedParams.id));

  if (!product) {
    notFound();
  }

  return (
    <div className='w-full min-h-screen bg-white py-16 md:py-24 text-neutral-800'>
      <Wrapper className='flex flex-col items-center'>
        {/* Header */}
        <div className='max-w-4xl w-full flex flex-col items-center text-center mb-10'>
          <h1 className='text-3xl md:text-5xl font-black text-neutral-900 leading-snug mb-3'>
            {product.title}
          </h1>
          <p className='text-neutral-500 text-sm md:text-base font-medium'>
            {product.group}
          </p>
        </div>

        {/* Hero Image */}
        <div className='w-full max-w-5xl mb-16 flex justify-center'>
          <div className='relative w-full aspect-[4/3] md:aspect-[21/9] lg:aspect-[2.5/1]'>
            <Image
              src={product.image}
              alt={product.title}
              fill
              className='object-contain md:object-cover'
              priority
            />
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-4xl w-full flex flex-col gap-6 text-sm md:text-[15px] lg:text-base leading-relaxed text-justify mb-16'>
          <div
            className='prose prose-neutral max-w-none'
            dangerouslySetInnerHTML={{ __html: product.contentHtml }}
          />
        </div>

        {/* Meta Box (Tags & Repo) */}
        <div className='max-w-4xl w-full bg-orange-50/70 border border-orange-100 rounded-2xl p-6 md:p-8 mb-12 flex flex-col gap-6'>
          <div className='flex flex-wrap gap-3'>
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className='px-4 py-1.5 bg-white border border-neutral-300 rounded-md text-xs font-semibold text-neutral-800'
              >
                {tag}
              </span>
            ))}
          </div>
          <div className='text-sm md:text-base'>
            <span className='font-bold text-neutral-900'>Project Repository : </span>
            <a
              href={product.repository}
              target='_blank'
              rel='noreferrer'
              className='font-bold text-neutral-900 hover:text-primary transition-colors'
            >
              {product.repository}
            </a>
          </div>
        </div>

        {/* Developers */}
        <div className='max-w-4xl w-full grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] gap-8 items-start'>
          <h3 className='text-xl md:text-2xl font-bold text-neutral-900 mt-2'>
            Developer Dibalik {product.title}
          </h3>
          
          <div className='flex flex-col gap-6'>
            {/* Avatars */}
            <div className='flex items-center -space-x-4'>
              {product.developers.map((dev, idx) => (
                <div
                  key={idx}
                  className='relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white shadow-sm bg-neutral-200 z-[idx] hover:z-10 transition-transform hover:scale-110'
                  style={{ zIndex: 10 - idx }}
                >
                  <Image
                    src={dev.avatar}
                    alt={dev.name}
                    fill
                    className='object-cover'
                  />
                </div>
              ))}
            </div>

            {/* Developer List */}
            <ol className='flex flex-col gap-2 list-decimal list-inside text-sm md:text-base font-semibold text-neutral-800'>
              {product.developers.map((dev, idx) => (
                <li key={idx}>
                  {dev.name} <span className='text-neutral-500 font-medium'>| {dev.role}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
