'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiFileText,
  FiGrid,
  FiLink,
  FiUser,
} from 'react-icons/fi';

import Wrapper from '@/components/_shared/Wrapper';

type MasterData = {
  fakultas: { id_fakultas: number; nama: string }[];
  divisi: { id_divisi: number; nama: string }[];
  prodi: { id_prodi: number; nama: string; id_fakultas: number }[];
}

type FormState = {
  nim: string;
  nama: string;
  fakultas: string;
  programStudi: string;
  angkatan: string;
  divisi1: string;
  divisi2: string;
  linkCV: string;
  linkMotivation: string;
  linkPortofolio: string;
};

const initialForm: FormState = {
  nim: '',
  nama: '',
  fakultas: '',
  programStudi: '',
  angkatan: '',
  divisi1: '',
  divisi2: '',
  linkCV: '',
  linkMotivation: '',
  linkPortofolio: '',
};

export default function InternRegisterPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  
  const [masterData, setMasterData] = useState<MasterData>({
    fakultas: [],
    divisi: [],
    prodi: [],
  });

  // For Fetcthing Fakultas, Divisi, and Prodi Data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const response = await fetch('/api/fakultas');
        const result = await response.json();

        console.log("Cek Hasil dari API Master Data: ", result);

        if (result.success) {
          setMasterData({
            fakultas: result.data.fakultas,
            divisi: result.data.divisi,
            prodi: result.data.prodi,
          });
        } 
      } catch (error) {
        console.error("Error fetching master data: ", error);
      }
    };
    fetchMasterData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };

      if (name === 'fakultas') {
        updatedForm.programStudi = '';
      }

      return updatedForm;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nim: form.nim,
      nama: form.nama,
      nama_prodi: form.programStudi,
      angkatan: form.angkatan,
      cv: form.linkCV,
      motivationLetter: form.linkMotivation,
      portofolio: form.linkPortofolio,
      id_divisi_1: form.divisi1,
      id_divisi_2: form.divisi2,
    }
    try { 
        const response = fetch('/api/registrasi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify(payload),
      });
      setSubmitted(true);
      
    } catch (error) {
        console.error("Error submitting form: ", error);
    }
    
  };

  // Array for Options Selections
  const  divisiOptions = masterData.divisi.map((d) => ({
    value: d.id_divisi.toString(),
    label: d.nama,
  }))

  const fakultasOptions = masterData.fakultas.map((f) => ({
    value: f.id_fakultas.toString(),
    label: f.nama,
  }))

  const prodiOptions = masterData.prodi
    .filter((p) => p.id_fakultas.toString() === form.fakultas)
    .map((p) => ({
      value: p.nama,
      label: p.nama,
    }))

  if (submitted) {
    return (
      <div className='min-h-[calc(100vh-400px)] bg-white py-24 flex items-center justify-center'>
        <Wrapper className='flex flex-col items-center text-center'>
          <h1 className='text-3xl md:text-4xl font-bold text-primary mb-3'>
            Terima Kasih Sudah Mendaftar
          </h1>

          <p className='text-lg md:text-xl font-bold text-neutral-900 mb-16'>
            Semoga Beruntung 🎊 dan Sukses Selalu 🔥
          </p>

          {/* Logo Section */}
          <div className='flex items-center gap-6'>
            <Image
              src='/Images/logo-coloured.svg'
              alt='ASE Laboratory Logo'
              width={160}
              height={160}
              className='w-32 h-32 md:w-40 md:h-40'
            />

            <div className='text-left'>
              <p className='text-neutral-900 font-bold text-3xl md:text-4xl leading-[1.1] tracking-tight'>
                Advanced <br />
                Software <br />
                Engineering
              </p>

              <p className='text-neutral-500 text-sm md:text-base tracking-[0.2em] font-medium mt-2'>
                LABORATORY
              </p>
            </div>
          </div>
        </Wrapper>
      </div>
    );
  }

  return (
    <div className='relative overflow-x-hidden overflow-y-hidden bg-[#FFF8F3] '>
      {/* Background */}
      <div className='absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none' />

      <div className='absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none' />

      <Wrapper className='flex flex-col items-center pt-16 md:pt-32 pb-64'>
        {/* Header */}
        <div className='relative z-10 flex flex-col items-center text-center gap-5 mb-14'>
          <div className='space-y-4 max-w-[760px]'>
            <h1 className='text-4xl md:text-6xl font-black leading-[1.05] text-neutral-900'>
              Pendaftaran Internship{' '}
              <span className='text-primary'>ASE Labolatory</span>
            </h1>

            <p className='text-neutral-500 text-base md:text-lg font-medium leading-relaxed'>
              Ayo Daftar Internship untuk jadi Member ASE
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className='relative w-full max-w-7xl z-10'>
          <div className='absolute inset-0 bg-primary/20 blur-[80px] rounded-[40px] pointer-events-none' />

          <div className='relative overflow-hidden rounded-[40px] border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.08)]'>
            <div className='grid lg:grid-cols-[360px_1fr]'>
              {/* LEFT PANEL */}
              <div className='relative overflow-hidden bg-neutral-950 p-10 text-white'>
                {/* Glow */}
                <div className='absolute -bottom-20 -right-20 w-72 h-72 bg-primary/30 blur-3xl rounded-full' />

                <div className='absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]' />

                <div className='relative z-10 flex flex-col h-full'>
                  {/* Logo */}
                  <div className='mb-12'>
                    <div className='w-full aspect-square rounded-3xl bg-white flex items-center justify-center'>
                      <Image
                        src='/Images/logo-coloured.svg'
                        alt='ASE Laboratory'
                        width={224}
                        height={224}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className='space-y-6'>
                    <h2 className='text-4xl font-black leading-tight'>
                      Start Your Journey With ASE Lab
                    </h2>

                    <p className='text-neutral-400 leading-relaxed text-sm md:text-base'>
                      Bangun pengalaman, relasi, dan portfolio bersama ASE
                      Laboratory.
                    </p>
                  </div>

                  {/* Features */}
                  <div className='mt-12 space-y-6'>
                    <FeatureItem text='Mempelajari mendalam terkait bidang-bidang Software Engineering dan Game Development' />
                    <FeatureItem text='Mengimplementasikan teknologi standar industri ke dalam proyek nyata' />
                    <FeatureItem text='Membangun koneksi baru dengan sesama member yang memiliki ketertarikan yang sama' />
                    <FeatureItem text='Mendapatkan pengalaman membangun proyek perangkat lunak nyata secara berkelompok' />
                  </div>

                  {/* Footer */}
                  <div className='mt-auto pt-16'>
                    <div className='rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5'>
                      <p className='text-sm text-neutral-300 leading-relaxed'>
                        Isi formulir dengan data yang benar dan pastikan seluruh
                        dokumen dapat diakses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT FORM */}
              <div className='relative p-8 md:p-12 lg:p-14'>
                <div className='absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]' />

                <form
                  onSubmit={handleSubmit}
                  className='relative z-10 space-y-8'
                >
                  {/* SECTION 1 */}
                  <FormSection
                    title='Informasi Pribadi'
                    subtitle='Lengkapi data diri dengan benar'
                    icon={<FiUser />}
                  >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        label='Nomor Induk Mahasiswa'
                        name='nim'
                        placeholder='Contoh: 1234567890'
                        value={form.nim}
                        onChange={handleChange}
                        required
                      />

                      <FormField
                        label='Nama Lengkap'
                        name='nama'
                        placeholder='Nama sesuai KTP'
                        value={form.nama}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <SelectField
                        label='Fakultas'
                        name='fakultas'
                        value={form.fakultas}
                        onChange={handleChange}
                        options={fakultasOptions}
                        required
                      />

                      <SelectField
                        label='Program Studi'
                        name='programStudi'
                        value={form.programStudi}
                        options={prodiOptions}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <FormField
                      label='Angkatan'
                      name='angkatan'
                      placeholder='Contoh: 2023'
                      value={form.angkatan}
                      onChange={handleChange}
                      required
                    />
                  </FormSection>

                  {/* SECTION 2 */}
                  <FormSection
                    title='Pilihan Divisi'
                    subtitle='Pilih divisi utama dan cadangan'
                    icon={<FiGrid />}
                  >
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <SelectField
                        label='Divisi 1 (Pilihan Utama)'
                        name='divisi1'
                        value={form.divisi1}
                        onChange={handleChange}
                        options={divisiOptions}
                        required
                      />

                      <SelectField
                        label='Divisi 2 (Pilihan Cadangan)'
                        name='divisi2'
                        value={form.divisi2}
                        onChange={handleChange}
                        options={divisiOptions}
                        required
                      />
                    </div>
                  </FormSection>

                  {/* SECTION 3 */}
                  <FormSection
                    title='Dokumen'
                    subtitle='Pastikan link dokumen dapat diakses'
                    icon={<FiFileText />}
                  >
                    <div className='space-y-6'>
                      <FormField
                        label='Link Dokumen Curriculum Vitae (CV)'
                        name='linkCV'
                        placeholder='https://drive.google.com/...'
                        value={form.linkCV}
                        onChange={handleChange}
                        required
                        icon={<FiLink />}
                      />

                      <FormField
                        label='Link Dokumen Motivation Letter'
                        name='linkMotivation'
                        placeholder='https://drive.google.com/...'
                        value={form.linkMotivation}
                        onChange={handleChange}
                        required
                        icon={<FiLink />}
                      />

                      <FormField
                        label='Link Dokumen Portofolio (Opsional)'
                        name='linkPortofolio'
                        placeholder='https://drive.google.com/... (boleh dikosongkan)'
                        value={form.linkPortofolio}
                        onChange={handleChange}
                        icon={<FiLink />}
                      />
                    </div>
                  </FormSection>

                  {/* SUBMIT */}
                  <button
                    type='submit'
                    className='group relative overflow-hidden w-full h-16 rounded-2xl bg-neutral-950 text-white font-bold text-sm tracking-wide transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]'
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-primary to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

                    <span className='relative z-10 flex items-center justify-center gap-3'>
                      Daftar Sekarang
                      <FiArrowRight className='text-lg transition-transform duration-300 group-hover:translate-x-1' />
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}

