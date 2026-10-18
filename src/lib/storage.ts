import { supabase, isSupabaseConfigured } from './supabase';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export interface UploadResult {
  url: string;
  error?: string;
}

/**
 * Validates and uploads an activity evidence image.
 * Uses Supabase Storage 'activity-evidence' bucket if available,
 * otherwise converts to a persistent Data URL for preview and testing.
 */
export async function uploadEvidenceImage(
  file: File,
  userId: string
): Promise<UploadResult> {
  // 1. Validate file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      url: '',
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 5MB.`,
    };
  }

  // 2. Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      url: '',
      error: 'Invalid file format. Please upload a JPEG, PNG, or WebP image.',
    };
  }

  // 3. If Supabase is configured and user is authenticated, attempt Supabase Storage upload
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('activity-evidence')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('activity-evidence')
          .getPublicUrl(data.path);

        return { url: publicUrlData.publicUrl };
      } else if (error) {
        console.warn('Supabase storage upload failed, falling back to local data URL:', error.message);
      }
    } catch (err) {
      console.warn('Storage exception, using fallback:', err);
    }
  }

  // Fallback: convert to base64 Data URL so the image is fully viewable in UI
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: '', error: 'Failed to read image file.' });
    };
    reader.readAsDataURL(file);
  });
}
