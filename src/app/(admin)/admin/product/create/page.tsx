'use client';
import React, { useState } from 'react';
import { FiArrowLeft, FiImage, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    window.alert('Project saved successfully! (Dummy Action)');
    router.push('/admin/product');
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail lengkap mengenai aplikasi..."
                  className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
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
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        required
                        value={dev.role}
                        onChange={(e) => handleDeveloperChange(idx, 'role', e.target.value)}
                        placeholder="Role (e.g. Fullstack Developer)"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Project Image</h3>
              <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-primary transition-colors cursor-pointer text-center px-4">
                <FiImage className="text-4xl mb-2" />
                <span className="text-sm font-medium">Upload Screenshot</span>
                <span className="text-xs mt-1">Recommended: 16:9 ratio</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
          <Link href="/admin/product" className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2">
            <FiSave className="text-xl" />
            <span>Publish Project</span>
          </button>
        </div>
      </form>
    </div>
  );
}
