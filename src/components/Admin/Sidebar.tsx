'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome,
  FiFileText,
  FiBox,
  FiUsers,
  FiClipboard,
  FiLogOut,
  FiUser,
  FiLoader,
} from 'react-icons/fi';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: <FiHome className='text-xl' /> },
  {
    name: 'Blog Management',
    path: '/admin/blog',
    icon: <FiFileText className='text-xl' />,
  },
  {
    name: 'Product Management',
    path: '/admin/product',
    icon: <FiBox className='text-xl' />,
  },
  {
    name: 'Accounts',
    path: '/admin/account',
    icon: <FiUsers className='text-xl' />,
  },
  {
    name: 'Intern Registration',
    path: '/admin/intern-registration',
    icon: <FiClipboard className='text-xl' />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState({ username: 'Loading...', role: '...' });

  // Get User Data
  useEffect(() => {
    async function fetchUserSession() {
      try {
        const res = await fetch('/api/admin/me', { credentials: 'include' });
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setUserData({
              username: result.data.username,
              role: result.data.role,
            });
          }
        } else {
          setUserData({ username: 'Admin User', role: 'Admin' }); 
        }
      } catch (error) {
        console.error('Failed to fetch user session:', error);
        setUserData({ username: 'Admin User', role: 'Admin' });
      }
    }
    
    fetchUserSession();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      const res = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.ok) {
        router.push('/login'); 
        router.refresh(); 
      } else {
        throw new Error('Logout Failed');
      }

    } catch (err) {
      console.error('Logout error:', err);
      alert('Logout Error');

    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className='w-[280px] bg-white flex flex-col h-screen fixed left-0 top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20'>
      <div className='h-24 flex items-center justify-center border-b border-gray-100/80 px-8'>
        <Image
          src='/Images/logo-coloured.svg'
          alt='ASE Lab Logo'
          width={180}
          height={60}
          className='object-contain'
          priority
        />
      </div>

      <nav className='flex-1 py-6 px-4 space-y-1.5 overflow-y-auto mt-2'>
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Menu Utama</p>
        {SIDEBAR_ITEMS.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== '/admin' && pathname.startsWith(item.path));
          return (
             <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20'
                  : 'text-gray-500 hover:bg-orange-50/50 hover:text-primary'
              }`}
            >
              <div
                className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
              >
                {item.icon}
              </div>
              <span
                className={`font-semibold tracking-wide text-sm ${isActive ? 'text-white' : ''}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className='p-4 border-t border-gray-100/80'>
        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm border border-gray-100">
            <FiUser className="text-xl" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold text-gray-800 truncate">{userData.username}</span>
            <span className="text-xs text-primary font-medium tracking-wide truncate capitalize">{userData.role}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className='flex items-center gap-3.5 px-4 py-3.5 w-full text-left rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group disabled:opacity-50'
        >
          <div className='transition-transform duration-300 group-hover:scale-110'>
            {isLoggingOut ? <FiLoader className="text-xl animate-spin" /> : <FiLogOut className='text-xl' />}
          </div>
          <span className='font-semibold tracking-wide text-sm'>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </aside>
  );
} 