import { supabase } from "@/lib/supabaseClient";

export async function uploadToStorage(base64String, filename = 'upload.png') {
  try {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create unique filename
    const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(7)}_${filename.replace(/[^a-zA-Z0-9.]/g, '')}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(uniqueFilename, buffer, {
        contentType: mimeType,
        upsert: false
      });
      
    if (error) throw error;
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(uniqueFilename);
    
    return {
      success: true,
      url: publicUrlData.publicUrl,
      id: uniqueFilename
    };
  } catch (error) {
    console.error("Supabase Storage Upload Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteFromStorage(filename) {
  try {
    if (!filename) return { success: true };
    
    // Extract path from public URL
    let path = filename;
    if (filename.includes('/storage/v1/object/public/images/')) {
       path = filename.split('/storage/v1/object/public/images/')[1];
    }
    
    if (path) {
       const { error } = await supabase.storage.from('images').remove([path]);
       if (error) throw error;
    }
    return { success: true };
  } catch (error) {
    console.error("Supabase Storage Delete Error:", error);
    return { success: false, error: error.message };
  }
}
