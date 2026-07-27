'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiArrowLeft,
  FiArrowRight,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiExternalLink,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import Wrapper from '@/components/_shared/Wrapper';

type AnnouncementResult = {
  nim: string;
  nama: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  divisi_diterima: string | null;
  mentor: {
    nama: string;
    link_profile: string | null;
  } | null;
  team: {
    nama: string;
    kategori: string;
    members: {
      nim: string;
      nama: string;
      mentor: {
        nama: string;
      } | null;
      divisi: {
        nama: string;
      } | null;
    }[];
  } | null;
} | null;

export default function AnnouncementPage() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [nim, setNim] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnnouncementResult>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showTeamModal, setShowTeamModal] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/settings/ANNOUNCEMENT');
        const data = await res.json();
        setIsOpen(data.isOpen);
      } catch (error) {
        console.error('Failed to check announcement status', error);
        setIsOpen(false);
      }
    }
    checkStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim.trim()) return;

    setIsLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch(`/api/announcement/${nim}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'NIM tidak ditemukan.');
      } else {
        setResult(data.data);
      }
    } catch (error) {
      setErrorMsg('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isOpen === null) {
    return (
      <div className='min-h-[calc(100vh-200px)] bg-[#FFF8F3] py-24 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className='min-h-[calc(100vh-200px)] bg-[#FFF8F3] py-24 flex items-center justify-center relative overflow-hidden'>
        <div className='absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none' />
        <Wrapper
          className='flex flex-col items-center text-center relative z-10'
          backgroundColor='bg-transparent'
        >
          <h1 className='text-3xl md:text-5xl font-black text-neutral-900 mb-4'>
            Pengumuman <span className='text-primary'>Belum Dibuka</span>
          </h1>
          <p className='text-lg md:text-xl font-medium text-neutral-500 mb-16 max-w-2xl'>
            Hasil seleksi internship ASE Laboratory saat ini belum tersedia.
            Pantau terus informasi selanjutnya melalui sosial media kami.
          </p>

          <div className='flex flex-col md:flex-row items-center gap-4 md:gap-6'>
            <Image
              src='/Images/logo-coloured.svg'
              alt='ASE Laboratory Logo'
              width={120}
              height={120}
              className='w-20 h-20 md:w-28 md:h-28'
            />
            <div className='text-center md:text-left'>
              <p className='text-neutral-900 font-bold text-xl md:text-3xl leading-[1.1] tracking-tight'>
                Advanced <br className='hidden md:block' />
                Software <br className='hidden md:block' />
                Engineering
              </p>
              <p className='text-neutral-500 text-[10px] md:text-xs tracking-[0.2em] font-medium mt-1 md:mt-2'>
                LABORATORY
              </p>
            </div>
          </div>

          <Link
            href='/intern'
            className='mt-12 group relative overflow-hidden h-14 px-8 rounded-2xl bg-neutral-950 text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] hover:-translate-y-1'
          >
            <span className='relative z-10 flex items-center justify-center gap-3'>
              <FiArrowLeft className='text-lg transition-transform duration-300 group-hover:-translate-x-1' />
              Kembali
            </span>
          </Link>
        </Wrapper>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden bg-[#FFF8F3] min-h-[calc(100vh-100px)]'>
      <div className='absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none' />
      <div className='absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none' />

      <Wrapper
        className='flex flex-col items-center pt-16 md:pt-24 pb-32'
        backgroundColor='bg-transparent'
      >
        <div className='relative z-10 flex flex-col items-center text-center gap-5 mb-12'>
          <div className='space-y-4 max-w-[760px]'>
            <h1 className='text-4xl md:text-6xl font-black leading-[1.05] text-neutral-900'>
              Cek Pengumuman <br className='hidden md:block' />
              <span className='text-primary'>Internship ASE</span>
            </h1>
            <p className='text-neutral-500 text-base md:text-lg font-medium leading-relaxed'>
              Masukkan NIM kamu untuk melihat hasil seleksi internship.
            </p>
          </div>
        </div>

        <div className='relative w-full max-w-2xl z-10'>
          <div className='absolute inset-0 bg-primary/10 blur-[80px] rounded-[40px] pointer-events-none' />

          <div className='relative overflow-hidden rounded-[40px] border border-white/60 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-8 md:p-12'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-primary text-xl'>
                  <FiSearch />
                </div>
                <input
                  type='text'
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder='Masukkan NIM (contoh: 120221...)'
                  className='w-full h-16 pl-14 pr-6 rounded-2xl border border-neutral-200 bg-white text-base font-bold text-neutral-900 placeholder:text-neutral-400 placeholder:font-medium outline-none transition-all duration-200 hover:border-orange-200 focus:border-primary focus:ring-4 focus:ring-orange-100'
                  required
                />
              </div>
              <button
                type='submit'
                disabled={isLoading}
                className='group relative overflow-hidden w-full h-16 rounded-2xl bg-neutral-950 text-white font-bold text-base tracking-wide transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] disabled:opacity-70 disabled:hover:scale-100'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-primary to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                <span className='relative z-10 flex items-center justify-center gap-3'>
                  {isLoading ? 'Mengecek...' : 'Cek Hasil'}
                  {!isLoading && (
                    <FiArrowRight className='text-xl transition-transform duration-300 group-hover:translate-x-1' />
                  )}
                </span>
              </button>
            </form>

            {errorMsg && (
              <div className='mt-8 p-5 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2'>
                <FiXCircle className='text-red-500 text-2xl shrink-0 mt-0.5' />
                <div>
                  <h3 className='text-red-800 font-bold text-lg'>
                    Maaf, Kamu Tidak Lulus...
                  </h3>
                  <p className='text-red-600 font-medium'>{errorMsg}</p>
                </div>
              </div>
            )}

            {result && (
              <div className='mt-8 animate-in fade-in zoom-in-95 duration-300'>
                {result.status === 'ACCEPTED' ? (
                  <div className='rounded-3xl border border-green-200 bg-green-50 overflow-hidden relative'>
                    <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600'></div>
                    <div className='p-8 text-center'>
                      <div className='w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4'>
                        <FiCheckCircle className='text-green-600 text-3xl' />
                      </div>
                      <h3 className='text-2xl font-black text-green-800 mb-2'>
                        Selamat, {result.nama}!
                      </h3>
                      <p className='text-green-700 font-medium mb-6'>
                        Kamu dinyatakan{' '}
                        <span className='font-bold bg-green-200 px-2 py-0.5 rounded'>
                          LULUS
                        </span>{' '}
                        seleksi internship ASE Laboratory.
                      </p>

                      <div className='bg-white/60 rounded-xl p-4 mb-8 text-left border border-green-100'>
                        <p className='text-sm text-green-800 font-bold mb-1'>
                          Penempatan:
                        </p>
                        <p className='text-lg text-green-900 font-black'>
                          {result.divisi_diterima || '-'}
                        </p>
                        {result.mentor && (
                          <div className='mt-2'>
                            <p className='text-sm text-green-800 font-bold mb-1'>
                              Mentor:
                            </p>
                            {result.mentor.link_profile ? (
                              <a
                                href={result.mentor.link_profile}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-lg text-green-900 font-bold hover:underline inline-flex items-center gap-1.5 transition-colors group'
                              >
                                <span>{result.mentor.nama}</span>
                                <FiExternalLink className='text-sm text-green-700 opacity-70 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all' />
                              </a>
                            ) : (
                              <p className='text-lg text-green-900 font-bold'>
                                {result.mentor.nama}
                              </p>
                            )}
                          </div>
                        )}
                        {result.team && (
                          <div className='mt-2'>
                            <p className='text-sm text-green-800 font-bold mb-1'>
                              Team:
                            </p>
                            <div className='flex items-center gap-2'>
                              <p className='text-lg text-green-900 font-bold'>
                                {result.team.nama}
                              </p>
                              <button
                                onClick={() => setShowTeamModal(true)}
                                className='p-1.5 bg-green-200 text-green-800 hover:bg-green-300 rounded-lg transition-colors group'
                                title='Lihat Anggota Tim'
                              >
                                <FiUsers className='text-lg group-hover:scale-110 transition-transform' />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <a
                        href='https://discord.gg/yUbKuAxA'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex w-full items-center justify-center gap-3 h-14 rounded-xl bg-[#5865F2] text-white font-bold hover:bg-[#4752C4] transition-colors shadow-lg shadow-[#5865F2]/30 hover:-translate-y-0.5'
                      >
                        Join Discord Server
                      </a>
                    </div>
                  </div>
                ) : result.status === 'REJECTED' ? (
                  <div className='rounded-3xl border border-neutral-200 bg-white overflow-hidden relative'>
                    <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-300 to-neutral-400'></div>
                    <div className='p-8 text-center'>
                      <div className='w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4'>
                        <FiXCircle className='text-neutral-500 text-3xl' />
                      </div>
                      <h3 className='text-2xl font-black text-neutral-900 mb-2'>
                        Halo, {result.nama}
                      </h3>
                      <p className='text-neutral-600 font-medium leading-relaxed'>
                        Mohon maaf, kamu dinyatakan{' '}
                        <span className='font-bold text-red-500'>
                          TIDAK LULUS
                        </span>{' '}
                        pada seleksi internship kali ini.
                      </p>
                      <p className='text-neutral-500 mt-4 text-sm'>
                        Jangan menyerah dan tetap semangat! Sampai jumpa di
                        kesempatan berikutnya.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className='rounded-3xl border border-orange-200 bg-orange-50 p-8 text-center'>
                    <h3 className='text-2xl font-black text-orange-800 mb-2'>
                      Halo, {result.nama}
                    </h3>
                    <p className='text-orange-700 font-medium'>
                      Status pendaftaran kamu saat ini sedang dalam tahap{' '}
                      <span className='font-bold'>EVALUASI</span>.
                    </p>
                    <p className='text-orange-600 mt-2 text-sm'>
                      Harap kembali lagi nanti.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Wrapper>

      {/* Team Modal */}
      {showTeamModal && result?.team && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200'>
          <div className='bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200'>
            <div className='flex justify-between items-center p-5 border-b border-gray-100'>
              <h3 className='text-lg font-bold text-gray-800'>Detail Team</h3>
              <button
                onClick={() => setShowTeamModal(false)}
                className='text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors'
              >
                <FiX className='text-xl' />
              </button>
            </div>
            <div className='p-6 max-h-[65vh] overflow-y-auto pr-2'>
              <div className='flex items-center justify-between pb-3 border-b border-gray-100 mb-4'>
                <span className='text-sm text-gray-500 font-medium'>
                  Kategori
                </span>
                <span className='px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200'>
                  {result.team.kategori}
                </span>
              </div>
              <div className='flex justify-between items-start gap-4 mb-4'>
                <span className='text-sm text-gray-500 font-medium shrink-0'>
                  Nama Team
                </span>
                <span className='text-sm font-semibold text-gray-800 text-right'>
                  {result.team.nama}
                </span>
              </div>

              <div className='mt-4 pt-4 border-t border-gray-100'>
                <h4 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>
                  Anggota Team
                </h4>
                <div className='space-y-2'>
                  {result.team.members.map((m, idx) => (
                    <div
                      key={idx}
                      className='p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center'
                    >
                      <div>
                        <p className='font-bold text-gray-800 text-sm'>
                          {m.nama}
                        </p>
                        <p className='text-xs text-gray-500'>{m.nim || '-'}</p>
                      </div>
                      {m.divisi && (
                        <span className='text-[10px] font-semibold px-2 py-1 bg-white border border-gray-200 rounded text-gray-600'>
                          {m.divisi.nama}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='p-5 border-t border-gray-100 bg-gray-50 flex justify-end'>
              <button
                onClick={() => setShowTeamModal(false)}
                className='px-5 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-200 transition-colors'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
