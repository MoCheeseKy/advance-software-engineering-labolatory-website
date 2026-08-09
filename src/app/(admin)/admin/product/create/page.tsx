'use client';
import React, { useState, useRef } from 'react';
import { FiArrowLeft, FiImage, FiSave, FiPlus, FiTrash2, FiLoader, FiX, FiLink } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UploadProduct } from '@/lib/frontend-file-upload';

export default function CreateProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [developers, setDevelopers] = useState([{ name: '', role: '' }]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [projectUrls, setProjectUrls] = useState([{ label: 'Repository', url: '' }]);

  const editorRef = useRef<HTMLDivElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newFiles = [...imageFiles, ...files].slice(0, 5); 
    setImageFiles(newFiles);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleAddDeveloper = () => {
    setDevelopers([...developers, { name: '', role: '' }]);
  };

  const handleRemoveDeveloper = (index: number) => {
    setDevelopers(developers.filter((_, i) => i !== index));
  };

  const handleDeveloperChange = (index: number, field: 'name' | 'role', value: string) => {
    const newDevs = [...developers];
    newDevs[index][field] = value;
    setDevelopers(newDevs);
  };

  const handleAddUrl = () => {
    setProjectUrls([...projectUrls, { label: '', url: '' }]);
  };

  const handleRemoveUrl = (index: number) => {
    setProjectUrls(projectUrls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, field: 'label' | 'url', value: string) => {
    const newUrls = [...projectUrls];
    newUrls[index][field] = value;
    setProjectUrls(newUrls);
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setDescription(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleEditorInput(); 
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
          throw new Error(data.message || 'Failed Upload Image');
        }

        execCommand('insertImage', data.imageUrl);

      } catch (err) {
        console.error("Failed Processing Image:", err);
        alert("Failed Processing Image.");
      }
    }
   
    if (editorImageInputRef.current) {
      editorImageInputRef.current.value = '';
    }
  };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const formattedDevelopers = developers.map(d => `${d.name}${d.role ? ` - ${d.role}` : ''}`);
      
      const formattedUrls = projectUrls
        .filter(item => item.label && item.url) 
        .map(item => `url|${item.label.trim()}|${item.url.trim()}`); 

      const formattedTexts = [
        ...(group ? [`group:${group}`] : []),
        ...formattedUrls, 
        ...(description ? [`desc:${description}`] : []),
        ...tags.split(',').map(t => t.trim()).filter(Boolean).map(t => `tag:${t}`),
      ];

      await UploadProduct({
        files: imageFiles,
        name: name,
        developers: formattedDevelopers,
        texts: formattedTexts
      });

      router.push('/admin/product');
      router.refresh();
      
    } catch (err: any) {
      setSaveError(err.message || 'Failed Saving Data');
      
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/product" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Add New Project</h2>
          <p className="text-gray-500 mt-1">Showcase a new application or project built by the lab.</p>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {saveError}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Project Details</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. EduTech App"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900"
                />
              </div>

              {/* Rich Text Editor*/}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  
                  {/* Toolbar */}
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
                    onInput={handleEditorInput}
                    className="w-full h-64 p-4 focus:outline-none overflow-y-auto text-gray-900 bg-white 
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Technologies / Tags</label>
                <input
                  type="text"
                  required
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Web App, React, Express (Comma separated)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900"
                />
                <p className="text-xs text-gray-400 mt-1.5">Separate it with comma</p>
              </div>
            </div>

            {/* Developers Team */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-800">Developers (Team)</h3>
                <button type="button" onClick={handleAddDeveloper} className="text-primary text-sm font-bold flex items-center gap-1 hover:text-orange-600">
                  <FiPlus /> Add Member
                </button>
              </div>

              <div className="space-y-4">
                {developers.map((dev, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        required
                        value={dev.name}
                        onChange={(e) => handleDeveloperChange(idx, 'name', e.target.value)}
                        placeholder="Developer Name (e.g. Hafizh)"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-gray-900"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        required
                        value={dev.role}
                        onChange={(e) => handleDeveloperChange(idx, 'role', e.target.value)}
                        placeholder="Role (e.g. Fullstack Developer)"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-gray-900"
                      />
                    </div>
                    {developers.length > 1 && (
                      <button type="button" onClick={() => handleRemoveDeveloper(idx)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg mt-0.5 transition-colors">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            
            {/* Meta Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Meta Info</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Group / Lab Division</label>
                <input
                  type="text"
                  required
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  placeholder="e.g. EduTech Group"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900"
                />
              </div>
            </div>

            {/* Project URLs */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-800">Project URLs</h3>
                <button type="button" onClick={handleAddUrl} className="text-primary text-sm font-bold flex items-center gap-1 hover:text-orange-600">
                  <FiPlus /> Add URL
                </button>
              </div>

              <div className="space-y-4">
                {projectUrls.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="flex-1 space-y-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={item.label}
                          onChange={(e) => handleUrlChange(idx, 'label', e.target.value)}
                          placeholder="Label (e.g. Repository, GDD, SDD, Live App)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-gray-900 font-semibold"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <FiLink className="text-gray-400" />
                        <input
                          type="url"
                          required
                          value={item.url}
                          onChange={(e) => handleUrlChange(idx, 'url', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-blue-600"
                        />
                      </div>
                    </div>

                    {projectUrls.length > 1 && (
                      <button type="button" onClick={() => handleRemoveUrl(idx)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors mt-1">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Project Image</h3>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200">
                      <img src={src} alt={`preview-${idx}`} className="w-full h-28 object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload area */}
              {imageFiles.length < 5 && (
                <label className="w-full h-36 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer text-center px-4">
                  <FiImage className="text-3xl mb-2" />
                  <span className="text-sm font-medium">Click to Upload</span>
                  <span className="text-xs mt-1">PNG, JPG, WEBP · Max 5 Photos</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
          <Link href="/admin/product" className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
            {saving ? <FiLoader className="text-xl animate-spin" /> : <FiSave className="text-xl" />}
            <span>{saving ? 'Saving...' : 'Publish Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}