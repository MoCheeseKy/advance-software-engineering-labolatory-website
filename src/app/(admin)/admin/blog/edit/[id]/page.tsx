'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiLoader, FiCheck, FiArrowLeft, FiImage } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { UpdateBlog } from '@/lib/frontend-file-upload'; 

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState('');
  const [editAuthors, setEditAuthors] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const initialContentHtml = useRef<string>('');

  useEffect(() => {
    async function fetchSpecificBlog() {
      try {
        setLoading(true);
        
        const res = await fetch('/api/admin/blog', { credentials: 'include' });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message ?? 'Failed to fetch blogs');
        
        const targetBlog = data.data.find((b: any) => b.id_blog.toString() === blogId);
        if (!targetBlog) throw new Error('Blog post not found');

        setEditTitle(targetBlog.title);
        setEditAuthors(Array.isArray(targetBlog.authors) ? targetBlog.authors.join(', ') : (targetBlog.authors || ''));
        setEditUrl(targetBlog.url);
        
        let contentString = '';
        if (Array.isArray(targetBlog.texts) && targetBlog.texts.length > 0) {
          contentString = targetBlog.texts.join('<br><br>');
        } else if (typeof targetBlog.texts === 'string') {
          contentString = targetBlog.texts;
        }
        
        initialContentHtml.current = contentString;
        if (editorRef.current) {
          editorRef.current.innerHTML = contentString;
        }

        let coverPreview = null;
        if (Array.isArray(targetBlog.images) && targetBlog.images.length > 0) {
          coverPreview = targetBlog.images[0];
        } else if (typeof targetBlog.images === 'string') {
          coverPreview = targetBlog.images;
        }
        setEditImagePreview(coverPreview);

      } catch (err: any) {
        console.error('Fetch specific blog error:', err);
        setError(err.message ?? 'Unable to fetch data.');
      } finally {
        setLoading(false);
      }
    }
    
    if (blogId) {
      fetchSpecificBlog();
    }
  }, [blogId]);

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
  };

  const setListType = (typeValue: string | null) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let node: Node | null = sel.anchorNode;
    while (node && node !== editorRef.current) {
      if (node.nodeName === 'OL') {
        if (typeValue) {
          (node as HTMLOListElement).type = typeValue;
        } else {
          (node as HTMLOListElement).removeAttribute('type');
        }
        break;
      }
      node = node.parentNode;
    }
  };

  const handleFormat = (tool: string) => {
    switch (tool) {
      case 'B': execCommand('bold'); break;
      case 'I': execCommand('italic'); break;
      case 'U': execCommand('underline'); break;
      case 'H1': execCommand('formatBlock', 'H1'); break;
      case 'H2': execCommand('formatBlock', 'H2'); break;
      case 'Quote': 
        const sel = window.getSelection();
        let isQuote = false;
        if (sel && sel.rangeCount > 0) {
          let node = sel.anchorNode;
          while (node && node !== editorRef.current) {
            if (node.nodeName === 'BLOCKQUOTE') {
              isQuote = true;
              break;
            }
            node = node.parentNode;
          }
        }
        execCommand('formatBlock', isQuote ? 'DIV' : 'BLOCKQUOTE'); 
        break;
      case 'Number':
        execCommand('insertOrderedList');
        setListType(null);
        break;
      case 'Letter':
        execCommand('insertOrderedList');
        setListType('A'); 
        break;
      case 'Bullet':
        execCommand('insertUnorderedList');
        break;
      case 'Link':
        const url = window.prompt('Masukkan URL Link (contoh: https://google.com):');
        if (url) execCommand('createLink', url);
        break;
      case 'Image':
        editorImageInputRef.current?.click();
        break;
      default: break;
    }
  };

  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64Url = await toBase64(file);
        execCommand('insertImage', base64Url);
      } catch (err) {
        alert("Gagal memproses gambar.");
      }
    }
    if (editorImageInputRef.current) {
      editorImageInputRef.current.value = '';
    }
  };

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const finalContent = editorRef.current?.innerHTML || '';

    if (!finalContent || finalContent.trim() === '<br>' || finalContent.trim() === '') {
      setActionError("Content artikel tidak boleh kosong.");
      return;
    }
    
    setActionLoading(true);
    setActionError(null);

    try {
      const formattedAuthors = editAuthors.split(',').map(a => a.trim()).filter(a => a);
      const formattedUrl = editUrl || editTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

      const isKeepingOldImage = !editImageFile;

      await UpdateBlog({
        blogId: blogId,
        file: editImageFile, 
        title: editTitle,
        url: formattedUrl,
        authors: formattedAuthors,
        texts: [finalContent],
        keepOldImage: isKeepingOldImage
      });
      
      router.push('/admin/blog');
      router.refresh();

    } catch (err: any) {
      setActionError(err.message ?? 'Update failed.');
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FiLoader className="text-3xl animate-spin text-primary" />
        <p className="text-gray-500 font-medium">Loading blog data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-6 text-center">
        <p className="font-bold mb-2">Error Loading Blog</p>
        <p className="text-sm">{error}</p>
        <Link href="/admin/blog" className="text-primary hover:underline text-sm font-semibold mt-4 block">
          &larr; Back to Blog Management
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/blog"
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
        >
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Edit Blog Post</h2>
          <p className="text-gray-500 mt-1">Update your article details and media.</p>
        </div>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {actionError}
        </div>
      )}

      <form onSubmit={handleEditSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Post Title</label>
            <input
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-black"
            />
          </div>

          {/* URL & Authors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
              <input
                type="text"
                required
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Authors (Comma separated)</label>
              <input
                type="text"
                required
                value={editAuthors}
                onChange={(e) => setEditAuthors(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-black"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
            <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer overflow-hidden">
              {editImagePreview ? (
                <img src={editImagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <FiImage className="text-4xl mb-2" />
                  <span className="text-sm font-medium text-gray-500">Click to upload new cover image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto">
                {['B', 'I', 'U', 'H1', 'H2', 'Quote', 'Number', 'Letter', 'Bullet', 'Link', 'Image'].map(tool => (
                  <button 
                    key={tool} 
                    type="button" 
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleFormat(tool);
                    }}
                    className="px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded transition-colors whitespace-nowrap"
                  >
                    {tool}
                  </button>
                ))}
              </div>
              
              <input 
                type="file" 
                accept="image/*" 
                ref={editorImageInputRef} 
                onChange={handleEditorImageUpload} 
                className="hidden" 
              />

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: initialContentHtml.current }}
                className="w-full h-96 p-4 focus:outline-none overflow-y-auto text-black bg-white 
                [&_b]:font-bold [&_i]:italic [&_u]:underline 
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-2
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-2
                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-gray-600
                [&_a]:text-blue-600 [&_a]:underline
                [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2
                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2
                [&_ol[type=A]]:list-[upper-alpha]
                [&_li]:mb-1"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link 
            href="/admin/blog"
            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={actionLoading}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
          >
            {actionLoading ? <FiLoader className="text-xl animate-spin" /> : <FiCheck className="text-xl" />}
            <span>{actionLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}