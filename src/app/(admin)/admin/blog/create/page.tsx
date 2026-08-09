'use client';
import React, { useState, useRef } from 'react';
import { FiArrowLeft, FiImage, FiSave, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UploadBlog } from '@/lib/frontend-file-upload'; 

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const [authors, setAuthors] = useState('');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
 
  const editorRef = useRef<HTMLDivElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Fungsi khusus untuk mengatur atribut type pada <ol> untuk List Huruf
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
    handleEditorInput();
  };

  const handleFormat = (tool: string) => {
    switch (tool) {
      case 'B': execCommand('bold'); break;
      case 'I': execCommand('italic'); break;
      case 'U': execCommand('underline'); break;
      case 'H1': execCommand('formatBlock', 'H1'); break;
      case 'H2': execCommand('formatBlock', 'H2'); break;
      case 'Quote':
        // Logika Toggle untuk Quote
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
        // Jika sedang di dalam quote, kembalikan ke tulisan normal (DIV). Jika tidak, jadikan BLOCKQUOTE
        execCommand('formatBlock', isQuote ? 'DIV' : 'BLOCKQUOTE');
        break;
      case 'Number':
        execCommand('insertOrderedList');
        setListType(null); // Pastikan tidak ada atribut huruf
        break;
      case 'Letter':
        execCommand('insertOrderedList');
        setListType('A'); // Berikan tipe A agar menjadi A, B, C
        break;
      case 'Bullet':
        execCommand('insertUnorderedList');
        break;
      case 'Link':
        const promptUrl = window.prompt('Masukkan URL Link (contoh: https://google.com):');
        if (promptUrl) execCommand('createLink', promptUrl);
        break;
      case 'Image': editorImageInputRef.current?.click(); break;
      default: break;
    }
  };

  const handleEditorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/admin/upload/image', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Gagal upload ke server');
        }

        execCommand('insertImage', data.imageUrl);

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

    if (!imageFile) {
      setError("Cover image wajib diunggah.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formattedAuthors = authors.split(',').map(a => a.trim()).filter(a => a);
      const formattedUrl = url || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

      await UploadBlog({
        file: imageFile,         
        title: title,            
        url: formattedUrl,       
        authors: formattedAuthors.length > 0 ? formattedAuthors : ["Admin"], 
        texts: [content]         
      });

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

          {/* URL & Authors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug (Opsional)</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. my-new-blog-post"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Authors (Pisahkan dengan koma)</label>
              <input
                type="text"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="e.g. John Doe, Jane Smith"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-black"
              />
            </div>
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
                {/* Tambahkan tombol Number, Letter, dan Bullet di sini */}
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
                onInput={handleEditorInput}
                // Tambahkan styling CSS Tailwind untuk List di dalam Editor
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