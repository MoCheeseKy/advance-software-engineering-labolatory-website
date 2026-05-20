'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Wrapper from '@/components/_shared/Wrapper';
import SheetModal from '@/components/_shared/SheetModal';

export default function Header() {
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    // { name: 'Division', href: '/division' },
    { name: 'Blog', href: '/blog' },
    { name: 'Product', href: '/product' },
    { name: 'Intern', href: '/intern' },
  ];

  const MobileMenuContent = (
    <nav className='flex flex-col gap-6 mt-4'>
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-lg font-semibold transition-colors duration-200 hover:text-orange-500 ${
              isActive ? 'text-orange-500' : 'text-gray-800'
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className='w-full bg-white shadow-sm sticky top-0 z-50'>
      <Wrapper
        backgroundColor='bg-white'
        className='py-4 flex justify-between items-center'
      >
        {/* Logo */}
        <Link href='/'>
          <Image
            src='/Images/logo-coloured.svg'
            alt='ASE Laboratory Logo'
            width={115}
            height={49}
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className='hidden md:flex items-center gap-8'>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[15px] font-semibold transition-colors duration-200 hover:text-orange-500 ${
                  isActive ? 'text-orange-500' : 'text-gray-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden p-2 text-gray-800 hover:text-orange-500 transition-colors cursor-pointer'
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label='Open mobile menu'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-7 h-7'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
            />
          </svg>
        </button>
      </Wrapper>

      <SheetModal
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title='Navigation Menu'
        description={MobileMenuContent}
      />
    </header>
  );
}
