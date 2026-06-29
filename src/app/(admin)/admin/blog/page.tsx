'use client';
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

interface Blog {
  id_blog: number;
  title: string;
  authors: string[];
  url: string;
  texts?: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
  id_admin: number;
}

interface ModalState {
  type: 'delete' | null;
  blog: Blog | null;
}

export default function AdminBlogPage() {
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<ModalState>({ type: null, blog: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch data 
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/admin/blog', { credentials: 'include' });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message ?? 'Failed to fetch blogs');
        setBlogs(data.data ?? []);
      } catch (err: any) {
        console.error('Fetch blogs error:', err);
        setError(err.message ?? 'Unable to reach the server.');
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const authorText = Array.isArray(blog.authors) ? blog.authors.join(', ') : (blog.authors || '');
    return blog.title.toLowerCase().includes(search.toLowerCase()) || 
           authorText.toLowerCase().includes(search.toLowerCase());
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  function closeModal() {
    if (actionLoading) return;
    setModal({ type: null, blog: null });
    setActionError(null);
  }

  // Handle Delete
  async function handleDelete() {
    if (!modal.blog) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/admin/blog/${modal.blog.id_blog}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Delete failed');
      
      setBlogs(prev => prev.filter(b => b.id_blog !== modal.blog!.id_blog));
      closeModal();
    } catch (err: any) {
      setActionError(err.message ?? 'Delete failed.');
    } finally {
      setActionLoading(false);
    }
  }

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

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm'>
          ⚠️ {error}
        </div>
      )}

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
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm text-black"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-10 text-gray-400 text-sm gap-2">
              <FiLoader className="animate-spin text-xl" /> Loading blogs...
            </div>
          ) : (
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
                    <tr key={blog.id_blog} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                      <td className="p-4 text-gray-800 font-semibold">{blog.title}</td>
                      <td className="p-4 text-gray-600 font-medium">
                        {Array.isArray(blog.authors) ? blog.authors.join(', ') : blog.authors}
                      </td>
                      <td className="p-4 text-gray-500">{formatDate(blog.createdAt)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200`}>
                          Published
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link 
                            href={`/admin/blog/edit/${blog.id_blog}`}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200" 
                            title="Edit"
                          >
                            <FiEdit2 />
                          </Link>
                          <button 
                            onClick={() => { setActionError(null); setModal({ type: 'delete', blog }); }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200" 
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                      {search ? `No blogs found matching "${search}"` : 'No blogs found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/*DELETE Modal*/}
      {modal.type === 'delete' && modal.blog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Blog</h3>
            <p className="text-gray-500 text-sm mb-4">
              Are you sure you want to delete <span className="font-semibold text-gray-700">{modal.blog.title}</span>? This action cannot be undone.
            </p>
            {actionError && <p className="text-red-500 text-xs mb-3">{actionError}</p>}
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                {actionLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}