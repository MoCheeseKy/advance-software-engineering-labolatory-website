'use client';
import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminProductPage() {
  const [search, setSearch] = useState('');

  const dummyProducts = [
    { id: 1, name: 'EduTech App', group: 'EduTech Group', repo: 'github.com/ASELabIntern/EduTech-App', tags: ['Web App', 'React', 'Express'] },
    { id: 2, name: 'Smart IoT Dashboard', group: 'IoT Research', repo: 'github.com/ASELabIntern/Smart-IoT', tags: ['IoT', 'Next.js', 'MQTT'] },
    { id: 3, name: 'Lab Inventory System', group: 'Internal Team', repo: 'github.com/ASELabIntern/Inventory', tags: ['Web App', 'Laravel', 'Vue'] },
  ];

  const filteredProducts = dummyProducts.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) || 
    product.group.toLowerCase().includes(search.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Project Showcase</h2>
          <p className="text-gray-500 mt-1">Manage and showcase lab projects and applications.</p>
        </div>
        <Link href="/admin/product/create" className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-sm">
          <FiPlus className="text-xl" />
          <span>Add New Project</span>
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
              placeholder="Search by project name, group, or tags..."
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
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Project Name</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Group</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Technologies</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs">Repository</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                    <td className="p-4 text-gray-800 font-semibold">{product.name}</td>
                    <td className="p-4 text-gray-600 font-medium">{product.group}</td>
                    <td className="p-4 text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {product.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-orange-50 text-primary border border-orange-100 rounded-md text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-blue-600 text-sm">{product.repo}</td>
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
                    No projects found matching "{search}"
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
