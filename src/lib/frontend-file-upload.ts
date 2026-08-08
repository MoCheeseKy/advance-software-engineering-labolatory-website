import imageCompression from 'browser-image-compression';

interface UploadBlogParams {
    file: File;
    title: string;
    url: string;
    authors?: string[];
    texts?: string[];
}

interface UpdateBlogParams {
    blogId: string;
    file?: File | null;
    title: string;
    url: string;
    authors?: string[];
    texts?: string[];
    keepOldImage: boolean;
}

interface UploadProductParams {
    files: File[];
    name: string;
    developers?: string[];
    texts?: string[];
}

interface UpdateProductParams {
    productId: string;
    files?: File[];
    name: string;
    developers?: string[];
    texts?: string[];
    existingImages?: string[]; 
}

export async function UploadBlog({ file, title, url, authors = [], texts = [] }: UploadBlogParams) {
    const options = {
        maxSizeMB: 0.5,          
        maxWidthOrHeight: 1200,   
        useWebWorker: true,
        fileType: 'image/webp',   
        initialQuality: 0.8
    };

    try {
        const compressedImage = await imageCompression(file, options);
        
        const filename = file.name.split('.')[0];
        const webpFile = new File([compressedImage], `${filename}-compressed.webp`, { type: 'image/webp' });

        const formData = new FormData();
        
        formData.append('images', webpFile); 
        formData.append('title', title);
        formData.append('url', url);
        
        formData.append('authors', JSON.stringify(authors));
        formData.append('texts', JSON.stringify(texts));

        const response = await fetch('/api/admin/blog', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Gagal mengunggah blog");
        }

        return result;

    } catch (error) {
        console.error("Terjadi kesalahan saat proses kompresi/upload:", error);
        throw error; 
    }
}

export async function UpdateBlog({ blogId, file, title, url, authors = [], texts = [], keepOldImage }: UpdateBlogParams) {
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('url', url);
        formData.append('authors', JSON.stringify(authors));
        formData.append('texts', JSON.stringify(texts));
        formData.append('keepOldImage', String(keepOldImage)); 

        if (file) {
            const options = {
                maxSizeMB: 0.5,          
                maxWidthOrHeight: 1200,   
                useWebWorker: true,
                fileType: 'image/webp',   
                initialQuality: 0.8
            };

            const compressedImage = await imageCompression(file, options);
            const filename = file.name.split('.')[0];
            const webpFile = new File([compressedImage], `${filename}-compressed.webp`, { type: 'image/webp' });
            
            formData.append('images', webpFile); 
        }

        const response = await fetch(`/api/admin/blog/${blogId}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Gagal mengupdate blog");
        }

        return result;

    } catch (error) {
        console.error("Terjadi kesalahan saat update blog:", error);
        throw error; 
    }
}

// Upload Product
export async function UploadProduct({ files, name, developers = [], texts = [] }: UploadProductParams) {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('developers', JSON.stringify(developers));
    formData.append('texts', JSON.stringify(texts));

    const options = {
        maxSizeMB: 0.5,          
        maxWidthOrHeight: 1200,   
        useWebWorker: true,
        fileType: 'image/webp',   
        initialQuality: 0.8
    };

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const compressedImage = await imageCompression(file, options);
            const filename = file.name.split('.')[0] || `product-image-${i}`;
            const webpFile = new File([compressedImage], `${filename}-compressed.webp`, { type: 'image/webp' });

            formData.append('images', webpFile);
        }

        const response = await fetch('/api/admin/product', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Gagal mengunggah project");
        }

        return result;

    } catch (error) {
        console.error("Terjadi kesalahan saat proses kompresi/upload project:", error);
        throw error; 
    }
}

// Update Product
export async function UpdateProduct({ productId, files = [], existingImages = [], name, developers = [], texts = [] }: UpdateProductParams) {
    const formData = new FormData();

    formData.append('name', name);
    formData.append('developers', JSON.stringify(developers));
    formData.append('texts', JSON.stringify(texts));
    formData.append('existingImages', JSON.stringify(existingImages));

    const options = {
        maxSizeMB: 0.5,          
        maxWidthOrHeight: 1200,   
        useWebWorker: true,
        fileType: 'image/webp',   
        initialQuality: 0.8
    };

    try {
        // Kompres dan tambahkan gambar-gambar baru (jika ada)
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const compressedImage = await imageCompression(file, options);
            const filename = file.name.split('.')[0] || `product-new-image-${i}`;
            const webpFile = new File([compressedImage], `${filename}-compressed.webp`, { type: 'image/webp' });

            formData.append('images', webpFile);
        }

        const response = await fetch(`/api/admin/product/${productId}`, {
            method: 'PUT',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Gagal mengupdate project");
        }

        return result;

    } catch (error) {
        console.error("Terjadi kesalahan saat proses kompresi/update project:", error);
        throw error; 
    }
}