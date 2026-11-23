import imageCompression from 'browser-image-compression';
import { supabase, isSupabaseConfigured } from './client';

export interface UploadOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  bucket?: string;
  folder?: string;
}

export interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  storagePath: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function validateImageFile(file: File): Promise<string | null> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return 'Format file tidak didukung. Harap unggah file gambar JPG, PNG, atau WEBP.';
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return 'Ukuran file melebihi batas 10 MB. Silakan pilih gambar yang lebih kecil.';
  }
  return null;
}

export async function compressAndUploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  // Validate
  const error = await validateImageFile(file);
  if (error) {
    throw new Error(error);
  }

  const isLocalOffline = !isSupabaseConfigured || !supabase;
  const {
    maxSizeMB = isLocalOffline ? 0.35 : 1.8,
    maxWidthOrHeight = isLocalOffline ? 1280 : 2400,
    bucket = 'portfolio-media',
    folder = 'uploads',
  } = options;

  // 1. Client-side compression
  let compressedFile = file;
  try {
    compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker: true,
      fileType: file.type === 'image/png' ? 'image/png' : 'image/webp',
    });
  } catch (err) {
    console.warn('Kompresi gambar gagal, menggunakan file asli:', err);
    compressedFile = file;
  }

  // Generate unique file path
  const ext = compressedFile.name.split('.').pop() || 'png';
  const cleanBaseName = file.name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .slice(0, 32);
  const timestamp = Date.now();
  const filePath = `${folder}/${cleanBaseName}_${timestamp}.${ext}`;

  // If Supabase is connected
  if (isSupabaseConfigured && supabase) {
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Gagal mengunggah ke Supabase Storage: ${uploadError.message}`);
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    // Save to media_library table
    try {
      await supabase.from('media_library').insert({
        name: file.name,
        url: publicData.publicUrl,
        storage_path: data.path,
        size_bytes: compressedFile.size,
        mime_type: compressedFile.type,
      });
    } catch (insertErr) {
      console.warn('Gagal mencatat media library:', insertErr);
    }

    return {
      url: publicData.publicUrl,
      storagePath: data.path,
      fileName: file.name,
      sizeBytes: compressedFile.size,
      mimeType: compressedFile.type,
    };
  }

  // Fallback for offline/local development: read as Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        storagePath: `local/${filePath}`,
        fileName: file.name,
        sizeBytes: compressedFile.size,
        mimeType: compressedFile.type,
      });
    };
    reader.onerror = () => reject(new Error('Gagal membaca data gambar'));
    reader.readAsDataURL(compressedFile);
  });
}
