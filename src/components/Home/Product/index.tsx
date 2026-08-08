'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import { FiLoader } from 'react-icons/fi';

export default function Product() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Mengambil data dari Backend
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        // Memanggil API Publik dengan limit 5 untuk ditampilkan di carousel
        const response = await fetch('/api/product?page=1&limit=5');
        const result = await response.json();

        if (response.ok) {
          setProducts(result.data);
        } else {
          console.error("Gagal mengambil data product:", result.message);
        }
      } catch (error) {
        console.error("Terjadi kesalahan jaringan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  // 2. Mengatur interval carousel (bergantung pada panjang data products)
  useEffect(() => {
    if (products.length === 0) return; // Hentikan timer jika data kosong

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [products.length]);

  // Helper untuk mengekstrak deskripsi
  const getDescription = (texts: string[]) => {
    if (!texts) return 'Deskripsi tidak tersedia.';
    const desc = texts.find((t: string) => t.startsWith('desc:'));
    return desc ? desc.slice(5) : 'Deskripsi tidak tersedia.';
  };

  return (
    <section className='w-full bg-white'>
      <Wrapper className='flex flex-col items-center'>
        
        {/* Header Title */}
        <div className='flex flex-col items-center text-center text-black mb-10'>
          <p className='text-[32px] font-semibold leading-tight'>Our</p>
          <h2 className='text-primary text-[56px] md:text-[64px] font-bold leading-tight'>
            Products
          </h2>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <FiLoader className="text-4xl animate-spin text-primary" />
            <p className="text-gray-500 font-medium">Memuat project terbaru...</p>
          </div>
        ) : products.length > 0 ? (
          /* Carousel Container */
          <div className='relative w-full max-w-[900px] overflow-hidden'>
            <div
              className='flex transition-transform duration-700 ease-in-out'
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {products.map((product) => {
                // Ekstraksi URL Gambar (Fallback ke placeholder)
                const imageUrl = (Array.isArray(product.images) && product.images.length > 0) 
                  ? product.images[0] 
                  : (typeof product.images === 'string' ? product.images : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800');

                return (
                  <div
                    key={product.id_product}
                    className='relative w-full shrink-0 aspect-[16/9] md:aspect-[2/1] group'
                  >
                    <Link
                      href={`/product/${product.id_product}`}
                      className='block w-full h-full relative'
                    >
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className='object-cover md:object-contain p-0 md:p-4'
                      />

                      {/* Hover Overlay */}
                      <div className='absolute inset-0 md:inset-4 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-8 backdrop-blur-sm rounded-none md:rounded-3xl'>
                        <h3 className='text-white text-2xl md:text-4xl font-bold mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 line-clamp-1'>
                          {product.name}
                        </h3>
                        <p className='text-neutral-200 text-sm md:text-lg max-w-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2'>
                          {getDescription(product.texts)}
                        </p>
                        <div className='mt-8 px-6 py-2 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-150'>
                          View Detail
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Dots Indicator */}
            <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10'>
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-neutral-300 hover:bg-primary/50 w-2.5'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center text-gray-500 py-10 w-full">
            Belum ada project yang diterbitkan.
          </div>
        )}

        <Link
          href='/product'
          className='mt-12 bg-primary hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm md:text-base'
        >
          More Products
        </Link>
      </Wrapper>
    </section>
  );
}