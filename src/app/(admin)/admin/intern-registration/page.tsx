'use client';
import React, { useState, useEffect } from 'react';
import { 
  FiEye, FiCheckCircle, FiSearch, FiX, FiLoader, FiDownload, FiEdit, 
  FiUserPlus, FiUser, FiAward, FiUsers 
} from 'react-icons/fi';

type Registration = {
  id: number;
  nim: string;
  name: string;
  fakultas: string;
  prodi: string;
  angkatan: number | string;
  divisi1: string;
  divisi1_id: number | null;
  divisi2: string;
  divisi2_id: number | null;
  divisi_diterima_id: number | null; 
  cv: string;
  motivationLetter: string;
  portofolio: string;
  status: string;
  date: string;
  tim?: string; 
};

type MemberData = {
  id_member: number;
  nim: string;
  nama: string;
  angkatan: number;
  prodi: string;
  fakultas: string;
  divisi: string;
  tim: string | null;
  tipe_member: 'INTERN' | 'MEMBER';
  createdAt: string;
};

export default function AdminUnifiedManagementPage() {
  // Main View State
  const [activeTab, setActiveTab] = useState<'REGISTER' | 'INTERN' | 'MEMBER'>('REGISTER');
  const [search, setSearch] = useState('');
  
  // Data States
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [members, setMembers] = useState<MemberData[]>([]);
  
  // Loading & Error States
  const [regLoading, setRegLoading] = useState(true);
  const [memLoading, setMemLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState<number | null>(null);
  const [acceptLoading, setAcceptLoading] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Evaluate Form States (Registrasi)
  const [selectedStatus, setSelectedStatus] = useState<'ACCEPTED' | 'REJECTED' | 'PENDING'>('PENDING');
  const [selectedDivisiId, setSelectedDivisiId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState(''); 

  // Edit Member States
  const [editMemberTipe, setEditMemberTipe] = useState<'INTERN' | 'MEMBER'>('INTERN');
  const [editMemberTim, setEditMemberTim] = useState('');
  
  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'view_reg' | 'evaluate_reg' | 'view_member' | 'edit_member' | null;
    data: Registration | MemberData | null;
  }>({
    isOpen: false,
    type: null,
    data: null
  });

  const isRegistration = (data: any): data is Registration => data && 'cv' in data;
  const isMember = (data: any): data is MemberData => data && 'id_member' in data;

  const formatStatusDisplay = (statusStr: string) => {
    if (statusStr === 'ACCEPTED') return 'Accepted';
    if (statusStr === 'REJECTED') return 'Rejected';
    return 'Pending';
  };

  // Fetch Registrations
  useEffect(() => {
    async function fetchRegistrations() {
      try {
        setRegLoading(true);
        setError(null);
        const res = await fetch('/api/admin/register/intern-register', { credentials: 'include' });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message ?? 'Failed to fetch registrations');
        
        const formattedData: Registration[] = (data.data || []).map((reg: any) => {
          const div1 = reg.dataDivisi?.find((d: any) => d.pilihan == 1);
          const div2 = reg.dataDivisi?.find((d: any) => d.pilihan == 2);
          return {
            id: reg.id_registrasi,
            nim: reg.nim,
            name: reg.nama,
            fakultas: reg.prodi?.fakultas?.nama ?? '-',
            prodi: reg.prodi?.nama ?? '-',
            angkatan: reg.angkatan ?? '-',
            divisi1: div1?.divisi?.nama ?? '-',
            divisi1_id: div1?.id_divisi ?? null,
            divisi2: div2?.divisi?.nama ?? '-',
            divisi2_id: div2?.id_divisi ?? null,
            divisi_diterima_id: reg.id_divisi_diterima ?? null,
            cv: reg.cv ?? '',
            motivationLetter: reg.motivationLetter ?? '',
            portofolio: reg.portofolio ?? '',
            status: formatStatusDisplay(reg.status),
            date: reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('id-ID', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A',
          };
        });
        setRegistrations(formattedData);
      } catch (err: any) {
        setError(err.message ?? 'Unable to reach the server.');
      } finally {
        setRegLoading(false);
      }
    }
    fetchRegistrations();
  }, []);

  // Fetch Members
  useEffect(() => {
    async function fetchMembers() {
      if (members.length > 0) return; 
      try {
        setMemLoading(true);
        const res = await fetch('/api/admin/member', { credentials: 'include' });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message ?? 'Failed to fetch members');
        
        const formattedData: MemberData[] = (data.data || []).map((m: any) => ({
          id_member: m.id_member,
          nim: m.nim,
          nama: m.nama,
          angkatan: m.angkatan,
          prodi: m.prodi?.nama ?? '-',
          fakultas: m.prodi?.fakultas?.nama ?? '-',
          divisi: m.divisi?.nama ?? '-',
          tim: m.tim,
          tipe_member: m.tipe_member,
          createdAt: new Date(m.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        }));
        setMembers(formattedData);
      } catch (err: any) {
        console.error('Failed to fetch members', err);
      } finally {
        setMemLoading(false);
      }
    }

    if (activeTab === 'INTERN' || activeTab === 'MEMBER') {
      fetchMembers();
    }
  }, [activeTab, members.length]);

  // Filters
  const filteredRegistrations = registrations.filter(reg => 
    reg.name.toLowerCase().includes(search.toLowerCase()) || 
    reg.nim.toLowerCase().includes(search.toLowerCase()) ||
    reg.prodi.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMembers = members.filter(m => 
    m.tipe_member === activeTab &&
    (m.nama.toLowerCase().includes(search.toLowerCase()) || 
     m.nim.toLowerCase().includes(search.toLowerCase()) ||
     m.divisi.toLowerCase().includes(search.toLowerCase()) ||
     (m.tim && m.tim.toLowerCase().includes(search.toLowerCase())))
  );

  const openDetailReg = async (reg: Registration) => {
    setViewLoading(reg.id);
    try {
      const res = await fetch(`/api/admin/register/intern-register/${reg.id}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Gagal mengambil detail');

      const r = data.data;
      const div1 = r.dataDivisi?.find((d: any) => d.pilihan == 1);
      const div2 = r.dataDivisi?.find((d: any) => d.pilihan == 2);

      const detail: Registration = {
        id: r.id_registrasi,
        nim: r.nim,
        name: r.nama,
        fakultas: r.prodi?.fakultas?.nama ?? '-',
        prodi: r.prodi?.nama ?? '-',
        angkatan: r.angkatan ?? '-',
        divisi1: div1?.divisi?.nama ?? '-',
        divisi1_id: div1?.id_divisi ?? null,
        divisi2: div2?.divisi?.nama ?? '-',
        divisi2_id: div2?.id_divisi ?? null,
        divisi_diterima_id: r.id_divisi_diterima ?? null,
        cv: r.cv ?? '',
        motivationLetter: r.motivationLetter ?? '',
        portofolio: r.portofolio ?? '',
        status: formatStatusDisplay(r.status),
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('id-ID', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A',
      };
      setModalConfig({ isOpen: true, type: 'view_reg', data: detail });
    } catch (err: any) {
      alert(err.message || 'Gagal mengambil detail registrasi');
    } finally {
      setViewLoading(null);
    }
  };

  const openEvaluateModal = async (reg: Registration) => {
    setAcceptLoading(reg.id);
    try {
      const res = await fetch(`/api/admin/register/intern-register/${reg.id}`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Gagal mengambil detail');

      const r = data.data;
      const div1 = r.dataDivisi?.find((d: any) => d.pilihan == 1);
      const div2 = r.dataDivisi?.find((d: any) => d.pilihan == 2);

      const detail: Registration = {
        ...reg,
        divisi1: div1?.divisi?.nama ?? 'Nama Divisi Tidak Ditemukan',
        divisi1_id: div1?.id_divisi ?? null,
        divisi2: div2?.divisi?.nama ?? 'Nama Divisi Tidak Ditemukan',
        divisi2_id: div2?.id_divisi ?? null,
        tim: r.member?.tim ?? '',
      };

      setModalConfig({ isOpen: true, type: 'evaluate_reg', data: detail });
      setSelectedStatus(r.status === 'ACCEPTED' ? 'ACCEPTED' : r.status === 'REJECTED' ? 'REJECTED' : 'ACCEPTED');
      setSelectedDivisiId(r.id_divisi_diterima || detail.divisi1_id || detail.divisi2_id);
      setTeamName(r.member?.tim ?? '');
    } catch (err: any) {
      alert(err.message || 'Gagal mengambil detail registrasi');
    } finally {
      setAcceptLoading(null);
    }
  };

  const openMemberDetail = (m: MemberData) => {
    setModalConfig({ isOpen: true, type: 'view_member', data: m });
  };

  const openMemberEdit = (m: MemberData) => {
    setEditMemberTipe(m.tipe_member);
    setEditMemberTim(m.tim || '');
    setModalConfig({ isOpen: true, type: 'edit_member', data: m });
  };

  const closeModal = () => {
    if (actionLoading) return;
    setModalConfig({ isOpen: false, type: null, data: null });
    setSelectedDivisiId(null);
    setTeamName('');
    setEditMemberTim('');
  };

  const confirmEvaluate = async () => {
    if (!modalConfig.data || !isRegistration(modalConfig.data)) return;
    
    if (selectedStatus === 'ACCEPTED' && !selectedDivisiId) {
      alert("Pilih divisi penempatan terlebih dahulu!");
      return;
    }

    const payload = {
      status: selectedStatus,
      id_divisi_diterima: selectedStatus === 'ACCEPTED' ? selectedDivisiId : null,
      tim: selectedStatus === 'ACCEPTED' ? teamName : null
    };

    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/register/intern-register/${modalConfig.data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal memperbarui status registrasi');

      setRegistrations(prev => 
        prev.map(reg => reg.id === (modalConfig.data as Registration).id ? { 
          ...reg, 
          status: formatStatusDisplay(selectedStatus),
          divisi_diterima_id: selectedStatus === 'ACCEPTED' ? selectedDivisiId : null
        } : reg)
      );

      setMembers([]); // Reset members so it refetches next time tab is opened
      closeModal();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menghubungi server');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmEditMember = async () => {
    if (!modalConfig.data || !isMember(modalConfig.data)) return;
    
    try {
      setActionLoading(true);
      // Panggil API update member
      const res = await fetch(`/api/admin/member/${modalConfig.data.id_member}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tipe_member: editMemberTipe,
          tim: editMemberTim || null
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal memperbarui data member');

      // Update state lokal agar UI langsung berubah tanpa refresh
      setMembers(prev => 
        prev.map(m => m.id_member === (modalConfig.data as MemberData).id_member ? { 
          ...m, 
          tipe_member: editMemberTipe,
          tim: editMemberTim || null
        } : m)
      );

      closeModal();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menghubungi server');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/admin/register/intern-register/export', { method: 'GET', credentials: 'include' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || 'Gagal mengunduh file Excel');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `Registrasi_Intern_${dateStr}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat meng-export data');
    } finally {
      setIsExporting(false);
    }
  };

  const renderRegistrationsTable = () => (
    <div className="overflow-x-auto">
      {regLoading ? (
        <div className="flex justify-center items-center p-10 text-gray-400 text-sm gap-2">
          <FiLoader className="animate-spin text-xl" /> Memuat data registrasi...
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
                      reg.status === 'Rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openDetailReg(reg)} disabled={viewLoading === reg.id || acceptLoading === reg.id} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200 disabled:opacity-50" title="View Details">
                        {viewLoading === reg.id ? <FiLoader className="animate-spin" /> : <FiEye />}
                      </button>
                      <button 
                        onClick={() => openEvaluateModal(reg)} 
                        disabled={acceptLoading === reg.id || viewLoading === reg.id}
                        className={`p-2 rounded-lg transition-colors border border-transparent disabled:opacity-50 ${
                          reg.status === 'Pending' ? 'text-green-600 hover:bg-green-100 hover:border-green-200' : 'text-orange-600 hover:bg-orange-100 hover:border-orange-200'
                        }`} 
                        title={reg.status === 'Pending' ? "Evaluate Application" : "Edit Evaluation"}
                      >
                        {acceptLoading === reg.id ? <FiLoader className="animate-spin" /> : reg.status === 'Pending' ? <FiCheckCircle /> : <FiEdit />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                  {search ? `Tidak ada pendaftar yang cocok dengan "${search}"` : 'Belum ada pendaftar.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderMembersTable = () => (
    <div className="overflow-x-auto">
      {memLoading ? (
        <div className="flex justify-center items-center p-10 text-gray-400 text-sm gap-2">
          <FiLoader className="animate-spin text-xl" /> Memuat data {activeTab.toLowerCase()}...
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
              <th className="p-4 font-semibold uppercase tracking-wider text-xs">NIM</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-xs">Nama</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-xs">Divisi</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-xs">Tim</th>
              <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m) => (
                <tr key={m.id_member} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors">
                  <td className="p-4 text-gray-800 font-bold">{m.nim}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{m.nama}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Angkatan {m.angkatan}</div>
                  </td>
                  <td className="p-4 text-gray-800 font-medium">{m.divisi}</td>
                  <td className="p-4 text-gray-600">
                    {m.tim ? (
                      <span className="px-2.5 py-1 bg-gray-100 rounded-md text-sm border border-gray-200 font-medium">{m.tim}</span>
                    ) : (
                      <span className="text-gray-400 italic text-sm">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openMemberDetail(m)} 
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200" 
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button 
                        onClick={() => openMemberEdit(m)} 
                        className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors border border-transparent hover:border-orange-200" 
                        title="Edit Member"
                      >
                        <FiEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                  {search ? `Tidak ada ${activeTab.toLowerCase()} yang cocok dengan "${search}"` : `Belum ada data ${activeTab.toLowerCase()}.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="space-y-6 relative">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FiUsers className="text-orange-500" /> Member Management
          </h2>
          <p className="text-gray-500 mt-1">Review registrations, manage interns, and permanent members.</p>
        </div>
        
        {activeTab === 'REGISTER' && (
          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-70 shadow-sm border border-orange-600/20"
          >
            {isExporting ? <FiLoader className="animate-spin text-xl" /> : <FiDownload className="text-xl" />}
            {isExporting ? 'Exporting...' : 'Export Registrations'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* FILTER & TABS CARD */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* TOP BAR: TABS & SEARCH */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          <div className="flex bg-gray-200/60 p-1.5 rounded-xl w-full lg:w-auto overflow-x-auto">
            <button
              onClick={() => { setActiveTab('REGISTER'); setSearch(''); }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 py-2 px-5 font-semibold text-sm rounded-lg transition-all ${
                activeTab === 'REGISTER' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <FiUserPlus /> Register
            </button>
            <button
              onClick={() => { setActiveTab('INTERN'); setSearch(''); }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 py-2 px-5 font-semibold text-sm rounded-lg transition-all ${
                activeTab === 'INTERN' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <FiUser /> Interns
            </button>
            <button
              onClick={() => { setActiveTab('MEMBER'); setSearch(''); }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 py-2 px-5 font-semibold text-sm rounded-lg transition-all ${
                activeTab === 'MEMBER' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <FiAward /> Members
            </button>
          </div>

          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search in ${activeTab.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all sm:text-sm text-black"
            />
          </div>
        </div>

        {/* DYNAMIC TABLE CONTENT */}
        {activeTab === 'REGISTER' ? renderRegistrationsTable() : renderMembersTable()}

      </div>

      {/* MODAL GLOBAL CONFIG */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">
                {modalConfig.type === 'view_reg' && 'Registration Details'}
                {modalConfig.type === 'evaluate_reg' && 'Evaluate Application'}
                {modalConfig.type === 'view_member' && 'Member Details'}
                {modalConfig.type === 'edit_member' && 'Edit Member'}
              </h3>
              <button onClick={closeModal} disabled={actionLoading} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50">
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              {/* 1. VIEW DETAIL REGISTRASI */}
              {modalConfig.type === 'view_reg' && isRegistration(modalConfig.data) && (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      modalConfig.data.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                      modalConfig.data.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {modalConfig.data.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Data Pribadi</p>
                  <DetailRow label="Nama Lengkap" value={modalConfig.data.name} />
                  <DetailRow label="NIM" value={modalConfig.data.nim} />
                  <DetailRow label="Angkatan" value={String(modalConfig.data.angkatan)} />
                  <DetailRow label="Fakultas" value={modalConfig.data.fakultas} />
                  <DetailRow label="Program Studi" value={modalConfig.data.prodi} />

                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Pilihan Divisi</p>
                  <DivisionRow label="Divisi Pilihan 1" value={modalConfig.data.divisi1} isAccepted={modalConfig.data.status === 'Accepted' && modalConfig.data.divisi_diterima_id === modalConfig.data.divisi1_id} />
                  <DivisionRow label="Divisi Pilihan 2" value={modalConfig.data.divisi2} isAccepted={modalConfig.data.status === 'Accepted' && modalConfig.data.divisi_diterima_id === modalConfig.data.divisi2_id} />

                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Dokumen</p>
                  <DocLink label="CV" url={modalConfig.data.cv} />
                  <DocLink label="Motivation Letter" url={modalConfig.data.motivationLetter} />
                  {modalConfig.data.portofolio && (
                    <DocLink label="Portofolio" url={modalConfig.data.portofolio} />
                  )}
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Lainnya</p>
                  <DetailRow label="Tanggal Daftar" value={modalConfig.data.date} />
                </div>
              )}

              {/* 2. EVALUATE REGISTRASI */}
              {modalConfig.type === 'evaluate_reg' && isRegistration(modalConfig.data) && (
                <div className="text-gray-600 leading-relaxed space-y-5">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">1. Keputusan Status</label>
                    <div className="flex gap-3">
                      <button onClick={() => setSelectedStatus('ACCEPTED')} className={`flex-1 py-2 rounded-xl border font-semibold transition-all ${selectedStatus === 'ACCEPTED' ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-200 hover:bg-gray-50'}`}>Accept</button>
                      <button onClick={() => setSelectedStatus('REJECTED')} className={`flex-1 py-2 rounded-xl border font-semibold transition-all ${selectedStatus === 'REJECTED' ? 'bg-red-100 border-red-500 text-red-700' : 'border-gray-200 hover:bg-gray-50'}`}>Reject</button>
                    </div>
                  </div>

                  {selectedStatus === 'ACCEPTED' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">2. Penempatan Divisi</label>
                        <div className="flex flex-col gap-2">
                          {modalConfig.data?.divisi1_id != null && (
                            <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedDivisiId === modalConfig.data?.divisi1_id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                              <input type="radio" name="divisi" value={modalConfig.data?.divisi1_id} checked={selectedDivisiId === modalConfig.data?.divisi1_id} onChange={() => setSelectedDivisiId((modalConfig.data as Registration).divisi1_id as number)} className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"/>
                              <span className="text-gray-700 font-medium">1: {modalConfig.data?.divisi1}</span>
                            </label>
                          )}
                          {modalConfig.data?.divisi2_id != null && (
                            <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedDivisiId === modalConfig.data?.divisi2_id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                              <input type="radio" name="divisi" value={modalConfig.data?.divisi2_id} checked={selectedDivisiId === modalConfig.data?.divisi2_id} onChange={() => setSelectedDivisiId((modalConfig.data as Registration).divisi2_id as number)} className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"/>
                              <span className="text-gray-700 font-medium">2: {modalConfig.data?.divisi2}</span>
                            </label>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-gray-700 block mb-2">3. Nama Tim (Opsional)</label>
                        <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Contoh: Frontend A, Creative, dll..." className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"/>
                        <p className="text-xs text-gray-400 mt-1">Bisa diisi menyusul jika pembagian tim belum final.</p>
                      </div>
                    </div>
                  )}
                  {selectedStatus === 'REJECTED' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm animate-in fade-in duration-300">
                      Kamu akan menolak <strong>{modalConfig.data.name}</strong>. Jika sebelumnya ia berstatus Accepted, data dari tabel Member akan dihapus.
                    </div>
                  )}
                </div>
              )}

              {/* 3. VIEW DETAIL MEMBER */}
              {modalConfig.type === 'view_member' && isMember(modalConfig.data) && (
                <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">Tipe</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                      modalConfig.data.tipe_member === 'MEMBER' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {modalConfig.data.tipe_member}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Identitas</p>
                  <DetailRow label="Nama Lengkap" value={modalConfig.data.nama} />
                  <DetailRow label="NIM" value={modalConfig.data.nim} />
                  <DetailRow label="Angkatan" value={String(modalConfig.data.angkatan)} />
                  <DetailRow label="Fakultas" value={modalConfig.data.fakultas} />
                  <DetailRow label="Program Studi" value={modalConfig.data.prodi} />

                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2">Penempatan</p>
                  <DetailRow label="Divisi" value={modalConfig.data.divisi} />
                  <DetailRow label="Tim Internal" value={modalConfig.data.tim || '-'} />
                </div>
              )}

              {/* 4. EDIT MEMBER */}
              {modalConfig.type === 'edit_member' && isMember(modalConfig.data) && (
                <div className="text-gray-600 leading-relaxed space-y-5">
                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Tipe Keanggotaan</label>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setEditMemberTipe('INTERN')} 
                        className={`flex-1 py-2 rounded-xl border font-semibold transition-all ${editMemberTipe === 'INTERN' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        Intern
                      </button>
                      <button 
                        onClick={() => setEditMemberTipe('MEMBER')} 
                        className={`flex-1 py-2 rounded-xl border font-semibold transition-all ${editMemberTipe === 'MEMBER' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        Member
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-700 block mb-2">Nama Tim / Squad</label>
                    <input 
                      type="text" 
                      value={editMemberTim} 
                      onChange={(e) => setEditMemberTim(e.target.value)} 
                      placeholder="Contoh: Tim Creative A..." 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700"
                    />
                    <p className="text-xs text-gray-400 mt-1">Kosongkan jika tidak ada tim spesifik di dalam divisinya.</p>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={closeModal} disabled={actionLoading} className="px-5 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50">
                {modalConfig.type?.includes('view') ? 'Close' : 'Cancel'}
              </button>
              
              {modalConfig.type === 'evaluate_reg' && (
                <button onClick={confirmEvaluate} disabled={actionLoading || (selectedStatus === 'ACCEPTED' && !selectedDivisiId)} className="px-5 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
                  {actionLoading && <FiLoader className="animate-spin" />}
                  Save Evaluation
                </button>
              )}

              {modalConfig.type === 'edit_member' && (
                <button onClick={confirmEditMember} disabled={actionLoading} className="px-5 py-2 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
                  {actionLoading && <FiLoader className="animate-spin" />}
                  Update Member
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

function DivisionRow({ label, value, isAccepted }: { label: string; value: string; isAccepted: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-gray-500 font-medium shrink-0">{label}</span>
      <div className="flex items-center gap-2 text-right">
        {isAccepted && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase">
            Accepted
          </span>
        )}
        <span className="text-sm font-semibold text-gray-800">{value || '-'}</span>
      </div>
    </div>
  );
}

function DocLink({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-sm text-gray-500 font-medium shrink-0">{label}</span>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline truncate max-w-[200px]">
          Buka Dokumen ↗
        </a>
      ) : (
        <span className="text-sm text-gray-400">-</span>
      )}
    </div>
  );
}