'use client';
import React, { useState, useEffect } from 'react';
import { FiEye, FiCheckCircle, FiXCircle, FiSearch, FiX, FiLoader } from 'react-icons/fi';

type Registration = {
  id: number;
  nim: string;
  name: string;
  fakultas: string;
  prodi: string;
  angkatan: number | string;
  divisi1: string;
  divisi2: string;
  cv: string;
  motivationLetter: string;
  portofolio: string;
  status: string;
  date: string;
};

export default function AdminInternRegistrationPage() {
  const [search, setSearch] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk mencegah multiple klik saat submit action
  const [actionLoading, setActionLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState<number | null>(null);
  
  // Modal states
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'view' | 'accept' | 'reject' | null;
    data: Registration | null;
  }>({
    isOpen: false,
    type: null,
    data: null
  });

  // Fetch data dari backend
  useEffect(() => {
    async function fetchRegistrations() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/admin/register/intern-register', { credentials: 'include' });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message ?? 'Failed to fetch registrations');
        
        // Format data Backend 
        const formattedData: Registration[] = (data.data || []).map((reg: any) => {
          const status = reg.status === true ? 'Accepted' : 'Not Accepted';
          const divisi1 = reg.dataDivisi?.find((d: any) => d.pilihan === 1)?.divisi?.nama ?? '-';
          const divisi2 = reg.dataDivisi?.find((d: any) => d.pilihan === 2)?.divisi?.nama ?? '-';

          return {
            id: reg.id_registrasi,
            nim: reg.nim,
            name: reg.nama,
            fakultas: reg.prodi?.fakultas?.nama ?? '-',
            prodi: reg.prodi?.nama ?? '-',
            angkatan: reg.angkatan ?? '-',
            divisi1,
            divisi2,
            cv: reg.cv ?? '',
            motivationLetter: reg.motivationLetter ?? '',
            portofolio: reg.portofolio ?? '',
            status,
            date: reg.createdAt
              ? new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
              : 'N/A',
          };
        });

        setRegistrations(formattedData);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message ?? 'Unable to reach the server.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchRegistrations();
  }, []);

  const filteredRegistrations = registrations.filter(reg => 
    reg.name.toLowerCase().includes(search.toLowerCase()) || 
    reg.nim.toLowerCase().includes(search.toLowerCase()) ||
    reg.prodi.toLowerCase().includes(search.toLowerCase())
  );

  const openDetail = async (reg: Registration) => {
    setViewLoading(reg.id);
    try {
      const res = await fetch(`/api/admin/register/intern-register/${reg.id}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Gagal mengambil detail');

      const r = data.data;
      const detail: Registration = {
        id: r.id_registrasi,
        nim: r.nim,
        name: r.nama,
        fakultas: r.prodi?.fakultas?.nama ?? '-',
        prodi: r.prodi?.nama ?? '-',
        angkatan: r.angkatan ?? '-',
        divisi1: r.dataDivisi?.find((d: any) => d.pilihan === 1)?.divisi?.nama ?? '-',
        divisi2: r.dataDivisi?.find((d: any) => d.pilihan === 2)?.divisi?.nama ?? '-',
        cv: r.cv ?? '',
        motivationLetter: r.motivationLetter ?? '',
        portofolio: r.portofolio ?? '',
        status: r.status === true ? 'Accepted' : 'Not Accepted',
        date: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          : 'N/A',
      };
      setModalConfig({ isOpen: true, type: 'view', data: detail });

    } catch (err: any) {
      alert(err.message || 'Gagal mengambil detail registrasi');

    } finally {
      setViewLoading(null);
    }
  };

  const closeModal = () => {
    if (actionLoading) return;
    setModalConfig({ isOpen: false, type: null, data: null });
  };

  const confirmAction = async () => {
    if (!modalConfig.data) return;
    
    const isAccept = modalConfig.type === 'accept';
    const newStatusStr = isAccept ? 'Accepted' : 'Not Accepted';

    try {
      setActionLoading(true);
      
      const res = await fetch(`/api/admin/register/intern-register/${modalConfig.data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: isAccept })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Gagal memperbarui status registrasi');
      }

      setRegistrations(prev => 
        prev.map(reg => reg.id === modalConfig.data!.id ? { ...reg, status: newStatusStr } : reg)
      );
      
      closeModal();
    } catch (err: any) {
      console.error("Action failed", err);
      alert(err.message || 'Terjadi kesalahan saat menghubungi server');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Intern Registrations</h2>
          <p className="text-gray-500 mt-1">Review and manage intern applications.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
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
              placeholder="Search by name, NIM, or division..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm text-black"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-10 text-gray-400 text-sm gap-2">
              <FiLoader className="animate-spin text-xl" /> Loading registrations...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">NIM</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Name</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Division</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Date Applied</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                      <td className="p-4 text-gray-800 font-bold">{reg.nim}</td>
                      <td className="p-4 text-gray-800 font-semibold">{reg.name}</td>
                      <td className="p-4 text-gray-600 font-medium">{reg.prodi}</td>
                      <td className="p-4 text-gray-500">{reg.date}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          reg.status === 'Accepted' ? 'bg-green-100 text-green-700 border border-green-200' :
                          'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openDetail(reg)} disabled={viewLoading === reg.id} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200 disabled:opacity-50" title="View Details">
                            {viewLoading === reg.id ? <FiLoader className="animate-spin" /> : <FiEye />}
                          </button>
                          <button onClick={() => setModalConfig({ isOpen: true, type: 'accept', data: reg })} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors border border-transparent hover:border-green-200" title="Accept">
                            <FiCheckCircle />
                          </button>
                          <button onClick={() => setModalConfig({ isOpen: true, type: 'reject', data: reg })} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Reject">
                            <FiXCircle />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                      {search ? `No registrations found matching "${search}"` : 'No registrations found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Custom Modal Overlay */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                {modalConfig.type === 'view' ? 'Intern Details' : 
                 modalConfig.type === 'accept' ? 'Confirm Acceptance' : 
                 'Confirm Rejection'}
              </h3>
              <button 
                onClick={closeModal} 
                disabled={actionLoading}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalConfig.type === 'view' && modalConfig.data && (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                  
                  {/* Status badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      modalConfig.data.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {modalConfig.data.status}
                    </span>
                  </div>

                  {/* Data Pribadi */}
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data Pribadi</p>
                  <DetailRow label="Nama Lengkap" value={modalConfig.data.name} />
                  <DetailRow label="NIM" value={modalConfig.data.nim} />
                  <DetailRow label="Angkatan" value={String(modalConfig.data.angkatan)} />
                  <DetailRow label="Fakultas" value={modalConfig.data.fakultas} />
                  <DetailRow label="Program Studi" value={modalConfig.data.prodi} />

                  {/* Pilihan Divisi */}
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Pilihan Divisi</p>
                  <DetailRow label="Divisi Pilihan 1" value={modalConfig.data.divisi1} />
                  <DetailRow label="Divisi Pilihan 2" value={modalConfig.data.divisi2} />

                  {/* Dokumen */}
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Dokumen</p>
                  <DocLink label="CV" url={modalConfig.data.cv} />
                  <DocLink label="Motivation Letter" url={modalConfig.data.motivationLetter} />
                  {modalConfig.data.portofolio && (
                    <DocLink label="Portofolio" url={modalConfig.data.portofolio} />
                  )}

                  {/* Tanggal */}
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Lainnya</p>
                  <DetailRow label="Tanggal Daftar" value={modalConfig.data.date} />
                </div>
              )}

              {(modalConfig.type === 'accept' || modalConfig.type === 'reject') && modalConfig.data && (
                <div className="text-gray-600 leading-relaxed">
                  Are you sure you want to <span className={`font-bold ${modalConfig.type === 'accept' ? 'text-green-600' : 'text-red-600'}`}>
                    {modalConfig.type === 'accept' ? 'ACCEPT' : 'REJECT'}
                  </span> <strong>{modalConfig.data.name}</strong> for the {modalConfig.data.divisi1} position?
                  {modalConfig.type === 'reject' && (
                    <p className="mt-2 text-sm text-red-500">This action cannot be undone and an automated email will be sent.</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={closeModal} 
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {modalConfig.type === 'view' ? 'Close' : 'Cancel'}
              </button>
              
              {modalConfig.type === 'accept' && (
                <button 
                  onClick={confirmAction}
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                >
                  {actionLoading && <FiLoader className="animate-spin" />}
                  Yes, Accept
                </button>
              )}

              {modalConfig.type === 'reject' && (
                <button 
                  onClick={confirmAction}
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                >
                  {actionLoading && <FiLoader className="animate-spin" />}
                  Yes, Reject
                </button>
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-gray-500 font-medium shrink-0">{label}</span>
      <span className="text-sm font-semibold text-gray-800 text-right">{value || '-'}</span>
    </div>
  );
}

function DocLink({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-sm text-gray-500 font-medium shrink-0">{label}</span>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-blue-600 hover:underline truncate max-w-[200px]"
        >
          Buka Dokumen ↗
        </a>
      ) : (
        <span className="text-sm text-gray-400">-</span>
      )}
    </div>
  );
}