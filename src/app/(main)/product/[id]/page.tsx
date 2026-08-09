import React from 'react';
import { notFound } from 'next/navigation';
import Wrapper from '@/components/_shared/Wrapper';
import ImageCarousel from '@/components/_shared/ImageCarousel'; 

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

  const texts: string[] = product.texts ?? [];
  const group = extractText(texts, 'group') || 'Independent Project';
  const description = extractText(texts, 'desc') || 'Tidak ada deskripsi.';
  const tags = texts.filter(t => t.startsWith('tag:')).map(t => t.slice(4));

  const projectUrls = texts
    .filter((t: string) => t.startsWith('url|'))
    .map((t: string) => {
      const parts = t.split('|');
      return { label: parts[1] || 'Link', url: parts[2] || '#' };
    });

  const legacyRepo = extractText(texts, 'repo');
  if (legacyRepo && projectUrls.length === 0) {
    projectUrls.push({ label: 'Repository', url: legacyRepo });
  }

  // --- PEMBARUAN: Ambil SELURUH array gambar ---
  let imagesArray: string[] = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    imagesArray = product.images;
  } else if (typeof product.images === 'string' && product.images) {
    imagesArray = [product.images];
  } else {
    // Gambar Fallback
    imagesArray = ['https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800'];
  }

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

        {/* --- PEMBARUAN: Gunakan Komponen ImageCarousel --- */}
        <ImageCarousel images={imagesArray} alt={product.name} />

        {/* Main Content (Deskripsi) */}
        <div className='max-w-4xl w-full flex flex-col gap-6 text-sm md:text-[15px] lg:text-base leading-relaxed text-justify mb-16'>
          <div
            className='max-w-none font-medium text-gray-700
              [&_b]:font-bold [&_strong]:font-bold 
              [&_i]:italic [&_em]:italic 
              [&_u]:underline
              [&_h1]:text-3xl md:[&_h1]:text-4xl [&_h1]:font-black [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-neutral-900
              [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-neutral-900
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-3
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-3
              [&_ol[type=A]]:list-[upper-alpha]
              [&_li]:mb-1.5
              [&_blockquote]:border-l-4 [&_blockquote]:border-orange-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-5 [&_blockquote]:text-gray-500 [&_blockquote]:bg-orange-50/50 [&_blockquote]:py-2
              [&_a]:text-blue-600 [&_a]:underline [&_a]:font-semibold
              [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-6 [&_img]:shadow-sm'
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        {/* Meta Box (Tags & Project URLs) */}
        <div className='max-w-4xl w-full bg-orange-50/70 border border-orange-100 rounded-2xl p-6 md:p-8 mb-12 flex flex-col gap-8'>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className='flex flex-col gap-3'>
              <span className='font-bold text-neutral-900 text-sm md:text-base'>Teknologi Terkait:</span>
              <div className='flex flex-wrap gap-3'>
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className='px-4 py-1.5 bg-white border border-neutral-300 rounded-md text-xs font-bold text-neutral-800 uppercase tracking-wider shadow-sm'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Project URLs Dinamis */}
          <div className='flex flex-col gap-3'>
            <span className='font-bold text-neutral-900 text-sm md:text-base'>Tautan Project:</span>
            {projectUrls.length > 0 ? (
              <div className='flex flex-wrap gap-3'>
                {projectUrls.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center px-5 py-2.5 bg-white border border-orange-200 text-sm font-bold text-neutral-700 hover:text-primary hover:border-primary rounded-xl transition-all shadow-sm'
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ) : (
              <span className='text-gray-500 italic text-sm'>Tidak ada tautan yang dilampirkan.</span>
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