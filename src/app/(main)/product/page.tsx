'use client';
import React, { useState, useEffect } from 'react';
import Wrapper from '@/components/_shared/Wrapper';
import ProductCard from '@/components/Product/ProductCard';
import { FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Tembak ke API publik yang baru saja kita buat
        const response = await fetch(`/api/product?page=${currentPage}&limit=6`);
        const result = await response.json();

        if (response.ok) {
          setProducts(result.data); 
          setTotalPages(result.meta?.totalPages || 1); 
        } else {
          console.error("Gagal mengambil data product:", result.message);
        }

      } catch (error) {
        console.error("Terjadi kesalahan jaringan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]); 

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  // Helper untuk mengekstrak deskripsi dari array texts
  const getDescription = (texts: string[]) => {
    if (!texts) return 'Deskripsi tidak tersedia.';
    const desc = texts.find((t: string) => t.startsWith('desc:'));
    return desc ? desc.slice(5) : 'Deskripsi tidak tersedia.';
  };

  // Helper untuk mengekstrak tags dari array texts
  const getTags = (texts: string[]) => {
    if (!texts) return [];
    return texts.filter((t: string) => t.startsWith('tag:')).map((t: string) => t.slice(4));
  };

  return (
    <section className='w-full bg-white text-black min-h-screen'>
      <Wrapper className='flex flex-col items-center pt-16 md:pt-32 pb-64'>
        {/* Title */}
        <div className='flex flex-col items-center mb-16'>
          <h2 className='text-primary text-[32px] md:text-[40px] font-bold pb-2 relative after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-[4px] after:bg-primary'>
            Products
          </h2>
        </div>

        {/* Loading / Data Grid */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
             <FiLoader className="text-4xl animate-spin text-primary" />
             <p className="text-gray-500 font-medium">Memuat project...</p>
           </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full mb-16'>
              {products.map((product) => {
                // Ekstraksi Gambar Lokal (Fallback ke placeholder default jika tidak ada)
                const imageUrl = (Array.isArray(product.images) && product.images.length > 0) 
                  ? product.images[0] 
                  : (typeof product.images === 'string' ? product.images : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800');

                return (
                  <ProductCard
                    key={product.id_product}
                    id={product.id_product}
                    image={imageUrl}
                    title={product.name}
                    description={getDescription(product.texts)}
                    tags={getTags(product.texts)}
                  />
                );
              })}

              {products.length === 0 && (
                 <div className="col-span-full text-center text-gray-500 py-10">
                    Belum ada project yang dipublikasikan.
                 </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-3 mt-4'>
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