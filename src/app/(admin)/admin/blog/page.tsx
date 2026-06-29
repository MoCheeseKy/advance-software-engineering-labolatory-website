'use client';
import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminBlogPage() {
  const [search, setSearch] = useState('');
  
  const dummyBlogs = [
    { id: 1, title: 'Introduction to Software Engineering', author: 'Admin User', date: 'Oct 12, 2025', status: 'Published' },
    { id: 2, title: 'Best Practices in React 19', author: 'Tech Lead', date: 'Nov 05, 2025', status: 'Draft' },
    { id: 3, title: 'Understanding Next.js App Router', author: 'Admin User', date: 'Dec 01, 2025', status: 'Published' },
  ];

  const filteredBlogs = dummyBlogs.filter(blog => 
    blog.title.toLowerCase().includes(search.toLowerCase()) || 
    blog.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Blog Management</h2>
          <p className="text-gray-500 mt-1">Manage all blog posts here.</p>
        </div>
        <Link href="/admin/blog/create" className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-sm">
          <FiPlus className="text-xl" />
          <span>Add New Post</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Title</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Author</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Date</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                    <td className="p-4 text-gray-800 font-semibold">{blog.title}</td>
                    <td className="p-4 text-gray-600 font-medium">{blog.author}</td>
                    <td className="p-4 text-gray-500">{blog.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        blog.status === 'Published' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="Edit">
                          <FiEdit2 />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                    No blogs found matching "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
