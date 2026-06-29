'use client';

import React, { useEffect, useState } from 'react';
import { FiUsers, FiFileText, FiBox, FiTrendingUp, FiUserPlus, FiLoader } from 'react-icons/fi';

interface Registrant {
  id_registrasi: number;
  id_prodi:      number;
  nim:           string;
  nama:          string;
  angkatan:      number;
  status:        boolean;
}

interface DashboardStats {
  totalInterns:      number;
  totalBlogs:        number;
  totalProducts:     number;
  recentRegistrants: Registrant[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInterns:      0,
    totalBlogs:        0,
    totalProducts:     0,
    recentRegistrants: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const [internRes, blogRes, productRes] = await Promise.all([
          fetch('/api/admin/register/intern-register', { credentials: 'include' }),
          fetch('/api/admin/blog',                     { credentials: 'include' }),
          fetch('/api/admin/product',                  { credentials: 'include' }),
        ]);

        if (!internRes.ok) {
          const e = await internRes.json().catch(() => ({}));
          throw new Error(e.message ?? `Intern fetch failed: HTTP ${internRes.status}`);
        }
        const internData                       = await internRes.json();
        const allRegistrants: Registrant[]     = internData.data ?? [];

        if (!blogRes.ok) {
          const e = await blogRes.json().catch(() => ({}));
          throw new Error(e.message ?? `Blog fetch failed: HTTP ${blogRes.status}`);
        }
        const blogData          = await blogRes.json();
        const allBlogs: unknown[] = blogData.data ?? [];

        if (!productRes.ok) {
          const e = await productRes.json().catch(() => ({}));
          throw new Error(e.message ?? `Product fetch failed: HTTP ${productRes.status}`);
        }
        const productData          = await productRes.json();
        const allProducts: unknown[] = productData.data ?? [];

        setStats({
          totalInterns:      allRegistrants.length,
          totalBlogs:        allBlogs.length,
          totalProducts:     allProducts.length,
          recentRegistrants: allRegistrants.slice(0, 5),
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Interns',
      value: stats.totalInterns.toLocaleString(),
      icon:  <FiUsers className='text-2xl text-blue-500' />,
      bg:    'bg-blue-100',
    },
    {
      title: 'Total Blogs',
      value: stats.totalBlogs.toLocaleString(),
      icon:  <FiFileText className='text-2xl text-green-500' />,
      bg:    'bg-green-100',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon:  <FiBox className='text-2xl text-purple-500' />,
      bg:    'bg-purple-100',
    },
  ];

  return (
    <div className='space-y-6'>
      
      {/* Header */}
      <div>
        <h2 className='text-4xl font-bold text-gray-800'>Dashboard Overview</h2>
        <p className='text-gray-500 mt-1'>
          Welcome back, here is what&apos;s happening today.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm'>
          ⚠️ {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4'
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>{stat.title}</p>
              <h3 className='text-2xl font-bold text-gray-800 mt-1'>
                {loading
                  ? <FiLoader className='animate-spin text-gray-400' />
                  : stat.value
                }
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Registrants */}
      <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
        <h3 className='text-lg font-bold text-gray-800 mb-4'>Recent Registrants</h3>

        {loading ? (
          <div className='flex items-center gap-2 text-gray-400 text-sm py-4'>
            <FiLoader className='animate-spin' />
            <span>Loading registrant data…</span>
          </div>
        ) : stats.recentRegistrants.length === 0 ? (
          <p className='text-sm text-gray-400 py-4'>No registrants found.</p>
        ) : (
          <div className='space-y-4'>
            {stats.recentRegistrants.map((r) => (
              <div
                key={r.id_registrasi}
                className='flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 last:pb-0'
              >
                {/* Dot */}
                <div className='w-2 h-2 rounded-full bg-primary flex-shrink-0' />

                {/* Avatar */}
                <div className='w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0'>
                  <FiUserPlus className='text-blue-400 text-sm' />
                </div>

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <p className='text-sm text-gray-800 font-medium truncate'>
                    {r.nama}
                    <span className='text-gray-400 font-normal'> — {r.nim}</span>
                  </p>
                  <p className='text-xs text-gray-500 mt-0.5'>
                    Angkatan {r.angkatan}
                  </p>
                </div>

                {/* Status badge */}
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    r.status
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {r.status ? 'Diterima' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}