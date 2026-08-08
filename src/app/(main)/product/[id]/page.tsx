import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Wrapper from '@/components/_shared/Wrapper';

// Helper untuk mengekstrak data dari array texts
function extractText(texts: string[], prefix: string): string {
  const entry = (texts ?? []).find((t: string) => t.startsWith(`${prefix}:`));
  return entry ? entry.slice(prefix.length + 1) : '';
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Mengambil data dari API publik
  const res = await fetch(`${baseUrl}/api/product/${id}`, {
    cache: 'no-store' 
  });

  if (!res.ok) {
    notFound(); 
  }

  const result = await res.json();
  const product = result.data; 

  if (!product) {
    notFound();
  }

  // Ekstraksi data dari format array texts
  const texts: string[] = product.texts ?? [];
  const group = extractText(texts, 'group') || 'Independent Project';
  const repository = extractText(texts, 'repo');
  const description = extractText(texts, 'desc') || 'Tidak ada deskripsi.';
  const tags = texts.filter(t => t.startsWith('tag:')).map(t => t.slice(4));

  // Pemrosesan gambar utama (fallback ke placeholder jika kosong)
  const imageUrl = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images[0]
    : (typeof product.images === 'string' ? product.images : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800');

  // Pemrosesan data developer (hanya nama dan role, tanpa avatar)
  const developers = (product.developers ?? []).map((d: string) => {
    const dashIdx = d.indexOf(' - ');
    const name = dashIdx !== -1 ? d.slice(0, dashIdx) : d;
    const role = dashIdx !== -1 ? d.slice(dashIdx + 3) : 'Member';
    return { name, role };
  });

  return (
    <div className='w-full min-h-screen bg-white py-16 md:py-24 text-neutral-800'>
      <Wrapper className='flex flex-col items-center'>
        {/* Header */}
        <div className='max-w-4xl w-full flex flex-col items-center text-center mb-10'>
          <h1 className='text-3xl md:text-5xl font-black text-neutral-900 leading-snug mb-3 uppercase tracking-wide'>
            {product.name}
          </h1>
          <p className='text-primary text-sm md:text-base font-bold uppercase tracking-widest'>
            {group}
          </p>
        </div>

        {/* Hero Image - Bingkai mengikuti foto alami tanpa memotong */}
        <div className='w-full max-w-5xl mb-16 flex justify-center'>
          <div className='relative w-full flex justify-center mb-6'>
            <Image
              src={imageUrl}
              alt={product.name}
              width={1200}
              height={675}
              className='w-full h-auto max-h-[70vh] object-contain rounded-2xl md:rounded-3xl shadow-sm bg-gray-50'
              priority
            />
          </div>
        </div>

        {/* Main Content (Deskripsi) */}
        <div className='max-w-4xl w-full flex flex-col gap-6 text-sm md:text-[15px] lg:text-base leading-relaxed text-justify mb-16'>
          <div
            className='prose prose-neutral max-w-none whitespace-pre-line font-medium text-gray-700'
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* Meta Box (Tags & Repo) */}
        <div className='max-w-4xl w-full bg-orange-50/70 border border-orange-100 rounded-2xl p-6 md:p-8 mb-12 flex flex-col gap-6'>
          {tags.length > 0 && (
            <div className='flex flex-wrap gap-3'>
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className='px-4 py-1.5 bg-white border border-neutral-300 rounded-md text-xs font-bold text-neutral-800 uppercase tracking-wider'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className='text-sm md:text-base'>
            <span className='font-bold text-neutral-900'>Project Repository : </span>
            {repository ? (
              <a
                href={repository}
                target='_blank'
                rel='noreferrer'
                className='font-bold text-blue-600 hover:text-primary transition-colors underline break-all'
              >
                {repository}
              </a>
            ) : (
              <span className='text-gray-500 italic'>Tidak ada tautan repositori yang dilampirkan.</span>
            )}
          </div>
        </div>

        {/* Developers Section */}
        {developers.length > 0 && (
          <div className='max-w-4xl w-full grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] gap-8 items-start'>
            <h3 className='text-xl md:text-2xl font-bold text-neutral-900 mt-2'>
              Developer Dibalik Project Ini
            </h3>
            
            <div className='flex flex-col gap-6'>
              {/* Developer List */}
              <ol className='flex flex-col gap-3 text-sm md:text-base font-semibold text-neutral-800 border-l-2 border-gray-100 pl-4 mt-2'>
                {developers.map((dev: any, idx: number) => (
                  <li key={idx} className='flex flex-col md:flex-row md:items-center gap-1 md:gap-2'>
                    <span className="text-primary font-bold">{dev.name}</span>
                    <span className='text-neutral-400 font-medium hidden md:inline'>|</span>
                    <span className="text-gray-500 font-medium text-sm">{dev.role}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Wrapper>
    </div>
  );
}