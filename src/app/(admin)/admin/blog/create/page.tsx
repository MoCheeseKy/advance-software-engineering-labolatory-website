'use client';
import React, { useState } from 'react';
import { FiArrowLeft, FiImage, FiSave } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    window.alert('Blog saved successfully! (Dummy Action)');
    router.push('/admin/blog');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Create New Blog Post</h2>
          <p className="text-gray-500 mt-1">Write and publish a new article.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Post Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Software Engineering..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
            >
              <option value="" disabled>Select category...</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="News">News</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>

          {/* Cover Image Placeholder */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer">
              <FiImage className="text-4xl mb-2" />
              <span className="text-sm font-medium">Click to upload cover image</span>
              <span className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</span>
            </div>
          </div>

          {/* Content (Dummy Rich Text) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Dummy Toolbar */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex gap-2">
                {['B', 'I', 'U', 'H1', 'H2', 'Quote', 'Link', 'Image'].map(tool => (
                  <button key={tool} type="button" className="px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded transition-colors">
                    {tool}
                  </button>
                ))}
              </div>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                className="w-full h-96 p-4 focus:outline-none resize-y"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/blog" className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2">
            <FiSave className="text-xl" />
            <span>Publish Post</span>
          </button>
        </div>
      </form>
    </div>
  );
}
