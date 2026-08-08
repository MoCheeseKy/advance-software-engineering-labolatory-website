'use client';
import React, { useState, useEffect } from 'react';
import { FiLoader, FiX, FiSave, FiImage, FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { UpdateProduct } from '@/lib/frontend-file-upload';

interface Developer { name: string; role: string; }

interface Product {
  id: number;
  name: string;
  group: string;
  repo: string;
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

  return {
    id:          p.id_product,
    name:        p.name,
    group:       extractText(texts, 'group'),
    repo:        extractText(texts, 'repo'),
    description: extractText(texts, 'desc'),
    tags,
    developers,
    images:      p.images ?? [],
  };
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [fetching,   setFetching]   = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [name,        setName]        = useState('');
  const [group,       setGroup]       = useState('');
  const [repo,        setRepo]        = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput,   setTagsInput]   = useState('');
  const [developers,  setDevelopers]  = useState<Developer[]>([{ name: '', role: '' }]);
  
  // State dipisah untuk gambar lama (string URL) dan gambar baru (File)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [saving,   setSaving]   = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setFetching(true);
        setFetchError(null);
        
        const res  = await fetch(`/api/admin/product/${productId}`, { credentials: 'include' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? 'Gagal mengambil data product');

        const p = mapProduct(data.data);
        setName(p.name);
        setGroup(p.group);
        setRepo(p.repo);
        setDescription(p.description);
        setTagsInput(p.tags.join(', '));
        setDevelopers(p.developers.length > 0 ? p.developers : [{ name: '', role: '' }]);
        
        // Simpan gambar dari database ke existingImages
        setExistingImages(p.images);

      } catch (err: any) {
        setFetchError(err.message || 'Gagal memuat data.');

      } finally {
        setFetching(false);
      }
    }
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentTotal = existingImages.length + newImageFiles.length;
    const allowed = 5 - currentTotal;
    if (allowed <= 0) return;

    const toAdd = files.slice(0, allowed);
    const updatedFiles = [...newImageFiles, ...toAdd];
    setNewImageFiles(updatedFiles);

    // Buat object URL hanya untuk preview agar cepat
    const updatedPreviews = toAdd.map(f => URL.createObjectURL(f));
    setNewImagePreviews([...newImagePreviews, ...updatedPreviews]);
  };

  const handleRemoveExisting = (idx: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveNew = (idx: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const addDev = () => setDevelopers(d => [...d, { name: '', role: '' }]);

  const removeDev = (idx: number) =>
    setDevelopers(d => d.filter((_, i) => i !== idx));

  const changeDev = (idx: number, field: 'name' | 'role', val: string) =>
    setDevelopers(d => d.map((dev, i) => i === idx ? { ...dev, [field]: val } : dev));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const formattedDevelopers = developers.map(d => `${d.name}${d.role ? ` - ${d.role}` : ''}`);
      const formattedTexts = [
        ...(group ? [`group:${group}`] : []),
        ...(repo ? [`repo:${repo}`] : []),
        ...(description ? [`desc:${description}`] : []),
        ...tagsInput.split(',').map(t => t.trim()).filter(Boolean).map(t => `tag:${t}`),
      ];

      // Panggil UpdateProduct, ia akan mengompres newImageFiles lalu mengirim ke backend
      await UpdateProduct({
        productId,
        name,
        developers: formattedDevelopers,
        texts: formattedTexts,
        files: newImageFiles,
        existingImages: existingImages
      });

      router.push('/admin/product');
      router.refresh();

    } catch (err: any) {
      setSaveError(err.message || 'Terjadi kesalahan saat menyimpan.');

    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col justify-center items-center py-24 gap-3 text-gray-500">
        <FiLoader className="animate-spin text-4xl text-primary" />
        <span className="font-medium">Memuat data project...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center shadow-sm">
          <p className="text-lg font-bold mb-2">Gagal Memuat Data</p>
          <p className="text-sm">{fetchError}</p>
          <Link href="/admin/product" className="inline-block mt-4 px-6 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-xl font-bold transition-colors">
            &larr; Kembali
          </Link>
        </div>
      </div>
    );
  }

  const totalImages = existingImages.length + newImageFiles.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/product"
          className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 shadow-sm"
        >
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Edit Project</h2>
          <p className="text-gray-500 mt-1">Update informasi project yang sudah ada.</p>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm shadow-sm">
          ⚠️ {saveError}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">Project Details</h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. EduTech App"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-black text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail lengkap mengenai aplikasi..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y text-black text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Technologies / Tags</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="e.g. Web App, React, Express (Comma separated)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-black text-sm"
                />
                <p className="text-xs text-gray-400 mt-1.5">Pisahkan dengan koma.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-gray-800">Developers (Team)</h3>
                <button
                  type="button"
                  onClick={addDev}
                  className="text-primary text-sm font-bold flex items-center gap-1 hover:text-orange-600"
                >
                  <FiPlus /> Add Member
                </button>
              </div>
              <div className="space-y-3">
                {developers.map((dev, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      type="text"
                      required
                      value={dev.name}
                      onChange={e => changeDev(idx, 'name', e.target.value)}
                      placeholder="Developer Name"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-black"
                    />
                    <input
                      type="text"
                      required
                      value={dev.role}
                      onChange={e => changeDev(idx, 'role', e.target.value)}
                      placeholder="Role"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-black"
                    />
                    {developers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDev(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">Meta Info</h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Group / Lab Division</label>
                <input
                  type="text"
                  required
                  value={group}
                  onChange={e => setGroup(e.target.value)}
                  placeholder="e.g. EduTech Group"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-black text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Repository URL</label>
                <input
                  type="url"
                  required
                  value={repo}
                  onChange={e => setRepo(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-black text-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Project Images</h3>

              {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {/* Render Gambar Lama */}
                  {existingImages.map((src, idx) => (
                    <div key={`old-${idx}`} className="relative group rounded-xl overflow-hidden border border-gray-200">
                      <img src={src} alt="existing preview" className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveExisting(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="text-xs" />
                      </button>
                    </div>
                  ))}
                  {/* Render Gambar Baru */}
                  {newImagePreviews.map((src, idx) => (
                    <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden border border-gray-200">
                      <img src={src} alt="new preview" className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveNew(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {totalImages < 5 && (
                <label className="w-full h-28 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer text-center px-4">
                  <FiImage className="text-2xl mb-1" />
                  <span className="text-xs font-medium">Klik untuk upload</span>
                  <span className="text-xs mt-0.5 text-gray-300">PNG, JPG, WEBP · Maks {5 - totalImages} lagi</span>
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

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/product"
            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? <FiLoader className="animate-spin text-xl" /> : <FiSave className="text-xl" />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}