interface FormSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function FormSection({ title, subtitle, icon, children }: FormSectionProps) {
  return (
    <div className='rounded-[28px] border border-neutral-200 bg-neutral-50/70 p-6 md:p-8 hover:shadow-[0_20px_70px_rgba(0,0,0,0.04)] transition-all duration-300'>
      <div className='flex items-start gap-4 mb-8'>
        <div className='w-12 h-12 rounded-2xl bg-orange-100 text-primary flex items-center justify-center text-xl'>
          {icon}
        </div>

        <div>
          <h3 className='text-xl font-black text-neutral-900'>{title}</h3>

          <p className='text-sm text-neutral-500 mt-1'>{subtitle}</p>
        </div>
      </div>

      <div className='space-y-6'>{children}</div>
    </div>
  );
}

/* =========================================================
   FEATURE ITEM
========================================================= */

function FeatureItem({ text }: { text: string }) {
  return (
    <div className='flex items-start gap-4'>
      <div className='w-10 h-10 shrink-0 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center'>
        <FiCheck className='text-primary' />
      </div>

      <p className='font-semibold text-neutral-200 text-sm md:text-base leading-relaxed pt-2'>
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

interface FormFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: React.ReactNode;
}

function FormField({
  label,
  name,
  placeholder,
  value,
  onChange,
  required,
  icon,
}: FormFieldProps) {
  return (
    <div className='flex flex-col gap-3'>
      <label className='text-sm font-bold text-neutral-800 tracking-tight'>
        {label}

        {required && <span className='text-primary ml-1'>*</span>}
      </label>

      <div className='relative'>
        {icon && (
          <div className='absolute left-5 top-1/2 -translate-y-1/2 text-primary text-lg'>
            {icon}
          </div>
        )}

        <input
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`
            w-full
            h-14
            rounded-2xl
            border
            border-neutral-200
            bg-white
            text-sm
            font-medium
            text-neutral-900
            placeholder:text-neutral-400
            outline-none
            transition-all
            duration-200
            hover:border-orange-200
            focus:border-primary
            focus:ring-4
            focus:ring-orange-100
            focus:-translate-y-[1px]
            ${icon ? 'pl-14 pr-5' : 'px-5'}
          `}
        />
      </div>
    </div>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
}: SelectFieldProps) {
  return (
    <div className='flex flex-col gap-3'>
      <label className='text-sm font-bold text-neutral-800 tracking-tight'>
        {label}

        {required && <span className='text-primary ml-1'>*</span>}
      </label>

      <div className='relative'>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className='
            w-full
            h-14
            rounded-2xl
            border
            border-neutral-200
            bg-white
            px-5
            text-sm
            font-medium
            text-neutral-900
            outline-none
            appearance-none
            cursor-pointer
            transition-all
            duration-200
            hover:border-orange-200
            focus:border-primary
            focus:ring-4
            focus:ring-orange-100
            focus:-translate-y-[1px]
          '
        >
          <option value='' disabled>
            -- Pilih --
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className='absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none'>
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M6 9L12 15L18 9'
              stroke='#F97316'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
