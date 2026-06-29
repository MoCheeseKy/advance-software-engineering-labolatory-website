'use client';
import React, { useState } from 'react';
import { FiArrowLeft, FiImage, FiSave, FiPlus, FiTrash2, FiLoader, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [repo, setRepo] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [developers, setDevelopers] = useState([{ name: '', role: '' }]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newFiles = [...imageFiles, ...files].slice(0, 5); // max 5 images
    setImageFiles(newFiles);

    // Generate previews
    const readers = newFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(setImagePreviews);
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

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const payload = {
        name,
        developers: developers.map(d => `${d.name}${d.role ? ` - ${d.role}` : ''}`),
        texts: [
          ...(group ? [`group:${group}`] : []),
          ...(repo ? [`repo:${repo}`] : []),
          ...(description ? [`desc:${description}`] : []),
          ...tags.split(',').map(t => t.trim()).filter(Boolean).map(t => `tag:${t}`),
        ],
        images: imagePreviews, // base64 strings dari FileReader
      };

      const res = await fetch('/api/admin/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Gagal menyimpan project');

      router.push('/admin/product');
    } catch (err: any) {
      setSaveError(err.message || 'Terjadi kesalahan saat menyimpan.');
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail lengkap mengenai aplikasi..."
                  className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y text-gray-900"
                />
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
                <p className="text-xs text-gray-400 mt-1.5">Pisahkan dengan koma.</p>
              </div>
            </div>

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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project Repository URL</label>
                <input
                  type="url"
                  required
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900"
                />
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
                  <span className="text-sm font-medium">Klik untuk upload</span>
                  <span className="text-xs mt-1">PNG, JPG, WEBP · Maks 5 foto</span>
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