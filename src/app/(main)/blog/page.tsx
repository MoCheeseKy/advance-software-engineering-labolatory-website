'use client';

import React, { useState, useEffect } from 'react';
import Wrapper from '@/components/_shared/Wrapper';
import BlogCard from '@/components/Home/Blog/BlogCard';
import { FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        // Fetch ke endpoint publik
        const response = await fetch(`/api/blog?page=${currentPage}&limit=6`);
        const result = await response.json();

        if (response.ok) {
          setBlogs(result.data); 
          setTotalPages(result.meta.totalPages); 

        } else {
          console.error("Gagal mengambil data blog:", result.message);
        }

      } catch (error) {
        console.error("Terjadi kesalahan jaringan:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]); 

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageClick = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

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
    <section className='w-full bg-white text-black min-h-screen'>
      <Wrapper className='flex flex-col items-center pt-16 md:pt-32 pb-64'>
        {/* Title */}
        <div className='flex flex-col items-center mb-16'>
          <h2 className='text-primary text-[32px] md:text-[40px] font-bold pb-2 relative after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-[4px] after:bg-primary'>
            Blogs
          </h2>
        </div>

        {/* Loading Indicator */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
             <FiLoader className="text-4xl animate-spin text-primary" />
             <p className="text-gray-500 font-medium">Memuat artikel...</p>
           </div>
        ) : (
          <>
            {/* Blog Cards Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16'>
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

              {blogs.length === 0 && (
                 <div className="col-span-full text-center text-gray-500 py-10">
                    Belum ada blog yang diterbitkan.
                 </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-3 mt-4'>
                {/* Previous Button */}
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1.5 border-2 border-primary px-5 py-2.5 rounded-xl font-bold text-sm md:text-base transition-colors duration-200 shadow-sm ${
                    currentPage === 1 
                      ? 'text-gray-400 border-gray-300 cursor-not-allowed opacity-50' 
                      : 'text-primary hover:bg-primary hover:text-white cursor-pointer'
                  }`}
                >
                  <FiChevronLeft className='text-lg md:text-xl' />
                  <span>Previous</span>
                </button>

                {/* Dinamis Render Angka Paginasi */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button 
                    key={pageNum}
                    onClick={() => handlePageClick(pageNum)}
                    className={`w-11 h-11 rounded-xl font-bold text-sm md:text-base flex items-center justify-center transition-colors duration-200 shadow-sm ${
                      currentPage === pageNum
                        ? 'bg-primary text-white cursor-default'
                        : 'border-2 border-primary text-primary hover:bg-primary hover:text-white cursor-pointer'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Button */}
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1.5 border-2 border-primary px-5 py-2.5 rounded-xl font-bold text-sm md:text-base transition-colors duration-200 shadow-sm ${
                    currentPage === totalPages 
                      ? 'text-gray-400 border-gray-300 cursor-not-allowed opacity-50' 
                      : 'text-primary hover:bg-primary hover:text-white cursor-pointer'
                  }`}
                >
                  <span>Next</span>
                  <FiChevronRight className='text-lg md:text-xl' />
                </button>
              </div>
            )}
          </>
        )}
      </Wrapper>
    </section>
  );
}