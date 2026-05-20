import React from 'react';
import { BiNetworkChart, BiBug, BiGame } from 'react-icons/bi';
import { BsServer } from 'react-icons/bs';
import {
  FiLayout,
  FiSmartphone,
  FiFigma,
  FiMusic,
  FiPenTool,
} from 'react-icons/fi';
import { FaChessPawn } from 'react-icons/fa';

export interface DivisionData {
  title: string;
  icon: React.ReactNode;
  iconPosition: 'left' | 'right';
  description: string;
}

export const topDivisions: DivisionData[] = [
  {
    title: 'System Analyst',
    icon: <BiNetworkChart className='text-primary text-xl' />,
    iconPosition: 'left',
    description:
      'System Analyst adalah profesi di bidang teknologi informasi yang bertugas menganalisis, merancang, menguji, mengimplementasikan, dan memelihara sistem komputer agar sesuai dengan kebutuhan bisnis perusahaan. Pekerjaan ini mencakup investigasi masalah, analisis proses bisnis, perancangan solusi, pengujian teknologi, serta kerja sama dengan developer, tim IT, manajemen, dan stakeholder. Seorang System Analyst perlu memiliki kemampuan analitis, pemahaman sistem, database, dasar pemrograman, serta mengikuti perkembangan teknologi agar mampu meningkatkan efisiensi, efektivitas, dan produktivitas perusahaan.',
  },
  {
    title: 'Quality Assurance',
    icon: <BiBug className='text-primary text-xl' />,
    iconPosition: 'right',
    description:
      'Quality Assurance adalah profesi yang memastikan perangkat lunak memiliki kualitas baik, stabil, aman, dan sesuai kebutuhan pengguna sebelum dirilis atau deploy. Tugasnya meliputi menyusun test case, melakukan software testing, menemukan bug, mendokumentasikan hasil pengujian, mengevaluasi performa, keamanan, kompatibilitas, serta bekerja sama dengan developer, system analyst, dan project manager. Skill yang dibutuhkan meliputi analytical thinking, detail-oriented, software testing, automation testing, dokumentasi, pemahaman SDLC, API testing, problem-solving, serta penggunaan tools seperti Selenium, JMeter, Postman, SonarQube, dan TestRail.',
  },
];

export const middleLeftDivisions: DivisionData[] = [
  {
    title: 'Backend Development',
    icon: <BsServer className='text-primary text-xl' />,
    iconPosition: 'left',
    description:
      'Backend adalah profesi yang bertanggung jawab mengelola bagian "di balik layar" aplikasi atau website, seperti server, database, API, logika sistem, keamanan data, dan debugging. Backend memastikan data dari pengguna diproses dengan benar. Skill yang dibutuhkan meliputi bahasa pemrograman seperti Python, JavaScript/Node.js, PHP, atau Java, pengelolaan database seperti MySQL, PostgreSQL, dan MongoDB, framework seperti Express.js, Laravel, Django, atau Spring Boot, pemahaman REST API/GraphQL, keamanan sistem, Git, Postman, Docker, cloud, serta problem-solving.',
  },
  {
    title: 'Frontend Development',
    icon: <FiLayout className='text-primary text-xl' />,
    iconPosition: 'left',
    description:
      'Frontend adalah profesi yang bertanggung jawab membangun dan memelihara tampilan website atau aplikasi agar menarik, responsif, mudah digunakan, dan memiliki performa baik. Tugasnya meliputi pengembangan antarmuka menggunakan HTML, CSS, atau JavaScript, memastikan tampilan berjalan di berbagai perangkat, berkolaborasi dengan Backend Developer, mengoptimalkan performa, serta memperbaiki bug. Keahlian yang dibutuhkan mencakup framework seperti React, Angular, atau Vue.js, responsive design, Git, komunikasi, kolaborasi, dan problem-solving.',
  },
  {
    title: 'Mobile Development',
    icon: <FiSmartphone className='text-primary text-xl' />,
    iconPosition: 'left',
    description:
      'Mobile Development adalah profesi berfokus membangun tampilan dan interaksi aplikasi mobile Android maupun iOS agar responsif, nyaman digunakan, dan sesuai kebutuhan pengguna. Perannya mirip Frontend, tetapi diterapkan pada perangkat mobile dengan memperhatikan UI/UX, performa, ukuran layar, navigasi, testing, dan integrasi API. Skill yang dibutuhkan meliputi Kotlin/Jetpack Compose untuk Android, Swift/SwiftUI atau UIKit untuk iOS, atau framework cross-platform seperti Flutter, serta Git, debugging, problem-solving, dan kolaborasi tim.',
  },
];

