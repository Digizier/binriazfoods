import { supabase } from './supabase';

/**
 * Compresses an image in browser memory and converts it to WebP format.
 * Target size is usually 30KB - 80KB max, preventing heavy egress and storage consumption.
 */
export async function compressImageToWebP(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If not in browser, return file as blob
    if (typeof window === 'undefined' || !window.document) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Uploads a file directly to Supabase Storage in WebP format
 * and returns the clean public CDN URL.
 */
export async function uploadMediaToStorage(
  file: File,
  folder: string = 'products'
): Promise<string> {
  try {
    // 1. Compress & convert to WebP
    const compressedBlob = await compressImageToWebP(file, 1200, 0.82);

    // 2. Generate a clean, unique file path
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const cleanFileName = `${folder}/${timestamp}_${randomSuffix}.webp`;

    // 3. Direct upload to 'product-media' bucket
    const { data, error } = await supabase.storage
      .from('product-media')
      .upload(cleanFileName, compressedBlob, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // 4. Retrieve clean public URL
    const { data: urlData } = supabase.storage
      .from('product-media')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (err: any) {
    console.error('Media upload exception:', err);
    throw err;
  }
}
