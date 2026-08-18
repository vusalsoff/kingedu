export const revalidate = 0;

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { uploadToGoogleDrive, deleteFromGoogleDrive } from "@/lib/googleDrive";

function extractDriveId(url) {
  if (!url) return null;
  const match = url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

async function processBase64Images(data) {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string' && result[key].startsWith('data:image')) {
      const uploadResult = await uploadToGoogleDrive(result[key], `img_${Date.now()}.png`);
      if (uploadResult.success) {
        result[key] = uploadResult.url;
      } else {
        throw new Error("Şəkil Google Drive-a yüklənə bilmədi: " + uploadResult.error);
      }
    }
  }
  return result;
}

let appCache = {
  data: null,
  timestamp: 0
};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.action === 'get_maintenance_mode') {
      const { data } = await supabase.from('settings').select('value').eq('key', 'maintenance_mode').maybeSingle();
      return NextResponse.json({ maintenance_mode: data?.value || "false" });
    }

    if (body.action === 'get_all') {
      if (!body.bypass_cache && appCache.data && Date.now() - appCache.timestamp < CACHE_TTL) {
        return NextResponse.json(appCache.data);
      }
    } else {
      // Invalidate cache on mutations
      appCache.data = null;
      appCache.timestamp = 0;
    }

    if (body.action === 'upload_image' || body.action === 'upload_file') {
      try {
        const base64Str = body.base64 || body.base64Data;
        const fname = body.filename || body.fileName || 'upload.png';
        const uploadResult = await uploadToGoogleDrive(base64Str, fname);
        if (uploadResult.success) {
          return NextResponse.json({
            success: true,
            url: uploadResult.url,
            fileId: uploadResult.id,
            legacyUrl: uploadResult.url
          });
        } else {
          return NextResponse.json({ success: false, message: "Google Drive Upload Error: " + uploadResult.error }, { status: 500 });
        }
      } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json({ success: false, message: "Şəkil yükləmə xətası." }, { status: 500 });
      }
    }


    if (body.action === 'student_get_all') {
      const { data, error } = await supabase.from('telebeler').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, students: data });
    }

    if (body.action === 'student_add') {
      let favs = [];
      try { favs = JSON.parse(body.favorites || '[]'); } catch(e) {}
      const { data, error } = await supabase.from('telebeler').insert([{
        name: body.username,
        email: body.username, // using username as email fallback if needed, wait, auth uses email
        password: body.password,
        favorites: favs,
        created_at: body.createdAt || new Date().toISOString()
      }]).select();
      if (error) throw error;
      return NextResponse.json({ success: true, data: data[0] });
    }

    if (body.action === 'student_update_favorites') {
      let favs = [];
      try { favs = JSON.parse(body.favorites || '[]'); } catch(e) {}
      
      let targetTable = 'telebeler';
      if (body.isAdmin) targetTable = 'users';

      const query = supabase.from(targetTable).update({ favorites: favs });
      if (body.id) {
        query.eq('id', body.id);
      } else {
        query.eq('name', body.username); // Fallback
      }

      const { data, error } = await query.select();
      if (error) throw error;
      return NextResponse.json({ success: true, data: data && data[0] });
    }

    if (body.action === 'student_delete' && body.id) {
      const { data, error } = await supabase.from('telebeler').delete().eq('id', body.id);
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    if (body.action === 'set_user_tag') {
      const { data: existing } = await supabase.from('settings').select('*').eq('key', 'user_tags').maybeSingle();
      let userTags = {};
      if (existing && existing.value) {
        try { userTags = JSON.parse(existing.value); } catch(e) {}
      }
      
      if (body.tag) {
        userTags[body.id] = body.tag;
      } else {
        delete userTags[body.id];
      }
      
      if (existing) {
        await supabase.from('settings').update({ value: JSON.stringify(userTags) }).eq('key', 'user_tags');
      } else {
        await supabase.from('settings').insert([{ key: 'user_tags', value: JSON.stringify(userTags) }]);
      }
      
      // Clear cache so frontend gets latest user tags
      appCache.data = null;
      appCache.timestamp = 0;
      
      return NextResponse.json({ success: true, user_tags: userTags });
    }

    // Handle 'social' using 'settings' table
    if (body.sheetName === 'social') {
      const { data: existing } = await supabase.from('settings').select('value').eq('key', 'social_media_links').single();
      let links = [];
      try { links = JSON.parse(existing?.value || '[]'); } catch(e){}

      if (body.action === 'get_specific') {
        return NextResponse.json({ success: true, data: links });
      } else if (body.action === 'add') {
        const processedData = await processBase64Images(body.data);
        const newItem = { id: Date.now(), ...processedData };
        links.push(newItem);
        await supabase.from('settings').update({ value: JSON.stringify(links) }).eq('key', 'social_media_links');
        return NextResponse.json({ success: true, data: newItem });
      } else if (body.action === 'update' && body.id) {
        const processedData = await processBase64Images(body.data);
        links = links.map(l => String(l.id) === String(body.id) ? { ...l, ...processedData } : l);
        await supabase.from('settings').update({ value: JSON.stringify(links) }).eq('key', 'social_media_links');
        return NextResponse.json({ success: true, data: links.find(l => String(l.id) === String(body.id)) });
      } else if (body.action === 'delete' && body.id) {
        links = links.filter(l => String(l.id) !== String(body.id));
        await supabase.from('settings').update({ value: JSON.stringify(links) }).eq('key', 'social_media_links');
        return NextResponse.json({ success: true });
      } else if (body.action === 'delete_all') {
        links = [];
        await supabase.from('settings').update({ value: JSON.stringify(links) }).eq('key', 'social_media_links');
        return NextResponse.json({ success: true });
      }
    }

    if (body.sheetName === 'ai_knowledge') {
      const { data, error } = await supabase.from('settings').select('*').eq('key', 'ai_knowledge').maybeSingle();
      if (error) throw error;
      let knowledge = [];
      if (data && data.value) {
        try { knowledge = JSON.parse(data.value); } catch(e) {}
      }

      if (body.action === 'add') {
        const newItem = { id: Date.now(), ...body.data };
        knowledge.push(newItem);
        await supabase.from('settings').update({ value: JSON.stringify(knowledge) }).eq('key', 'ai_knowledge');
        return NextResponse.json({ success: true, data: newItem });
      } else if (body.action === 'update' && body.id) {
        knowledge = knowledge.map(k => String(k.id) === String(body.id) ? { ...k, ...body.data } : k);
        await supabase.from('settings').update({ value: JSON.stringify(knowledge) }).eq('key', 'ai_knowledge');
        return NextResponse.json({ success: true, data: knowledge.find(k => String(k.id) === String(body.id)) });
      } else if (body.action === 'delete' && body.id) {
        knowledge = knowledge.filter(k => String(k.id) !== String(body.id));
        await supabase.from('settings').update({ value: JSON.stringify(knowledge) }).eq('key', 'ai_knowledge');
        return NextResponse.json({ success: true });
      } else if (body.action === 'update_all' && body.data) {
        const {error} = await supabase.from('settings').update({ value: JSON.stringify(body.data) }).eq('key', 'ai_knowledge'); if(error) console.error('Update error:', error);
        return NextResponse.json({ success: true });
      } else if (body.action === 'delete_all') {
        knowledge = [];
        await supabase.from('settings').update({ value: JSON.stringify(knowledge) }).eq('key', 'ai_knowledge');
        return NextResponse.json({ success: true });
      }
    }

    // Handle Supabase actions
    if (body.action === 'add' && body.sheetName) {
      let dataToInsert = { ...body.data };
      delete dataToInsert.visible;
      const waNum = dataToInsert.whatsapp_number;
      delete dataToInsert.whatsapp_number;
      dataToInsert = await processBase64Images(dataToInsert);
      
      const { data, error } = await supabase.from(getTableName(body.sheetName)).insert([dataToInsert]).select();
      if (error) throw error;
      
      if (waNum) {
        await supabase.from('settings').insert([{ key: `wa_${getTableName(body.sheetName)}_${data[0].id}`, value: String(waNum) }]);
      }
      
      return NextResponse.json({ success: true, data: data[0] });
    }

    if (body.action === 'update' && body.sheetName && body.id) {
      const { data: existing } = await supabase.from(getTableName(body.sheetName)).select('image').eq('id', body.id).maybeSingle();
      let dataToUpdate = { ...body.data };
      delete dataToUpdate.visible;
      const waNum = dataToUpdate.whatsapp_number;
      delete dataToUpdate.whatsapp_number;
      dataToUpdate = await processBase64Images(dataToUpdate);
      
      const { data, error } = await supabase.from(getTableName(body.sheetName)).update(dataToUpdate).eq('id', body.id).select();
      if (error) throw error;
      
      if (waNum !== undefined) {
        const key = `wa_${getTableName(body.sheetName)}_${body.id}`;
        const { data: existWa } = await supabase.from('settings').select('*').eq('key', key).maybeSingle();
        if (existWa) {
          if (!waNum) await supabase.from('settings').delete().eq('key', key);
          else await supabase.from('settings').update({ value: String(waNum) }).eq('key', key);
        } else if (waNum) {
          await supabase.from('settings').insert([{ key, value: String(waNum) }]);
        }
      }

      if (existing?.image && existing.image !== dataToUpdate.image) {
        const oldId = extractDriveId(existing.image);
        if (oldId) deleteFromGoogleDrive(oldId).catch(console.error);
      }
      
      return NextResponse.json({ success: true, data: data[0] });
    }

    
    if (body.action === 'delete_all' && body.sheetName) {
      const { data: allItems } = await supabase.from(getTableName(body.sheetName)).select('image').neq('id', 0);
      const { error } = await supabase.from(getTableName(body.sheetName)).delete().neq('id', 0);
      if (error) throw error;
      
      if (allItems && allItems.length > 0) {
        allItems.forEach(item => {
          if (item.image) {
            const oldId = extractDriveId(item.image);
            if (oldId) deleteFromGoogleDrive(oldId).catch(console.error);
          }
        });
      }
      
      return NextResponse.json({ success: true });
    }

    if (body.action === 'delete' && body.sheetName && body.id) {
      const { data: existing } = await supabase.from(getTableName(body.sheetName)).select('image').eq('id', body.id).maybeSingle();
      const { error } = await supabase.from(getTableName(body.sheetName)).delete().eq('id', body.id);
      if (error) throw error;
      
      if (existing?.image) {
        const oldId = extractDriveId(existing.image);
        if (oldId) deleteFromGoogleDrive(oldId).catch(console.error);
      }
      
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'update_settings_batch' && body.settings) {
      // Loop through and update safely
      for (const [key, value] of Object.entries(body.settings)) {
        const { data: existing } = await supabase.from('settings').select('*').eq('key', key).maybeSingle();
        if (existing) {
          await supabase.from('settings').update({ value: String(value) }).eq('key', key);
        } else {
          await supabase.from('settings').insert([{ key: key, value: String(value) }]);
        }
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === 'update_setting' && body.key) {
      console.log('UPDATE SETTING CALLED:', body.key, body.value);
      // Settings are handled differently: update or insert
      const { data: existing } = await supabase.from('settings').select('*').eq('key', body.key).maybeSingle();
      let error;
      if (existing) {
        ({ error } = await supabase.from('settings').update({ value: String(body.value) }).eq('key', body.key));
      } else {
        ({ error } = await supabase.from('settings').insert([{ key: body.key, value: String(body.value) }]));
      }
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (body.action === 'get_specific' && body.sheetName) {
      if (body.sheetName === 'social') {
        const { data, error } = await supabase.from('settings').select('*').eq('key', 'social_media_links').maybeSingle();
        if (error) throw error;
        let links = [];
        if (data && data.value) {
          try { links = JSON.parse(data.value); } catch(e) {}
        }
        return NextResponse.json({ success: true, data: links });
      }

      if (body.sheetName === 'ai_knowledge') {
        const { data, error } = await supabase.from('settings').select('*').eq('key', 'ai_knowledge').maybeSingle();
        if (error) throw error;
        let knowledge = [];
        if (data && data.value) {
          try { knowledge = JSON.parse(data.value); } catch(e) {}
        }
        return NextResponse.json({ success: true, data: knowledge });
      }

      // Default table fallback
      const tableName = getTableName(body.sheetName);
      const { data, error } = await supabase.from(tableName).select('*').order('id', { ascending: true });
      if (error) throw error;
      
      // Attach whatsapp_number if present
      const { data: waData } = await supabase.from('settings').select('*').like('key', `wa_${tableName}_%`);
      if (waData && waData.length > 0) {
        const waMap = {};
        waData.forEach(item => {
          waMap[item.key] = item.value;
        });
        const finalData = data.map(item => ({
          ...item,
          whatsapp_number: waMap[`wa_${tableName}_${item.id}`] || ""
        }));
        return NextResponse.json({ success: true, data: finalData });
      }
      
      return NextResponse.json({ success: true, data });
    }

    // We can fallback to `get_all` just in case
    if (body.action === 'get_all') {
      const { getDbData } = require('@/lib/db');
      const dbData = await getDbData();
      const responseData = { success: true, data: dbData };
      appCache.data = responseData;
      appCache.timestamp = Date.now();
      return NextResponse.json(responseData);
    }

    if (body.action === 'get_stats') {
      const [
        { count: kursCount },
        { count: telimCount },
        { count: marafonCount },
        { count: kitabCount }
      ] = await Promise.all([
        supabase.from('kurslar').select('*', { count: 'exact', head: true }),
        supabase.from('telimler').select('*', { count: 'exact', head: true }),
        supabase.from('marafonlar').select('*', { count: 'exact', head: true }),
        supabase.from('kitablar').select('*', { count: 'exact', head: true })
      ]);
      return NextResponse.json({ 
        success: true, 
        stats: {
          kurslar: kursCount || 0,
          telimler: telimCount || 0,
          marafonlar: marafonCount || 0,
          kitablar: kitabCount || 0
        }
      });
    }

    return NextResponse.json({ success: false, message: "Bilinməyən əməliyyat" }, { status: 400 });

  } catch (error) {
    console.error("DB API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Server xətası baş verdi. " + error.message 
    }, { status: 500 });
  }
}

function getTableName(sheetName) {
  const map = {
    'kurslar': 'kurslar',
    'Courses': 'kurslar',
    'kitablarimiz': 'kitablar',
    'Books': 'kitablar',
    'marafonlar': 'marafonlar',
    'Marathons': 'marafonlar',
    'telimler': 'telimler',
    'Trainings': 'telimler',
    'xeberler': 'xeberler',
    'News': 'xeberler',
    'kampaniyalar': 'kampaniyalar',
    'Campaigns': 'kampaniyalar',
    'pdf_kitablar': 'pdf_kitablar',
    'pdfKitablar': 'pdf_kitablar',
    'PdfBooks': 'pdf_kitablar',
    'users': 'users'
  };
  return map[sheetName] || sheetName.toLowerCase();
}
