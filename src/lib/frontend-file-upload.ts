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