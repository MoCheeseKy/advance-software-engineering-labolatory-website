import Image from 'next/image';
import Link from 'next/link';
import Wrapper from '@/components/_shared/Wrapper';
import {
  FiMail,
  FiMapPin,
  FiYoutube,
  FiInstagram,
  FiLinkedin,
} from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className='w-full flex flex-col font-sans'>
      {/* Main Content */}
      <Wrapper backgroundColor='bg-[#1C1C1C]' className='py-14 text-white'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16'>
          {/* Left Column: Logo & Developers */}
          <div className='flex flex-col gap-8'>
            <Image
              src='/Images/logo-white.svg'
              alt='ASE Laboratory White Logo'
              width={265}
              height={125}
            />
            <div>
              <h3 className='font-bold mb-4'>Our Developers</h3>
              <div className='flex items-center gap-3'>
                {/* Mockup Profile Pictures - Ganti src dengan gambar aslinya nanti */}
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className='w-[45px] h-[45px] rounded-full bg-gray-600 overflow-hidden border-2 border-transparent hover:border-orange-500 transition-colors cursor-pointer'
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=Dev+${item}&background=random`}
                      alt={`Developer ${item}`}
                      className='w-full h-full object-cover'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column: Site Menu */}
          <div className='flex flex-col'>
            <h3 className='font-bold mb-6 text-[18px]'>Site Menu</h3>
            <ul className='flex flex-col gap-4 text-gray-300'>
              <li>
                <Link
                  href='/'
                  className='hover:text-orange-500 transition-colors'
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href='/about'
                  className='hover:text-orange-500 transition-colors'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/division'
                  className='hover:text-orange-500 transition-colors'
                >
                  Division
                </Link>
              </li>
              <li>
                <Link
                  href='/blog'
                  className='hover:text-orange-500 transition-colors'
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='/intern'
                  className='hover:text-orange-500 transition-colors'
                >
                  Intern
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Column: Contact Us & Socials */}
          <div className='flex flex-col'>
            <h3 className='font-bold mb-6 text-[18px]'>Contact us</h3>
            <div className='flex flex-col gap-5 text-gray-300 mb-8'>
              <a
                href='mailto:seresearch@telkomuniversity.ac.id'
                className='flex items-center gap-3 hover:text-orange-500 transition-colors'
              >
                <FiMail className='text-xl flex-shrink-0' />
                <span className='text-[14px]'>
                  seresearch@telkomuniversity.ac.id
                </span>
              </a>
              <div className='flex items-start gap-3 hover:text-orange-500 transition-colors cursor-pointer group'>
                <FiMapPin className='mt-1 text-xl flex-shrink-0' />
                <span className='text-[14px] leading-relaxed group-hover:text-orange-500 transition-colors'>
                  Telkom University Landmark Tower
                  <br />
                  Lantai 6 Ruang 0621, Fakultas
                  <br />
                  Informatika, Telkom University
                </span>
              </div>
            </div>

            <h3 className='font-bold mb-5 text-[18px]'>
              Find us on social media
            </h3>
            <div className='flex items-center gap-4'>
              <a
                href='#'
                className='p-2 border border-white rounded-full hover:border-orange-500 hover:text-orange-500 transition-colors'
              >
                <FiYoutube className='text-xl' />
              </a>
              <a
                href='#'
                className='p-2 border border-white rounded-full hover:border-orange-500 hover:text-orange-500 transition-colors'
              >
                <FiInstagram className='text-xl' />
              </a>
              <a
                href='#'
                className='p-2 border border-white rounded-full hover:border-orange-500 hover:text-orange-500 transition-colors'
              >
                <FiLinkedin className='text-xl' />
              </a>
            </div>
          </div>
        </div>
      </Wrapper>

      {/* Copyright Bar */}
      <Wrapper
        backgroundColor='bg-[#FF7A00]'
        className='py-4 flex justify-center items-center'
      >
        <p className='text-white text-[15px] font-semibold tracking-wide'>
          Copyright @ 2026 ASE Laboratory
        </p>
      </Wrapper>
    </footer>
  );
}
