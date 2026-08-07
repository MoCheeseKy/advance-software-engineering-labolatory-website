'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import Button from '@/components/_shared/Button';
import BlogCard from './BlogCard';

export default function Blog() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blog?page=1&limit=3');
        const result = await response.json();

        if (response.ok) {
          setBlogs(result.data);
        } else {
          console.error("Gagal mengambil data blog:", result.message);
        }
      } catch (error) {
        console.error("Terjadi kesalahan jaringan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  const stripHtmlAndTruncate = (htmlString: string) => {
    if (!htmlString) return '';
    const plainText = htmlString.replace(/<[^>]+>/g, ''); 
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className='w-full bg-white'>
      <Wrapper className='flex flex-col items-center'>
        {/* Header Title (Sesuai desain asli) */}
        <div className='flex flex-col items-center text-center bg-white text-black mb-10'>
          <p className='text-[32px] font-semibold'>Our</p>
          <p className='text-primary text-[64px] font-bold'>Blogs</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-gray-500 font-medium">Memuat artikel terbaru...</p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-10'>
              {blogs.map((blog) => {
                const imageUrl = (Array.isArray(blog.images) && blog.images.length > 0) 
                  ? blog.images[0] 
                  : (typeof blog.images === 'string' ? blog.images : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800');
                
                const rawContent = Array.isArray(blog.texts) ? blog.texts.join(' ') : (blog.texts || '');

                return (
                  <BlogCard
                    key={blog.id_blog}
                    id={blog.id_blog}
                    image={imageUrl}
                    date={formatDate(blog.createdAt)}
                    category={blog.category || 'ARTICLE'} 
                    title={blog.title}
                    excerpt={stripHtmlAndTruncate(rawContent)}
                  />
                );
              })}
            </div>

            {blogs.length === 0 && (
               <div className="text-center text-gray-500 pb-10 w-full">
                  Belum ada blog yang diterbitkan.
               </div>
            )}
          </>
        )}

        {/* More Blog Button (Sesuai desain asli, dibungkus Link agar bisa diklik) */}
        <Link href="/blog">
          <Button
            variant='solid'
            colorType='primary'
            className='w-fit !rounded-[16px] px-10 py-3 text-lg font-bold shadow-md'
          >
            More Blogs
          </Button>
        </Link>
      </Wrapper>
    </section>
  );
}