export const middleRightDivisions: DivisionData[] = [
  {
    title: 'Game Programming',
    icon: <BiGame className='text-primary text-xl' />,
    iconPosition: 'right',
    description:
      'Game Programmer bertugas membuat konsep dari Game Designer dan aset dari Game Artist menjadi sistem game yang bisa dimainkan. Fokusnya ada pada penulisan kode untuk gameplay, kontrol karakter, AI, physics, UI, audio, save system, networking, debugging, dan optimasi performa di game engine. Berbeda dari Game Designer yang merancang aturan, Game Programmer membuat aturan itu berjalan secara teknis. Skill yang dibutuhkan: C#, C++, Unity/Unreal Engine, algoritma, struktur data, matematika dasar, Git, debugging, problem-solving, dan kolaborasi tim.',
  },
  {
    title: 'Game Design',
    icon: <FaChessPawn className='text-primary text-xl' />,
    iconPosition: 'right',
    description:
      'Game Designer bertanggung jawab merancang konsep, aturan, mekanika, sistem, cerita, level, dan pengalaman bermain agar game terasa seru, menantang, dan terstruktur. Misalnya di Game Artist yang fokus pada visual, Game Designer sebagai perancang "otak" permainan, yaitu bagaimana game berjalan dan bagaimana pemain berinteraksi. Tugasnya meliputi membuat gameplay, level design, sistem poin, tantangan, narasi, prototype, serta melakukan iterasi berdasarkan hasil pengujian. Skill yang dibutuhkan meliputi kreativitas, logika, problem-solving, storytelling, game balancing, komunikasi, dan pemahaman user experience.',
  },
  {
    title: 'Game Artist',
    icon: <FiPenTool className='text-primary text-xl' />,
    iconPosition: 'right',
    description:
      'Game Artist bertanggung jawab membuat elemen visual agar game terlihat menarik dan imersif. Tugasnya meliputi merancang karakter, lingkungan, objek, tekstur, animasi, efek visual, pencahayaan, hingga aset 2D atau 3D sesuai konsep game. Dalam proses pengembangan, Game Artist bekerja sama dengan game designer agar visual sesuai gameplay serta batasan teknis game engine. Skill yang dibutuhkan meliputi menggambar, desain visual, storytelling visual, animasi 2D/3D, 3D modeling, texturing, lighting, kreativitas, komunikasi, dan menerima feedback.',
  },
];

export const bottomDivisions: DivisionData[] = [
  {
    title: 'UI/UX Design',
    icon: <FiFigma className='text-primary text-xl' />,
    iconPosition: 'left',
    description:
      'UI/UX berperan dalam pengembangan aplikasi menentukan tampilan sekaligus pengalaman pengguna. UI berfokus pada elemen visual seperti tombol, ikon, warna, tipografi, dan tata letak agar aplikasi mudah dipahami. UX berfokus pada kenyamanan, kemudahan navigasi, efisiensi, dan kepuasan pengguna saat menggunakan aplikasi. Desain UI/UX yang baik dapat meningkatkan kepuasan, retensi pengguna, mengurangi kesalahan, mempercepat penyelesaian tugas, serta memperkuat citra merek melalui aplikasi yang menarik dan mudah digunakan.',
  },
  {
    title: 'Audio Composer',
    icon: <FiMusic className='text-primary text-xl' />,
    iconPosition: 'right',
    description:
      'Audio Composer bertanggung jawab membuat musik untuk mendukung suasana, emosi, cerita, dan pengalaman bermain. Audio Composer lebih fokus pada scoring, theme song, battle music, ambient music, dan musik adaptif yang berubah mengikuti situasi gameplay. Skill yang dibutuhkan meliputi komposisi musik, teori musik, digital audio workstation, sound production, pemahaman mood game, storytelling audio, kolaborasi dengan game designer, serta kemampuan membuat musik yang cocok untuk platform PC, console, maupun mobile.',
  },
];
