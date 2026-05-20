export interface Developer {
  name: string;
  role: string;
  avatar: string;
}

export interface Product {
  id: number;
  title: string;
  group: string;
  image: string;
  description: string;
  contentHtml: string;
  tags: string[];
  repository: string;
  developers: Developer[];
}

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Donasiku',
    group: 'DevHope Group',
    image: '/Images/examples/product-image-example.svg',
    description: 'Platform donasi online yang memudahkan pengguna untuk berbagi kepada sesama.',
    contentHtml: `
      <p class="italic font-semibold mb-4 text-neutral-800">Aplikasi Donasiku</p>
      <p class="mb-4">Selamat datang di era baru filantropi. Donasiku, persembahan dari DevHope Group di Advanced Software Engineering Laboratory, adalah platform donasi digital revolusioner yang dirancang untuk menghubungkan donatur dengan penerima manfaat secara mudah, transparan, dan berdampak.</p>
      <p class="mb-6">Kami percaya bahwa setiap tindakan kebaikan, sekecil apapun, memiliki kekuatan untuk mengubah hidup. Donasiku hadir untuk menyederhanakan proses donasi barang, menjadikannya semudah berbelanja online.</p>
      
      <h3 class="font-bold text-neutral-900 mb-2">Mengapa Donasiku?</h3>
      <p class="mb-6">Di dunia yang serba cepat ini, banyak orang ingin berkontribusi namun terhalang oleh proses donasi fisik yang rumit atau kekhawatiran akan transparansi. Donasiku mengatasi hambatan ini dengan menyediakan solusi ujung-ke-ujung yang mulus, aman, dan dapat dilacak.</p>
      
      <h3 class="font-bold text-neutral-900 mb-2">Fitur Utama yang Memberdayakan Anda:</h3>
      <ul class="list-disc pl-5 mb-6 space-y-1">
        <li><strong>Pilih Kategori Donasi Anda:</strong> Jelajahi berbagai kategori donasi berdasarkan kebutuhan, mulai dari pakaian layak pakai, buku, hingga barang elektronik. Pilih kategori yang paling sesuai dengan barang yang ingin Anda donasikan.</li>
        <li><strong>Profil Donatur yang Komprehensif:</strong> Lacak setiap kontribusi Anda dan lihat riwayat donasi lengkap Anda secara real-time. Profil Anda adalah bukti nyata dampak positif yang telah Anda berikan kepada komunitas.</li>
        <li><strong>Antarmuka Pengguna yang Intuitif:</strong> Desain bersih dan ramah pengguna memastikan siapa pun dapat dengan mudah menavigasi aplikasi, dari pendaftaran hingga penyelesaian donasi.</li>
      </ul>
      
      <h3 class="font-bold text-neutral-900 mb-2">Dampak Sosial yang Nyata:</h3>
      <p class="mb-4">Donasiku tidak hanya memudahkan donasi; itu memberdayakan komunitas. Dengan setiap donasi barang layak pakai, Anda tidak hanya membantu mereka yang membutuhkan, tetapi juga berkontribusi pada keberlanjutan lingkungan dengan mengurangi limbah.</p>
      <p class="mb-4">Mari Mulai Berbagi!</p>
      <p>Siap untuk menjadi agen perubahan? Unduh Donasiku sekarang dan rasakan kegembiraan berbagi yang sesungguhnya. Mari bangun masa depan yang lebih baik, satu donasi pada satu waktu.</p>
    `,
    tags: ['Mobile App', 'Flutter', 'Node Js'],
    repository: 'https://Github.com/ASELabIntern/Donasiku-Super-App.git',
    developers: [
      { name: 'Edsel Septa Haryanto', role: 'Mobile Programmer', avatar: '/Images/labolatory-assistance/edsel.svg' },
      { name: 'Zunadea Kusmiandita K.', role: 'UI/UX', avatar: '/Images/labolatory-assistance/nadya.svg' },
      { name: 'Meyra Firdaus Insani', role: 'System Analyst', avatar: '/Images/labolatory-assistance/deswiita.svg' },
      { name: 'Ida Bagus Adi Raditya P.', role: 'Backend Programmer', avatar: '/Images/labolatory-assistance/alvin.svg' },
      { name: 'Nabiel Muhamad Irfani', role: 'Quality Assurance', avatar: '/Images/labolatory-assistance/gavin.svg' },
    ]
  },
  {
    id: 2,
    title: 'EduTech App',
    group: 'EduTech Group',
    image: '/Images/examples/product-image-example.svg',
    description: 'Aplikasi pembelajaran interaktif untuk siswa sekolah dasar hingga menengah.',
    contentHtml: '<p>Detail lengkap mengenai EduTech App akan segera hadir.</p>',
    tags: ['Web App', 'React', 'Express'],
    repository: 'https://Github.com/ASELabIntern/EduTech-App.git',
    developers: [
      { name: 'Hafizh', role: 'Fullstack Developer', avatar: '/Images/labolatory-assistance/hafizh.svg' },
    ]
  },
  {
    id: 3,
    title: 'Smart City Dashboard',
    group: 'Smart City Group',
    image: '/Images/examples/product-image-example.svg',
    description: 'Dashboard pemantauan terintegrasi untuk manajemen fasilitas kota pintar.',
    contentHtml: '<p>Detail lengkap mengenai Smart City Dashboard akan segera hadir.</p>',
    tags: ['Dashboard', 'Next.js', 'PostgreSQL'],
    repository: 'https://Github.com/ASELabIntern/Smart-City.git',
    developers: [
      { name: 'Rifky', role: 'Frontend Developer', avatar: '/Images/labolatory-assistance/rifky.svg' },
    ]
  }
];
