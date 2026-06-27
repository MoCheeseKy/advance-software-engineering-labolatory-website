import React from 'react';
import { FiUser } from 'react-icons/fi';

export default function Topbar() {
  return (
    <header className="h-24 bg-gray-50/80 backdrop-blur-md flex items-center justify-end px-10 sticky top-0 z-10">
      <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100">
        <div className="flex flex-col text-right">
          <span className="text-sm font-bold text-gray-800">Admin User</span>
          <span className="text-xs text-primary font-medium tracking-wide">Superadmin</span>
        </div>
        <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-primary shadow-inner border border-orange-100">
          <FiUser className="text-xl" />
        </div>
      </div>
    </header>
  );
}
