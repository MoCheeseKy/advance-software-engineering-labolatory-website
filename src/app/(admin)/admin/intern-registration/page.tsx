'use client';
import React, { useState, useEffect } from 'react';
import {
  FiEye,
  FiCheckCircle,
  FiSearch,
  FiX,
  FiLoader,
  FiDownload,
  FiEdit,
  FiUserPlus,
  FiUser,
  FiAward,
  FiUsers,
  FiSettings,
  FiTrash2,
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
  id_mentor?: number | null;
  mentor_nama?: string | null;
};

type MemberData = {
  id_member: number;
  nim: string;
  nama: string;
  angkatan: number;
  prodi: string;
  fakultas: string;
  divisi: string;
  id_mentor: number | null;
  mentor_nama: string | null;
  id_team: number | null;
  team_nama: string | null;
  tipe_member: 'INTERN' | 'MEMBER';
  createdAt: string;
};

type InternTeamData = {
  id_team: number;
  nama: string;
  kategori: string;
};

export default function AdminUnifiedManagementPage() {
  // Main View State
  const [activeTab, setActiveTab] = useState<
    'REGISTER' | 'INTERN' | 'MEMBER' | 'MENTORS' | 'TEAMS' | 'SETTINGS'
  >('REGISTER');
  const [search, setSearch] = useState('');

  // Data States
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [teams, setTeams] = useState<InternTeamData[]>([]);

  // Loading & Error States
  const [regLoading, setRegLoading] = useState(true);
  const [memLoading, setMemLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState<number | null>(null);
  const [acceptLoading, setAcceptLoading] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Evaluate Form States (Registrasi)
  const [selectedStatus, setSelectedStatus] = useState<
    'ACCEPTED' | 'REJECTED' | 'PENDING'
  >('PENDING');
  const [selectedDivisiId, setSelectedDivisiId] = useState<number | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState<number | ''>('');

  // Edit Member States
  const [editMemberTipe, setEditMemberTipe] = useState<'INTERN' | 'MEMBER'>(
    'INTERN',
  );
  const [editMemberMentorId, setEditMemberMentorId] = useState<number | ''>('');
  const [editMemberTeamId, setEditMemberTeamId] = useState<number | ''>('');

  // Mentor Management States
  const [mentorName, setMentorName] = useState('');
  const [mentorLink, setMentorLink] = useState('');
  const [editMentorId, setEditMentorId] = useState<number | null>(null);

  // Team Management States
  const [teamName, setTeamName] = useState('');
  const [teamKategori, setTeamKategori] = useState('Software Engineering');
  const [editTeamId, setEditTeamId] = useState<number | null>(null);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type:
      | 'view_reg'
      | 'evaluate_reg'
      | 'view_member'
      | 'edit_member'
      | 'manage_mentor'
      | 'manage_team'
      | 'manual_reg'
      | 'view_team'
      | null;
    data: Registration | MemberData | any | null;
  }>({
    isOpen: false,
    type: null,
    data: null,
  });

  const isRegistration = (data: any): data is Registration =>
    data && 'cv' in data;
  const isMember = (data: any): data is MemberData =>
    data && 'id_member' in data;

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
        const res = await fetch('/api/admin/register/intern-register', {
          credentials: 'include',
        });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message ?? 'Failed to fetch registrations');

        const formattedData: Registration[] = (data.data || []).map(
          (reg: any) => {
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
              date: reg.createdAt
                ? new Date(reg.createdAt).toLocaleDateString('id-ID', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })
                : 'N/A',
            };
          },
        );
        setRegistrations(formattedData);
      } catch (err: any) {
        setError(err.message ?? 'Unable to reach the server.');
      } finally {
        setRegLoading(false);
      }
    }
    fetchRegistrations();
  }, []);

  // Fetch Mentors (always needed for evaluation dropdown)
  useEffect(() => {
    async function fetchMentors() {
      try {
        setMentorsLoading(true);
        const res = await fetch('/api/admin/mentor', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) setMentors(data.data || []);
      } catch (err) {
        console.error('Failed to fetch mentors', err);
      } finally {
        setMentorsLoading(false);
      }
    }
    fetchMentors();
  }, []);

  // Fetch Teams
  useEffect(() => {
    async function fetchTeams() {
      try {
        setTeamsLoading(true);
        const res = await fetch('/api/admin/intern-team', {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) setTeams(data.data || []);
      } catch (err) {
        console.error('Failed to fetch teams', err);
      } finally {
        setTeamsLoading(false);
      }
    }
    fetchTeams();
  }, []);

  // Fetch Members
  useEffect(() => {
    async function fetchMembers() {
      if (members.length > 0) return;
      try {
        setMemLoading(true);
        const res = await fetch('/api/admin/member', {
          credentials: 'include',
        });
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
          id_mentor: m.id_mentor,
          mentor_nama: m.mentor?.nama ?? null,
          id_team: m.id_team ?? null,
          team_nama: m.team?.nama ?? null,
          tipe_member: m.tipe_member,
          createdAt: new Date(m.createdAt).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
        }));
        setMembers(formattedData);
      } catch (err: any) {
        console.error('Failed to fetch members', err);
      } finally {
        setMemLoading(false);
      }
    }

    if (activeTab === 'INTERN' || activeTab === 'MEMBER' || activeTab === 'TEAMS') {
      fetchMembers();
    }
  }, [activeTab, members.length]);

  // Fetch Settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        setSettingsLoading(true);
        const res = await fetch('/api/admin/settings', {
          credentials: 'include',
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message ?? 'Failed to fetch settings');
        setSettings(data.data || []);
      } catch (err: any) {
        console.error('Failed to fetch settings', err);
      } finally {
        setSettingsLoading(false);
      }
    }
    if (activeTab === 'SETTINGS') {
      fetchSettings();
    }
  }, [activeTab]);

  const updateSetting = async (type: string, payload: any) => {
    try {
      setSettingsLoading(true);
      const res = await fetch(`/api/admin/settings/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update setting');

      setSettings((prev) => {
        const exists = prev.find((s) => s.type === type);
        if (exists) {
          return prev.map((s) => (s.type === type ? data.data : s));
        }
        return [...prev, data.data];
      });
      alert(`Setting ${type} updated successfully!`);
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat mengupdate setting');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Filters
  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.name.toLowerCase().includes(search.toLowerCase()) ||
      reg.nim.toLowerCase().includes(search.toLowerCase()) ||
      reg.prodi.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredMembers = members.filter(
    (m) =>
      m.tipe_member === activeTab &&
      (m.nama.toLowerCase().includes(search.toLowerCase()) ||
        m.nim.toLowerCase().includes(search.toLowerCase()) ||
        m.divisi.toLowerCase().includes(search.toLowerCase()) ||
        (m.mentor_nama &&
          m.mentor_nama.toLowerCase().includes(search.toLowerCase()))),
  );

  const openDetailReg = async (reg: Registration) => {
    setViewLoading(reg.id);
    try {
      const res = await fetch(`/api/admin/register/intern-register/${reg.id}`, {
        credentials: 'include',
      });
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
        date: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString('id-ID', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
          : 'N/A',
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
      const res = await fetch(`/api/admin/register/intern-register/${reg.id}`, {
        credentials: 'include',
      });
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
        id_mentor: r.member?.id_mentor ?? null,
        mentor_nama: r.member?.mentor?.nama ?? null,
      };

      setModalConfig({ isOpen: true, type: 'evaluate_reg', data: detail });
      setSelectedStatus(
        r.status === 'ACCEPTED'
          ? 'ACCEPTED'
          : r.status === 'REJECTED'
            ? 'REJECTED'
            : 'ACCEPTED',
      );
      setSelectedDivisiId(
        r.id_divisi_diterima || detail.divisi1_id || detail.divisi2_id,
      );
      setSelectedMentorId(r.member?.id_mentor ?? '');
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
    setEditMemberMentorId(m.id_mentor ?? '');
    setEditMemberTeamId(m.id_team ?? '');
    setModalConfig({ isOpen: true, type: 'edit_member', data: m });
  };

  const closeModal = () => {
    if (actionLoading) return;
    setModalConfig({ isOpen: false, type: null, data: null });
    setSelectedDivisiId(null);
    setSelectedMentorId('');
    setEditMemberMentorId('');
    setEditMemberTeamId('');
    setMentorName('');
    setMentorLink('');
    setEditMentorId(null);
    setTeamName('');
    setTeamKategori('Software Engineering');
    setEditTeamId(null);
  };

  const confirmEvaluate = async () => {
    if (!modalConfig.data || !isRegistration(modalConfig.data)) return;

    if (selectedStatus === 'ACCEPTED' && !selectedDivisiId) {
      alert('Pilih divisi penempatan terlebih dahulu!');
      return;
    }

    const payload = {
      status: selectedStatus,
      id_divisi_diterima:
        selectedStatus === 'ACCEPTED' ? selectedDivisiId : null,
      id_mentor:
        selectedStatus === 'ACCEPTED' ? selectedMentorId || null : null,
    };

    try {
      setActionLoading(true);
      const res = await fetch(
        `/api/admin/register/intern-register/${modalConfig.data.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Gagal memperbarui status registrasi');

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === (modalConfig.data as Registration).id
            ? {
                ...reg,
                status: formatStatusDisplay(selectedStatus),
                divisi_diterima_id:
                  selectedStatus === 'ACCEPTED' ? selectedDivisiId : null,
              }
            : reg,
        ),
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
      const res = await fetch(
        `/api/admin/member/${modalConfig.data.id_member}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            tipe_member: editMemberTipe,
            id_mentor: editMemberMentorId || null,
            id_team: editMemberTeamId || null,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Gagal memperbarui data member');

      // Update state lokal agar UI langsung berubah tanpa refresh
      setMembers((prev) =>
        prev.map((m) =>
          m.id_member === (modalConfig.data as MemberData).id_member
            ? {
                ...m,
                tipe_member: editMemberTipe,
                id_mentor: editMemberMentorId || null,
                mentor_nama:
                  mentors.find((mnt) => mnt.id_mentor === editMemberMentorId)
                    ?.nama || null,
                id_team: editMemberTeamId || null,
                team_nama:
                  teams.find((t) => t.id_team === editMemberTeamId)?.nama ||
                  null,
              }
            : m,
        ),
      );

      closeModal();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menghubungi server');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteRegistration = async (id: number) => {
    if (!confirm('Yakin ingin menghapus registrasi ini?')) return;
    try {
      setRegLoading(true);
      const res = await fetch(`/api/admin/register/intern-register/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Gagal menghapus registrasi');
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus registrasi');
    } finally {
      setRegLoading(false);
    }
  };

  const deleteMember = async (id: number) => {
    if (!confirm('Yakin ingin menghapus member/intern ini?')) return;
    try {
      setMemLoading(true);
      const res = await fetch(`/api/admin/member/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menghapus data');
      setMembers((prev) => prev.filter((m) => m.id_member !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus data');
    } finally {
      setMemLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/admin/register/intern-register/export', {
        method: 'GET',
        credentials: 'include',
      });
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

  const saveMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorName) return;

    try {
      setActionLoading(true);
      const payload = { nama: mentorName, link_profile: mentorLink };

      let res;
      if (editMentorId) {
        res = await fetch(`/api/admin/mentor/${editMentorId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/mentor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan mentor');

      if (editMentorId) {
        setMentors((prev) =>
          prev.map((m) => (m.id_mentor === editMentorId ? data.data : m)),
        );
      } else {
        setMentors((prev) => [...prev, data.data]);
      }
      closeModal();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan mentor');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMentor = async (id: number) => {
    if (!confirm('Yakin ingin menghapus mentor ini?')) return;
    try {
      setMentorsLoading(true);
      const res = await fetch(`/api/admin/mentor/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menghapus mentor');
      setMentors((prev) => prev.filter((m) => m.id_mentor !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus mentor');
    } finally {
      setMentorsLoading(false);
    }
  };

  const openAddMentorModal = () => {
    setEditMentorId(null);
    setMentorName('');
    setMentorLink('');
    setModalConfig({ isOpen: true, type: 'manage_mentor', data: null });
  };

  const openEditMentorModal = (mnt: any) => {
    setEditMentorId(mnt.id_mentor);
    setMentorName(mnt.nama);
    setMentorLink(mnt.link_profile || '');
    setModalConfig({ isOpen: true, type: 'manage_mentor', data: mnt });
  };

  const saveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;

    try {
      setActionLoading(true);
      const payload = { nama: teamName, kategori: teamKategori };

      let res;
      if (editTeamId) {
        res = await fetch(`/api/admin/intern-team/${editTeamId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/intern-team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan team');

      if (editTeamId) {
        setTeams((prev) =>
          prev.map((t) => (t.id_team === editTeamId ? data.data : t)),
        );
      } else {
        setTeams((prev) => [...prev, data.data]);
      }
      closeModal();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan team');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTeam = async (id: number) => {
    if (!confirm('Yakin ingin menghapus team ini?')) return;
    try {
      setTeamsLoading(true);
      const res = await fetch(`/api/admin/intern-team/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menghapus team');
      setTeams((prev) => prev.filter((t) => t.id_team !== id));
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus team');
    } finally {
      setTeamsLoading(false);
    }
  };

  const openAddTeamModal = () => {
    setEditTeamId(null);
    setTeamName('');
    setTeamKategori('Software Engineering');
    setModalConfig({ isOpen: true, type: 'manage_team', data: null });
  };

  const openEditTeamModal = (t: InternTeamData) => {
    setEditTeamId(t.id_team);
    setTeamName(t.nama);
    setTeamKategori(t.kategori || 'Software Engineering');
    setModalConfig({ isOpen: true, type: 'manage_team', data: t });
  };

  const openViewTeamModal = (t: InternTeamData) => {
    setModalConfig({ isOpen: true, type: 'view_team', data: t });
  };

  const saveManualReg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const fd = new FormData(e.currentTarget);
      const payload = {
        nim: fd.get('nim'),
        nama: fd.get('nama'),
        angkatan: fd.get('angkatan'),
        id_prodi: fd.get('id_prodi'),
        divisi1: fd.get('divisi1'),
        divisi2: fd.get('divisi2'),
      };

      const res = await fetch('/api/admin/register/intern-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Gagal menambahkan pendaftar');

      const newReg = data.data;
      const formattedReg = {
        id: newReg.id_registrasi,
        nim: newReg.nim,
        name: newReg.nama,
        fakultas: '-',
        prodi: '-',
        angkatan: newReg.angkatan ?? '-',
        divisi1: '-',
        divisi1_id: null,
        divisi2: '-',
        divisi2_id: null,
        divisi_diterima_id: null,
        cv: '',
        motivationLetter: '',
        portofolio: '',
        status: formatStatusDisplay(newReg.status),
        date: newReg.createdAt
          ? new Date(newReg.createdAt).toLocaleDateString('id-ID', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
          : 'N/A',
      };
      setRegistrations((prev) => [formattedReg, ...prev]);
      closeModal();
      alert(
        'Pendaftar manual berhasil ditambahkan! Silakan refresh untuk melihat nama prodi/divisi (opsional).',
      );
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan pendaftar');
    } finally {
      setActionLoading(false);
    }
  };

  const renderTeamsTab = () => {
    const seTeams = teams.filter((t) => t.kategori === 'Software Engineering');
    const gdTeams = teams.filter((t) => t.kategori === 'Game Development');

    const renderTeamTable = (title: string, data: InternTeamData[]) => (
      <div className='mb-8'>
        <h4 className='text-md font-bold text-gray-700 mb-3 px-4'>{title}</h4>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-gray-50 text-gray-600 text-sm border-b border-gray-100'>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs w-16'>
                ID
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                Nama Team
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs text-right'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((t) => (
                <tr
                  key={t.id_team}
                  className='border-b border-gray-50 hover:bg-orange-50/30 transition-colors'
                >
                  <td className='p-4 text-gray-600 font-medium'>{t.id_team}</td>
                  <td className='p-4 text-gray-800 font-bold'>{t.nama}</td>
                  <td className='p-4 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => openViewTeamModal(t)}
                        className='p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200'
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => openEditTeamModal(t)}
                        className='p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors border border-transparent hover:border-orange-200'
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => deleteTeam(t.id_team)}
                        className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200'
                      >
                        <FiX />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className='p-8 text-center text-gray-500 font-medium'
                >
                  Belum ada team.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );

    return (
      <div className='overflow-x-auto p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-bold text-gray-800'>
            Daftar Intern Team
          </h3>
          <button
            onClick={openAddTeamModal}
            className='bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors'
          >
            + Tambah Team
          </button>
        </div>
        {teamsLoading ? (
          <div className='flex justify-center items-center p-10 text-gray-400 text-sm gap-2'>
            <FiLoader className='animate-spin text-xl' /> Memuat data team...
          </div>
        ) : (
          <div>
            {renderTeamTable('Software Engineering', seTeams)}
            {renderTeamTable('Game Development', gdTeams)}
          </div>
        )}
      </div>
    );
  };

  const renderMentorsTab = () => (
    <div className='overflow-x-auto p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-bold text-gray-800'>Daftar Mentor</h3>
        <button
          onClick={openAddMentorModal}
          className='bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors'
        >
          + Tambah Mentor
        </button>
      </div>
      {mentorsLoading ? (
        <div className='flex justify-center items-center p-10 text-gray-400 text-sm gap-2'>
          <FiLoader className='animate-spin text-xl' /> Memuat data mentor...
        </div>
      ) : (
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-gray-50 text-gray-600 text-sm border-b border-gray-100'>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs w-16'>
                ID
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                Nama Mentor
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                Profile Link
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs text-right'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mentors.length > 0 ? (
              mentors.map((mnt) => (
                <tr
                  key={mnt.id_mentor}
                  className='border-b border-gray-50 hover:bg-orange-50/30 transition-colors'
                >
                  <td className='p-4 text-gray-600 font-medium'>
                    {mnt.id_mentor}
                  </td>
                  <td className='p-4 text-gray-800 font-bold'>{mnt.nama}</td>
                  <td className='p-4 text-gray-600 text-sm'>
                    {mnt.link_profile ? (
                      <a
                        href={mnt.link_profile}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-500 hover:underline'
                      >
                        {mnt.link_profile}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className='p-4 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => openEditMentorModal(mnt)}
                        className='p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors border border-transparent hover:border-orange-200'
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => deleteMentor(mnt.id_mentor)}
                        className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200'
                      >
                        <FiX />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className='p-8 text-center text-gray-500 font-medium'
                >
                  Belum ada mentor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderRegistrationsTable = () => (
    <div className='overflow-x-auto'>
      {regLoading ? (
        <div className='flex justify-center items-center p-10 text-gray-400 text-sm gap-2'>
          <FiLoader className='animate-spin text-xl' /> Memuat data
          registrasi...
        </div>
      ) : (
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-gray-50 text-gray-600 text-sm border-b border-gray-100'>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                NIM
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                Name
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                Division
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                Date Applied
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                Status
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs text-right'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((reg) => (
                <tr
                  key={reg.id}
                  className='border-b border-gray-50 hover:bg-orange-50/30 transition-colors'
                >
                  <td className='p-4 text-gray-800 font-bold'>{reg.nim}</td>
                  <td className='p-4 text-gray-800 font-semibold'>
                    {reg.name}
                  </td>
                  <td className='p-4 text-gray-600 font-medium'>{reg.prodi}</td>
                  <td className='p-4 text-gray-500'>{reg.date}</td>
                  <td className='p-4'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        reg.status === 'Accepted'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : reg.status === 'Rejected'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </td>
                  <td className='p-4 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => openDetailReg(reg)}
                        disabled={
                          viewLoading === reg.id || acceptLoading === reg.id
                        }
                        className='p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200 disabled:opacity-50'
                        title='View Details'
                      >
                        {viewLoading === reg.id ? (
                          <FiLoader className='animate-spin' />
                        ) : (
                          <FiEye />
                        )}
                      </button>
                      <button
                        onClick={() => openEvaluateModal(reg)}
                        disabled={
                          acceptLoading === reg.id || viewLoading === reg.id
                        }
                        className={`p-2 rounded-lg transition-colors border border-transparent disabled:opacity-50 ${
                          reg.status === 'Pending'
                            ? 'text-green-600 hover:bg-green-100 hover:border-green-200'
                            : 'text-orange-600 hover:bg-orange-100 hover:border-orange-200'
                        }`}
                        title={
                          reg.status === 'Pending'
                            ? 'Evaluate Application'
                            : 'Edit Evaluation'
                        }
                      >
                        {acceptLoading === reg.id ? (
                          <FiLoader className='animate-spin' />
                        ) : reg.status === 'Pending' ? (
                          <FiCheckCircle />
                        ) : (
                          <FiEdit />
                        )}
                      </button>
                      <button
                        onClick={() => deleteRegistration(reg.id)}
                        className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200'
                        title='Delete'
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className='p-8 text-center text-gray-500 font-medium'
                >
                  {search
                    ? `Tidak ada pendaftar yang cocok dengan "${search}"`
                    : 'Belum ada pendaftar.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderMembersTable = () => (
    <div className='overflow-x-auto'>
      {memLoading ? (
        <div className='flex justify-center items-center p-10 text-gray-400 text-sm gap-2'>
          <FiLoader className='animate-spin text-xl' /> Memuat data{' '}
          {activeTab.toLowerCase()}...
        </div>
      ) : (
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-gray-50 text-gray-600 text-sm border-b border-gray-100'>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                NIM
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                Nama
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                Divisi
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs'>
                Mentor
              </th>
              <th className='p-4 font-semibold uppercase tracking-wider text-xs text-right'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m) => (
                <tr
                  key={m.id_member}
                  className='border-b border-gray-50 hover:bg-orange-50/30 transition-colors'
                >
                  <td className='p-4 text-gray-800 font-bold'>{m.nim}</td>
                  <td className='p-4'>
                    <div className='font-semibold text-gray-800'>{m.nama}</div>
                    <div className='text-xs text-gray-400 mt-0.5'>
                      Angkatan {m.angkatan}
                    </div>
                  </td>
                  <td className='p-4 text-gray-800 font-medium'>{m.divisi}</td>
                  <td className='p-4 text-gray-600'>
                    {m.mentor_nama ? (
                      <span className='px-2.5 py-1 bg-gray-100 rounded-md text-sm border border-gray-200 font-medium'>
                        {m.mentor_nama}
                      </span>
                    ) : (
                      <span className='text-gray-400 italic text-sm'>-</span>
                    )}
                  </td>
                  <td className='p-4 text-right'>
                    <div className='flex justify-end gap-2'>
                      <button
                        onClick={() => openMemberDetail(m)}
                        className='p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200'
                        title='View Details'
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => openMemberEdit(m)}
                        className='p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors border border-transparent hover:border-orange-200'
                        title='Edit Member'
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => deleteMember(m.id_member)}
                        className='p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200'
                        title='Delete Member'
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className='p-8 text-center text-gray-500 font-medium'
                >
                  {search
                    ? `Tidak ada ${activeTab.toLowerCase()} yang cocok dengan "${search}"`
                    : `Belum ada data ${activeTab.toLowerCase()}.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderSettingsTab = () => {
    const getSetting = (type: string) =>
      settings.find((s) => s.type === type) || {
        type,
        isActive: false,
        startDate: null,
        endDate: null,
      };
    const regSetting = getSetting('REGISTRATION');
    const annSetting = getSetting('ANNOUNCEMENT');

    const SettingCard = ({
      title,
      setting,
      type,
    }: {
      title: string;
      setting: any;
      type: string;
    }) => {
      const [isActive, setIsActive] = useState(setting.isActive);
      const [startDate, setStartDate] = useState(
        setting.startDate
          ? new Date(setting.startDate).toISOString().slice(0, 16)
          : '',
      );
      const [endDate, setEndDate] = useState(
        setting.endDate
          ? new Date(setting.endDate).toISOString().slice(0, 16)
          : '',
      );

      useEffect(() => {
        setIsActive(setting.isActive);
        setStartDate(
          setting.startDate
            ? new Date(setting.startDate).toISOString().slice(0, 16)
            : '',
        );
        setEndDate(
          setting.endDate
            ? new Date(setting.endDate).toISOString().slice(0, 16)
            : '',
        );
      }, [setting]);

      return (
        <div className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-black'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>{title}</h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-semibold text-gray-700'>
                Enable Form
              </span>
              <label className='relative inline-flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className='sr-only peer'
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Start Date & Time (Opsional)
              </label>
              <input
                type='datetime-local'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-xl text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                End Date & Time (Opsional)
              </label>
              <input
                type='datetime-local'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-xl text-sm'
              />
            </div>
            <div className='pt-4 border-t border-gray-100'>
              <button
                onClick={() =>
                  updateSetting(type, {
                    isActive,
                    startDate: startDate || null,
                    endDate: endDate || null,
                  })
                }
                disabled={settingsLoading}
                className='w-full py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors disabled:opacity-50'
              >
                Save {title} Setting
              </button>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 min-h-[400px]'>
        {settingsLoading && settings.length === 0 ? (
          <div className='col-span-full flex justify-center items-center text-gray-500'>
            <FiLoader className='animate-spin text-2xl' />
          </div>
        ) : (
          <>
            <SettingCard
              title='Registration Form'
              setting={regSetting}
              type='REGISTRATION'
            />
            <SettingCard
              title='Announcement Page'
              setting={annSetting}
              type='ANNOUNCEMENT'
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className='space-y-6 relative'>
      {/* HEADER */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
        <div>
          <h2 className='text-3xl font-bold text-gray-800 flex items-center gap-3'>
            <FiUsers className='text-orange-500' /> Member Management
          </h2>
          <p className='text-gray-500 mt-1'>
            Review registrations, manage interns, and permanent members.
          </p>
        </div>

        {activeTab === 'REGISTER' && (
          <div className='flex gap-2'>
            <button
              onClick={() =>
                setModalConfig({ isOpen: true, type: 'manual_reg', data: null })
              }
              className='flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm'
            >
              + Tambah Manual
            </button>
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className='flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-70 shadow-sm border border-orange-600/20'
            >
              {isExporting ? (
                <FiLoader className='animate-spin text-xl' />
              ) : (
                <FiDownload className='text-xl' />
              )}
              {isExporting ? 'Exporting...' : 'Export Registrations'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm'>
          ⚠️ {error}
        </div>
      )}

      {/* FILTER & TABS CARD */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col'>
        {/* TOP BAR: TABS & SEARCH */}
        <div className='p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col lg:flex-row gap-4 justify-between items-center'>
          <div className='flex bg-gray-200/60 p-1.5 rounded-xl w-full lg:w-auto overflow-x-auto'>
            <button
              onClick={() => {
                setActiveTab('REGISTER');
                setSearch('');
              }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 py-2 px-5 font-semibold text-sm rounded-lg transition-all ${
                activeTab === 'REGISTER'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <FiUserPlus /> Register
            </button>
            <button
              onClick={() => {
                setActiveTab('INTERN');
                setSearch('');
              }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 py-2 px-5 font-semibold text-sm rounded-lg transition-all ${
                activeTab === 'INTERN'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <FiUser /> Interns
            </button>
            <button
              onClick={() => {
                setActiveTab('TEAMS');
                setSearch('');
              }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 py-2 px-5 font-semibold text-sm rounded-lg transition-all ${
                activeTab === 'TEAMS'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <FiUsers /> Teams
            </button>
            <button
              onClick={() => {
                setActiveTab('MEMBER');
                setSearch('');
              }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 py-2 px-5 font-semibold text-sm rounded-lg transition-all ${
                activeTab === 'MEMBER'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <FiAward /> Members
            </button>
            <button
              onClick={() => {
                setActiveTab('MENTORS');
                setSearch('');
              }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 py-2 px-5 font-semibold text-sm rounded-lg transition-all ${
                activeTab === 'MENTORS'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <FiUsers /> Mentors
            </button>
            <button
              onClick={() => {
                setActiveTab('SETTINGS');
                setSearch('');
              }}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 py-2 px-5 font-semibold text-sm rounded-lg transition-all ${
                activeTab === 'SETTINGS'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <FiSettings /> Settings
            </button>
          </div>

          <div className='relative w-full lg:w-96'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FiSearch className='text-gray-400' />
            </div>
            <input
              type='text'
              placeholder={`Search in ${activeTab.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all sm:text-sm text-black'
            />
          </div>
        </div>

        {/* DYNAMIC TABLE CONTENT */}
        {activeTab === 'REGISTER'
          ? renderRegistrationsTable()
          : activeTab === 'SETTINGS'
            ? renderSettingsTab()
            : activeTab === 'MENTORS'
              ? renderMentorsTab()
              : activeTab === 'TEAMS'
                ? renderTeamsTab()
                : renderMembersTable()}
      </div>

      {/* MODAL GLOBAL CONFIG */}
      {modalConfig.isOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200'>
            <div className='flex justify-between items-center p-5 border-b border-gray-100'>
              <h3 className='text-lg font-bold text-gray-800'>
                {modalConfig.type === 'view_reg' && 'Registration Details'}
                {modalConfig.type === 'evaluate_reg' && 'Evaluate Application'}
                {modalConfig.type === 'view_member' && 'Member Details'}
                {modalConfig.type === 'edit_member' && 'Edit Member'}
                {modalConfig.type === 'manage_mentor' &&
                  (editMentorId ? 'Edit Mentor' : 'Tambah Mentor')}
                {modalConfig.type === 'manage_team' &&
                  (editTeamId ? 'Edit Team' : 'Tambah Team')}
                {modalConfig.type === 'manual_reg' &&
                  'Tambah Registrasi Manual'}
                {modalConfig.type === 'view_team' && 'Detail Team'}
              </h3>
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className='text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50'
              >
                <FiX className='text-xl' />
              </button>
            </div>

            <div className='p-6'>
              {/* 1. VIEW DETAIL REGISTRASI */}
              {modalConfig.type === 'view_reg' &&
                isRegistration(modalConfig.data) && (
                  <div className='space-y-4 max-h-[65vh] overflow-y-auto pr-1'>
                    <div className='flex items-center justify-between pb-3 border-b border-gray-100'>
                      <span className='text-sm text-gray-500 font-medium'>
                        Status
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          modalConfig.data.status === 'Accepted'
                            ? 'bg-green-100 text-green-700'
                            : modalConfig.data.status === 'Rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {modalConfig.data.status}
                      </span>
                    </div>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                      Data Pribadi
                    </p>
                    <DetailRow
                      label='Nama Lengkap'
                      value={modalConfig.data.name}
                    />
                    <DetailRow label='NIM' value={modalConfig.data.nim} />
                    <DetailRow
                      label='Angkatan'
                      value={String(modalConfig.data.angkatan)}
                    />
                    <DetailRow
                      label='Fakultas'
                      value={modalConfig.data.fakultas}
                    />
                    <DetailRow
                      label='Program Studi'
                      value={modalConfig.data.prodi}
                    />

                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wider pt-2'>
                      Pilihan Divisi
                    </p>
                    <DivisionRow
                      label='Divisi Pilihan 1'
                      value={modalConfig.data.divisi1}
                      isAccepted={
                        modalConfig.data.status === 'Accepted' &&
                        modalConfig.data.divisi_diterima_id ===
                          modalConfig.data.divisi1_id
                      }
                    />
                    <DivisionRow
                      label='Divisi Pilihan 2'
                      value={modalConfig.data.divisi2}
                      isAccepted={
                        modalConfig.data.status === 'Accepted' &&
                        modalConfig.data.divisi_diterima_id ===
                          modalConfig.data.divisi2_id
                      }
                    />

                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wider pt-2'>
                      Dokumen
                    </p>
                    <DocLink label='CV' url={modalConfig.data.cv} />
                    <DocLink
                      label='Motivation Letter'
                      url={modalConfig.data.motivationLetter}
                    />
                    {modalConfig.data.portofolio && (
                      <DocLink
                        label='Portofolio'
                        url={modalConfig.data.portofolio}
                      />
                    )}
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wider pt-2'>
                      Lainnya
                    </p>
                    <DetailRow
                      label='Tanggal Daftar'
                      value={modalConfig.data.date}
                    />
                  </div>
                )}

              {/* 2. EVALUATE REGISTRASI */}
              {modalConfig.type === 'evaluate_reg' &&
                isRegistration(modalConfig.data) && (
                  <div className='text-gray-600 leading-relaxed space-y-5'>
                    <div>
                      <label className='text-sm font-bold text-gray-700 block mb-2'>
                        1. Keputusan Status
                      </label>
                      <div className='flex gap-3'>
                        <button
                          onClick={() => setSelectedStatus('ACCEPTED')}
                          className={`flex-1 py-2 rounded-xl border font-semibold transition-all ${selectedStatus === 'ACCEPTED' ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => setSelectedStatus('REJECTED')}
                          className={`flex-1 py-2 rounded-xl border font-semibold transition-all ${selectedStatus === 'REJECTED' ? 'bg-red-100 border-red-500 text-red-700' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    {selectedStatus === 'ACCEPTED' && (
                      <div className='space-y-4 animate-in fade-in slide-in-from-top-2 duration-300'>
                        <div>
                          <label className='text-sm font-bold text-gray-700 block mb-2'>
                            2. Penempatan Divisi
                          </label>
                          <div className='flex flex-col gap-2'>
                            {modalConfig.data?.divisi1_id != null && (
                              <label
                                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedDivisiId === modalConfig.data?.divisi1_id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                              >
                                <input
                                  type='radio'
                                  name='divisi'
                                  value={modalConfig.data?.divisi1_id}
                                  checked={
                                    selectedDivisiId ===
                                    modalConfig.data?.divisi1_id
                                  }
                                  onChange={() =>
                                    setSelectedDivisiId(
                                      (modalConfig.data as Registration)
                                        .divisi1_id as number,
                                    )
                                  }
                                  className='w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300'
                                />
                                <span className='text-gray-700 font-medium'>
                                  1: {modalConfig.data?.divisi1}
                                </span>
                              </label>
                            )}
                            {modalConfig.data?.divisi2_id != null && (
                              <label
                                className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${selectedDivisiId === modalConfig.data?.divisi2_id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                              >
                                <input
                                  type='radio'
                                  name='divisi'
                                  value={modalConfig.data?.divisi2_id}
                                  checked={
                                    selectedDivisiId ===
                                    modalConfig.data?.divisi2_id
                                  }
                                  onChange={() =>
                                    setSelectedDivisiId(
                                      (modalConfig.data as Registration)
                                        .divisi2_id as number,
                                    )
                                  }
                                  className='w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300'
                                />
                                <span className='text-gray-700 font-medium'>
                                  2: {modalConfig.data?.divisi2}
                                </span>
                              </label>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className='text-sm font-bold text-gray-700 block mb-2'>
                            3. Mentor (Opsional)
                          </label>
                          <select
                            value={selectedMentorId}
                            onChange={(e) =>
                              setSelectedMentorId(
                                e.target.value === ''
                                  ? ''
                                  : parseInt(e.target.value),
                              )
                            }
                            className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 bg-white'
                          >
                            <option value=''>-- Belum ada mentor --</option>
                            {mentors.map((mnt) => (
                              <option key={mnt.id_mentor} value={mnt.id_mentor}>
                                {mnt.nama}
                              </option>
                            ))}
                          </select>
                          <p className='text-xs text-gray-400 mt-1'>
                            Pilih mentor yang bertanggung jawab.
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedStatus === 'REJECTED' && (
                      <div className='p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm animate-in fade-in duration-300'>
                        Kamu akan menolak{' '}
                        <strong>{modalConfig.data.name}</strong>. Jika
                        sebelumnya ia berstatus Accepted, data dari tabel Member
                        akan dihapus.
                      </div>
                    )}
                  </div>
                )}

              {/* 3. VIEW DETAIL MEMBER */}
              {modalConfig.type === 'view_member' &&
                isMember(modalConfig.data) && (
                  <div className='space-y-4 max-h-[65vh] overflow-y-auto pr-1'>
                    <div className='flex items-center justify-between pb-3 border-b border-gray-100'>
                      <span className='text-sm text-gray-500 font-medium'>
                        Tipe
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                          modalConfig.data.tipe_member === 'MEMBER'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {modalConfig.data.tipe_member}
                      </span>
                    </div>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                      Identitas
                    </p>
                    <DetailRow
                      label='Nama Lengkap'
                      value={modalConfig.data.nama}
                    />
                    <DetailRow label='NIM' value={modalConfig.data.nim} />
                    <DetailRow
                      label='Angkatan'
                      value={String(modalConfig.data.angkatan)}
                    />
                    <DetailRow
                      label='Fakultas'
                      value={modalConfig.data.fakultas}
                    />
                    <DetailRow
                      label='Program Studi'
                      value={modalConfig.data.prodi}
                    />

                    <p className='text-xs font-bold text-gray-400 uppercase tracking-wider pt-2'>
                      Penempatan
                    </p>
                    <DetailRow label='Divisi' value={modalConfig.data.divisi} />
                    <DetailRow
                      label='Mentor'
                      value={modalConfig.data.mentor_nama || '-'}
                    />
                  </div>
                )}

              {/* 4. EDIT MEMBER */}
              {modalConfig.type === 'edit_member' &&
                isMember(modalConfig.data) && (
                  <div className='text-gray-600 leading-relaxed space-y-5'>
                    <div>
                      <label className='text-sm font-bold text-gray-700 block mb-2'>
                        Tipe Keanggotaan
                      </label>
                      <div className='flex gap-3'>
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
                      <label className='text-sm font-bold text-gray-700 block mb-2'>
                        Mentor Penugasan
                      </label>
                      <select
                        value={editMemberMentorId}
                        onChange={(e) =>
                          setEditMemberMentorId(
                            e.target.value === ''
                              ? ''
                              : parseInt(e.target.value),
                          )
                        }
                        className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 bg-white'
                      >
                        <option value=''>-- Tidak ada mentor --</option>
                        {mentors.map((mnt) => (
                          <option key={mnt.id_mentor} value={mnt.id_mentor}>
                            {mnt.nama}
                          </option>
                        ))}
                      </select>
                      <p className='text-xs text-gray-400 mt-1'>
                        Kosongkan jika tidak ada mentor spesifik.
                      </p>
                    </div>

                    <div>
                      <label className='text-sm font-bold text-gray-700 block mb-2'>
                        Intern Team
                      </label>
                      <select
                        value={editMemberTeamId}
                        onChange={(e) =>
                          setEditMemberTeamId(
                            e.target.value === ''
                              ? ''
                              : parseInt(e.target.value),
                          )
                        }
                        className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 bg-white'
                      >
                        <option value=''>-- Tidak ada team --</option>
                        {teams.map((t) => (
                          <option key={t.id_team} value={t.id_team}>
                            {t.nama}
                          </option>
                        ))}
                      </select>
                      <p className='text-xs text-gray-400 mt-1'>
                        Hanya berlaku untuk tipe Intern.
                      </p>
                    </div>
                  </div>
                )}

              {/* 5. MANAGE MENTOR */}
              {modalConfig.type === 'manage_mentor' && (
                <form
                  onSubmit={saveMentor}
                  className='text-gray-600 leading-relaxed space-y-5'
                  id='mentorForm'
                >
                  <div>
                    <label className='text-sm font-bold text-gray-700 block mb-2'>
                      Nama Mentor <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={mentorName}
                      onChange={(e) => setMentorName(e.target.value)}
                      placeholder='Masukkan nama mentor'
                      className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-sm font-bold text-gray-700 block mb-2'>
                      Link Profile (Opsional)
                    </label>
                    <input
                      type='url'
                      value={mentorLink}
                      onChange={(e) => setMentorLink(e.target.value)}
                      placeholder='Contoh: https://linkedin.com/in/...'
                      className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700'
                    />
                    <p className='text-xs text-gray-400 mt-1'>
                      Bisa berupa link LinkedIn, Instagram, dll.
                    </p>
                  </div>
                </form>
              )}

              {/* 6. MANAGE TEAM */}
              {modalConfig.type === 'manage_team' && (
                <form
                  onSubmit={saveTeam}
                  className='text-gray-600 leading-relaxed space-y-5'
                  id='teamForm'
                >
                  <div>
                    <label className='text-sm font-bold text-gray-700 block mb-2'>
                      Nama Team <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder='Masukkan nama team'
                      className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-sm font-bold text-gray-700 block mb-2'>
                      Kategori <span className='text-red-500'>*</span>
                    </label>
                    <select
                      value={teamKategori}
                      onChange={(e) => setTeamKategori(e.target.value)}
                      className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-700 bg-white'
                      required
                    >
                      <option value='Software Engineering'>
                        Software Engineering
                      </option>
                      <option value='Game Development'>Game Development</option>
                    </select>
                  </div>
                </form>
              )}

              {/* 6.5. VIEW TEAM MEMBERS */}
              {modalConfig.type === 'view_team' && modalConfig.data && (
                <div className='space-y-4 max-h-[65vh] overflow-y-auto pr-1'>
                  <div className='flex items-center justify-between pb-3 border-b border-gray-100'>
                    <span className='text-sm text-gray-500 font-medium'>
                      Kategori
                    </span>
                    <span className='px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200'>
                      {modalConfig.data.kategori}
                    </span>
                  </div>
                  <DetailRow label='Nama Team' value={modalConfig.data.nama} />

                  <div className='mt-4 pt-4 border-t border-gray-100'>
                    <h4 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>
                      Anggota Team
                    </h4>
                    {members.filter(
                      (m) => m.id_team === modalConfig.data.id_team,
                    ).length > 0 ? (
                      <div className='space-y-2'>
                        {members
                          .filter((m) => m.id_team === modalConfig.data.id_team)
                          .map((m) => (
                            <div
                              key={m.id_member}
                              className='p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center'
                            >
                              <div>
                                <p className='font-bold text-gray-800 text-sm'>
                                  {m.nama}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {m.nim || '-'}
                                </p>
                              </div>
                              {m.divisi && (
                                <span className='text-[10px] font-semibold px-2 py-1 bg-white border border-gray-200 rounded text-gray-600'>
                                  {m.divisi}
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className='text-sm text-gray-500 italic'>
                        Belum ada anggota yang di-assign ke team ini.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 7. MANUAL REGISTRATION */}
              {modalConfig.type === 'manual_reg' && (
                <form
                  onSubmit={saveManualReg}
                  className='text-gray-600 leading-relaxed space-y-5 max-h-[65vh] overflow-y-auto pr-1'
                  id='manualRegForm'
                >
                  <div>
                    <label className='text-sm font-bold text-gray-700 block mb-2'>
                      NIM <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='nim'
                      required
                      className='w-full px-4 py-2 border border-gray-200 rounded-xl'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-bold text-gray-700 block mb-2'>
                      Nama <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='nama'
                      required
                      className='w-full px-4 py-2 border border-gray-200 rounded-xl'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-bold text-gray-700 block mb-2'>
                      Angkatan <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      name='angkatan'
                      required
                      className='w-full px-4 py-2 border border-gray-200 rounded-xl'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-bold text-gray-700 block mb-2'>
                      ID Prodi <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      name='id_prodi'
                      required
                      className='w-full px-4 py-2 border border-gray-200 rounded-xl'
                      placeholder='Contoh: 1'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-bold text-gray-700 block mb-2'>
                      ID Divisi Pilihan 1{' '}
                      <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      name='divisi1'
                      required
                      className='w-full px-4 py-2 border border-gray-200 rounded-xl'
                      placeholder='Contoh: 1'
                    />
                  </div>
                  <div>
                    <label className='text-sm font-bold text-gray-700 block mb-2'>
                      ID Divisi Pilihan 2{' '}
                      <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      name='divisi2'
                      required
                      className='w-full px-4 py-2 border border-gray-200 rounded-xl'
                      placeholder='Contoh: 2'
                    />
                  </div>
                </form>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className='p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3'>
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className='px-5 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50'
              >
                {modalConfig.type?.includes('view') ? 'Close' : 'Cancel'}
              </button>

              {modalConfig.type === 'evaluate_reg' && (
                <button
                  onClick={confirmEvaluate}
                  disabled={
                    actionLoading ||
                    (selectedStatus === 'ACCEPTED' && !selectedDivisiId)
                  }
                  className='px-5 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2'
                >
                  {actionLoading && <FiLoader className='animate-spin' />}
                  Save Evaluation
                </button>
              )}

              {modalConfig.type === 'edit_member' && (
                <button
                  onClick={confirmEditMember}
                  disabled={actionLoading}
                  className='px-5 py-2 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2'
                >
                  {actionLoading && <FiLoader className='animate-spin' />}
                  Update Member
                </button>
              )}

              {modalConfig.type === 'manage_mentor' && (
                <button
                  type='submit'
                  form='mentorForm'
                  disabled={actionLoading || !mentorName}
                  className='px-5 py-2 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2'
                >
                  {actionLoading && <FiLoader className='animate-spin' />}
                  Save Mentor
                </button>
              )}
              {modalConfig.type === 'manage_team' && (
                <button
                  type='submit'
                  form='teamForm'
                  disabled={actionLoading || !teamName}
                  className='px-5 py-2 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2'
                >
                  {actionLoading && <FiLoader className='animate-spin' />}
                  Save Team
                </button>
              )}
              {modalConfig.type === 'manual_reg' && (
                <button
                  type='submit'
                  form='manualRegForm'
                  disabled={actionLoading}
                  className='px-5 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2'
                >
                  {actionLoading && <FiLoader className='animate-spin' />}
                  Tambah Pendaftar
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
    <div className='flex justify-between items-start gap-4'>
      <span className='text-sm text-gray-500 font-medium shrink-0'>
        {label}
      </span>
      <span className='text-sm font-semibold text-gray-800 text-right'>
        {value || '-'}
      </span>
    </div>
  );
}

function DivisionRow({
  label,
  value,
  isAccepted,
}: {
  label: string;
  value: string;
  isAccepted: boolean;
}) {
  return (
    <div className='flex justify-between items-start gap-4'>
      <span className='text-sm text-gray-500 font-medium shrink-0'>
        {label}
      </span>
      <div className='flex items-center gap-2 text-right'>
        {isAccepted && (
          <span className='px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase'>
            Accepted
          </span>
        )}
        <span className='text-sm font-semibold text-gray-800'>
          {value || '-'}
        </span>
      </div>
    </div>
  );
}

function DocLink({ label, url }: { label: string; url: string }) {
  return (
    <div className='flex justify-between items-center gap-4'>
      <span className='text-sm text-gray-500 font-medium shrink-0'>
        {label}
      </span>
      {url ? (
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm font-semibold text-blue-600 hover:underline truncate max-w-[200px]'
        >
          Buka Dokumen ↗
        </a>
      ) : (
        <span className='text-sm text-gray-400'>-</span>
      )}
    </div>
  );
}
