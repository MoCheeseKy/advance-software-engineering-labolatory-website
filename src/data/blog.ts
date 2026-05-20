export interface BlogPost {
  id: number;
  image: string;
  imageCaption?: string;
  date: string;
  category: string;
  author: string;
  title: string;
  excerpt: string;
  content: string;
}

export const DUMMY_BLOGS: BlogPost[] = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Foto Gedung Telkom University 2026, yang difoto pada Jumat, 23 Mei 2025',
    date: '15 Mei 2026',
    author: 'Admin',
    category: 'NEWS',
    title: 'Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit',
    excerpt:
      'LOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTO LOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTOLOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTO',
    content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Foto Gedung Telkom University 2026, yang difoto pada Jumat, 23 Mei 2025',
    date: '31 Desember 2025',
    author: 'Admin',
    category: 'NEWS',
    title: 'LOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTO',
    excerpt:
      'LOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTO LOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTOLOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTO',
    content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Foto Gedung Telkom University 2026, yang difoto pada Jumat, 23 Mei 2025',
    date: '31 Desember 2025',
    author: 'Admin',
    category: 'NEWS',
    title: 'LOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTO',
    excerpt:
      'LOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTO LOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTOLOREM IPSUM DOLOR SIT AMET AMENTO MAMANTO MOMENTO',
    content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
  },
];
