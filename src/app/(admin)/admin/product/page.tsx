'use client';
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader, FiX } from 'react-icons/fi';
import Link from 'next/link';

interface Developer { name: string; role: string; }
interface ProjectUrl { label: string; url: string; }

interface Product {
  id: number;
  name: string;
  group: string;
  urls: ProjectUrl[];
  description: string;
  tags: string[];
  developers: Developer[];
  images: string[];           
}

function extractText(texts: string[], prefix: string): string {
  const entry = (texts ?? []).find((t: string) => t.startsWith(`${prefix}:`));
  return entry ? entry.slice(prefix.length + 1) : '';
}

function mapProduct(p: any): Product {
  const texts: string[] = p.texts ?? [];

  const developers: Developer[] = (p.developers ?? []).map((d: string) => {
    const dashIdx = d.indexOf(' - ');
    return dashIdx !== -1
      ? { name: d.slice(0, dashIdx), role: d.slice(dashIdx + 3) }
      : { name: d, role: '' };
  });

  const tags = texts
    .filter((t: string) => t.startsWith('tag:'))
    .map((t: string) => t.slice(4));

  const urls: ProjectUrl[] = texts
    .filter((t: string) => t.startsWith('url|'))
    .map((t: string) => {
      const parts = t.split('|');
      return { label: parts[1] || 'Link', url: parts[2] || '#' };
    });

  const legacyRepo = extractText(texts, 'repo');

  if (legacyRepo && urls.length === 0) {
    urls.push({ label: 'Repository', url: legacyRepo });
  }

  return {
    id:          p.id_product,
    name:        p.name,
    group:       extractText(texts, 'group'),
    urls:        urls,
    description: extractText(texts, 'desc'),
    tags,
    developers,
    images:      p.images ?? [],
  };
}

interface DeleteModalProps {
  product: Product;
  onClose: () => void;
  onDeleted: (id: number) => void;
}

function DeleteModal({ product, onClose, onDeleted }: DeleteModalProps) {
  const [deleting,  setDeleting]  = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/product/${product.id}`, {
        method:      'DELETE',
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Failed Delete The Project');

      onDeleted(product.id);

    } catch (err: any) {
      setDeleteError(err.message || 'Delete Error');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Delete Project</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {deleteError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              ⚠️ {deleteError}
            </div>
          )}

          <div className="bg-red-50 rounded-xl p-4 flex gap-3 items-start">
            <span className="text-red-500 text-xl mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-700">This Action Can't be Cancelled</p>
              <p className="text-sm text-red-600 mt-1">
                Project <span className="font-bold">&ldquo;{product.name}&rdquo;</span> Will Be Permanently Deleted
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 text-sm"
          >
            {deleting ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
            <span>{deleting ? 'Deleting...' : 'Delete Project'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductPage() {
  const [search,   setSearch]   = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const res  = await fetch('/api/admin/product', { credentials: 'include' });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message ?? 'Failed to fetch products');
        setProducts((data.data || []).map(mapProduct));

      } catch (err: any) {
        setError(err.message ?? 'Unable to reach the server.');

      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleDeleted = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteTarget(null);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.group.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Project Showcase</h2>
            <p className="text-gray-500 mt-1">Manage and showcase lab projects and applications.</p>
          </div>
          <Link
            href="/admin/product/create"
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-sm"
          >
            <FiPlus className="text-xl" />
            <span>Add New Project</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by project name, group, or tags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm text-black"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm m-4">
              ⚠️ {error}
            </div>
          )}

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center p-10 text-gray-400 text-sm gap-2">
                <FiLoader className="animate-spin text-xl" /> Loading products...
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">Project Name</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">Group</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">Technologies</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">Project URLs</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors"
                      >
                        <td className="p-4 text-gray-800 font-semibold">{product.name}</td>
                        <td className="p-4 text-gray-600 font-medium">{product.group || '-'}</td>
                        <td className="p-4">
                          {product.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {product.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="p-4 text-sm">
                          {product.urls && product.urls.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                              {product.urls.map((u, idx) => (
                                <a
                                  key={idx}
                                  href={u.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline truncate max-w-[160px] block font-medium"
                                  title={u.url}
                                >
                                  {u.label}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/product/edit/${product.id}`}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(product)}
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
                        {search
                          ? `No projects found matching "${search}"`
                          : 'No Project Found'
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}