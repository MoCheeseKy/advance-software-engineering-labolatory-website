import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function saveFileToLocal(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `blog-${uniqueSuffix}.webp`; 

    const uploadDir = path.join(process.cwd(), 'public/uploads/blogs');
    
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    return `/uploads/blogs/${filename}`;
}

export async function saveProductFileToLocal(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `product-${uniqueSuffix}.webp`; 
    
    const uploadDir = path.join(process.cwd(), 'public/uploads/products');
    
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return `/uploads/products/${filename}`;
}