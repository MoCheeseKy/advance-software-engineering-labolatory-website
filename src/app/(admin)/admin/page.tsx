import React from 'react';
import { FiUsers, FiFileText, FiBox, FiTrendingUp } from 'react-icons/fi';

export default function AdminDashboardPage() {
  const stats = [
    {
      title: 'Total Interns',
      value: '1,234',
      icon: <FiUsers className='text-2xl text-blue-500' />,
      bg: 'bg-blue-100',
    },
    {
      title: 'Total Blogs',
      value: '45',
      icon: <FiFileText className='text-2xl text-green-500' />,
      bg: 'bg-green-100',
    },
    {
      title: 'Total Products',
      value: '12',
      icon: <FiBox className='text-2xl text-purple-500' />,
      bg: 'bg-purple-100',
    },
    {
      title: 'Monthly Views',
      value: '45.2k',
      icon: <FiTrendingUp className='text-2xl text-orange-500' />,
      bg: 'bg-orange-100',
    },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-4xl font-bold text-gray-800'>Dashboard Overview</h2>
        <p className='text-gray-500 mt-1'>
          Welcome back, here is what&apos;s happening today.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4'
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>{stat.title}</p>
              <h3 className='text-2xl font-bold text-gray-800 mt-1'>
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className='bg-white rounded-xl p-6 border border-gray-100 shadow-sm'>
        <h3 className='text-lg font-bold text-gray-800 mb-4'>
          Recent Activity
        </h3>
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 last:pb-0'
            >
              <div className='w-2 h-2 rounded-full bg-primary'></div>
              <div>
                <p className='text-sm text-gray-800 font-medium'>
                  New intern registration received from John Doe.
                </p>
                <p className='text-xs text-gray-500 mt-0.5'>
                  {i * 2} hours ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
