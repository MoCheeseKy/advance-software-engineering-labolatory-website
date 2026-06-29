'use client';
import React, { useState, useRef } from 'react';
import { FiArrowLeft, FiImage, FiSave, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
 
  const editorRef = useRef<HTMLDivElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleEditorInput(); 
  };

  const handleFormat = (tool: string) => {
    switch (tool) {
      case 'B':
        execCommand('bold');
        break;
      case 'I':
        execCommand('italic');
        break;
      case 'U':
        execCommand('underline');
        break;
      case 'H1':
        execCommand('formatBlock', 'H1');
        break;
      case 'H2':
        execCommand('formatBlock', 'H2');
        break;
      case 'Quote':
        execCommand('formatBlock', 'BLOCKQUOTE');
        break;
      case 'Link':
        const url = window.prompt('Masukkan URL Link (contoh: https://google.com):');
        if (url) execCommand('createLink', url);
        break;
      case 'Image':
        editorImageInputRef.current?.click();
        break;
      default:
        break;
    }
  };

  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64Url = await toBase64(file);
        execCommand('insertImage', base64Url);
      } catch (err) {
        console.error("Gagal membaca gambar:", err);
        alert("Gagal memproses gambar.");
      }
    }
   
    if (editorImageInputRef.current) {
      editorImageInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!content || content.trim() === '<br>') {
      setError("Content artikel tidak boleh kosong.");
      setIsSubmitting(false);
      return;
    }

    try {
      const urlSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-') || 'new-blog-post';

      let imagesArray: string[] = [];

      if (imageFile) {
        const base64Image = await toBase64(imageFile);
        imagesArray.push(base64Image);
      }

      const payload = {
        title: title,
        url: urlSlug,
        authors: ["Admin"], 
        texts: [content], 
        images: imagesArray, 
      };

      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create blog post');
      }

      router.push('/admin/blog');
      router.refresh(); 

    } catch (err: any) {
      console.error('Save blog error:', err);
      setError(err.message || 'Something went wrong while saving.');

    } finally {
      setIsSubmitting(false);
    }
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-black"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white text-black"
            >
              <option value="" disabled>Select category...</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="News">News</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>

          {/* Cover Image Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
            <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <FiImage className="text-4xl mb-2" />
                  <span className="text-sm font-medium text-gray-500">Click to upload cover image</span>
                  <span className="text-xs mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              
              {/* Toolbar */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto">
                {['B', 'I', 'U', 'H1', 'H2', 'Quote', 'Link', 'Image'].map(tool => (
                  <button 
                    key={tool} 
                    type="button" 
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleFormat(tool);
                    }}
                    className="px-3 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded transition-colors"
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
                onInput={handleEditorInput}
                className="w-full h-96 p-4 focus:outline-none overflow-y-auto text-black bg-white 
                [&_b]:font-bold [&_i]:italic [&_u]:underline 
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-2
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-2
                [&_blockquote]:border-l-4 [&_blockquote]:border-gray-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-gray-600
                [&_a]:text-blue-600 [&_a]:underline
                [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/blog" className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <FiLoader className="text-xl animate-spin" /> : <FiSave className="text-xl" />}
            <span>{isSubmitting ? 'Publishing...' : 'Publish Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}