import React from 'react';
import Sidebar from '@/components/Admin/Sidebar';

export const metadata = {
  title: 'Admin Dashboard - ASE Lab',
  description: 'Admin dashboard for managing ASE Lab website content',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-[280px] flex flex-col">
        <main className="flex-1 p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
