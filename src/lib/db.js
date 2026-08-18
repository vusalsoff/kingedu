import { supabase } from './supabaseClient';

export async function getDbData() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("[DB] Supabase credentials not set in environment variables.");
      return getEmptyData();
    }
    
    const [
      { data: settingsData },
      { data: kurslar },
      { data: kitablar },
      { data: marafonlar },
      { data: telimler },
      { data: xeberler },
      { data: kampaniyalar },
      { data: pdfKitablar },
      { data: telebeler }
    ] = await Promise.all([
      supabase.from('settings').select('*'),
      supabase.from('kurslar').select('*').order('id', { ascending: true }),
      supabase.from('kitablar').select('*').order('id', { ascending: true }),
      supabase.from('marafonlar').select('*').order('id', { ascending: true }),
      supabase.from('telimler').select('*').order('id', { ascending: true }),
      supabase.from('xeberler').select('*').order('id', { ascending: true }),
      supabase.from('kampaniyalar').select('*').order('id', { ascending: true }),
      supabase.from('pdf_kitablar').select('*').order('id', { ascending: true }),
      supabase.from('telebeler').select('*').order('created_at', { ascending: false })
    ]);

    const s = {};
    if (settingsData) {
      settingsData.forEach(row => {
        s[row.key] = row.value;
      });
    }

    const cleanMap = {};
    for (let key in s) {
      if (Object.prototype.hasOwnProperty.call(s, key)) {
        const cleanKey = String(key).trim().toLowerCase();
        cleanMap[cleanKey] = s[key];
      }
    }

    const getVal = (...keys) => {
      for (let k of keys) {
        if (s[k] !== undefined && s[k] !== "") return s[k];
        const cleanK = String(k).trim().toLowerCase();
        if (cleanMap[cleanK] !== undefined && cleanMap[cleanK] !== "") return cleanMap[cleanK];
      }
      return "";
    };

    const getShow = (...keys) => {
      for (let k of keys) {
        if (s[k] !== undefined) return String(s[k]) !== "false" && s[k] !== false;
        const cleanK = String(k).trim().toLowerCase();
        if (cleanMap[cleanK] !== undefined) return String(cleanMap[cleanK]) !== "false" && cleanMap[cleanK] !== false;
      }
      return true;
    };

    const normalizedSettings = {
      ...s,
      phone: getVal("phone", "Telefon", "Telefon Nömrəsi") || "+994 10 379 08 74",
      email: getVal("email", "E-poçt", "Email") || "info@kingeducation.az",
      instagram: getVal("instagram", "Instagram", "İnstagram", "instagramLink", "İnstagram Linki", "instagram linki") || "https://www.instagram.com/king.edu.az",
      instagram_show: getShow("instagram_show", "Instagram_show", "İnstagram göstər"),
      facebook: getVal("facebook", "Facebook", "facebookLink", "Facebook Linki", "facebook linki") || "https://www.facebook.com/profile.php?id=61591124085845",
      facebook_show: getShow("facebook_show", "Facebook_show", "Facebook göstər"),
      tiktok: getVal("tiktok", "TikTok", "Tiktok", "tiktokLink", "TikTok Linki", "Tiktok Linki", "tiktok linki") || "https://www.tiktok.com/@king.edu.az",
      tiktok_show: getShow("tiktok_show", "TikTok_show", "Tiktok_show", "TikTok göstər"),
      telegram: getVal("telegram", "Telegram", "telegramLink", "Telegram Linki", "telegram linki") || "https://t.me/+XokLJzABCDE3NWQy",
      telegram_show: getShow("telegram_show", "Telegram_show", "Telegram göstər"),
      volunteerLink: getVal("volunteerLink", "konulluluk", "Konulluluk", "Könüllülük", "volunteer_link", "konullulukLink", "Könüllülük Linki", "Konulluluk Linki", "Könüllülük linki", "konulluluk linki") || "https://docs.google.com/forms/d/e/1FAIpQLSdDQuU3BxPv3C1t_ELe3va9Xr2-li11ZgFrzoBAWXVhLmHYvw/viewform?usp=header",
      volunteerLink_show: getShow("volunteerLink_show", "konulluluk_show", "Könüllülük göstər"),
      whatsapp_contact: getVal("whatsapp_contact") || "https://api.whatsapp.com/send/?phone=994103790874&text&type=phone_number&app_absent=0",
      whatsapp_contact_show: getShow("whatsapp_contact_show"),
      youtube: getVal("youtube") || "https://www.youtube.com/@KingEducationCompanyMMC",
      youtube_show: getShow("youtube_show"),
      linkedin: getVal("linkedin") || "https://www.linkedin.com/in/king-education-company-mmc-528162415",
      linkedin_show: getShow("linkedin_show"),
      whatsapp_channel: getVal("whatsapp_channel") || "https://www.whatsapp.com/channel/0029Vb1uTDm3AzNK7TnfBa0z",
      whatsapp_channel_show: getShow("whatsapp_channel_show"),
      custom_socials: getVal("custom_socials") || "[]",
      leaderImage: getVal("leaderImage") || "/img/rehber.jpeg",
      leaderImageVisible: getShow("leaderImageVisible"),
      premium_whatsapp: getVal("premium_whatsapp") || "010 379 08 74",
      premium_price_1: getVal("premium_price_1") || "17.99",
      premium_price_3: getVal("premium_price_3") || "27.99",
      premium_price_6: getVal("premium_price_6") || "59.99",
      premium_price_12: getVal("premium_price_12") || "111.99",
      user_tags: getVal("user_tags") || "{}",
      maintenance_mode: getVal("maintenance_mode") || "false",
      wa_courses: getVal("wa_courses") || "",
      wa_trainings: getVal("wa_trainings") || "",
      wa_marathons: getVal("wa_marathons") || "",
      seo_title: getVal("seo_title") || "King Education Company",
      seo_description: getVal("seo_description") || "King Education Company - Rəsmi Veb Sayt - Kurslar, Təlimlər, Marafonlar və daha çoxu.",
      seo_keywords: getVal("seo_keywords") || "King Education Company, Kurslar, Təlimlər, Marafonlar, Kitablar, Mirfəqan Hacıyev",
      google_site_verification: getVal("google_site_verification") || ""
    };

    let social = [];
    try { social = JSON.parse(s.social_media_links || "[]"); } catch(e){}

    let ai_knowledge = [];
    try { ai_knowledge = JSON.parse(s.ai_knowledge || "[]"); } catch(e){}

    const getWa = (table, id) => {
      const waKey = `wa_${table}_${id}`;
      return s[waKey] || cleanMap[waKey.toLowerCase()] || "";
    };

    const mapWa = (list, table) => list ? list.map(item => ({ ...item, whatsapp_number: getWa(table, item.id) })) : [];
    
    const processedKurslar = mapWa(kurslar, 'kurslar');
    const processedTelimler = mapWa(telimler, 'telimler');
    const processedMarafonlar = mapWa(marafonlar, 'marafonlar');
    const processedKitablar = mapWa(kitablar, 'kitablar');

    return {
      settings: normalizedSettings,
      kurslar: processedKurslar,
      courses: processedKurslar,
      kitablar: processedKitablar,
      kitablarimiz: processedKitablar,
      marafonlar: processedMarafonlar,
      telimler: processedTelimler,
      xeberler: xeberler || [],
      kampaniyalar: kampaniyalar || [],
      pdfKitablar: pdfKitablar || [],
      Courses: processedKurslar,
      Books: processedKitablar,
      Marathons: processedMarafonlar,
      Trainings: processedTelimler,
      News: xeberler || [],
      Campaigns: kampaniyalar || [],
      PdfBooks: pdfKitablar || [],
      registrations: telebeler || [],
      users: telebeler || [],
      contacts: [],
      social: social,
      ai_knowledge: ai_knowledge
    };
  } catch (err) {
    console.error("[DB] Supabase fetch error:", err.message || err);
    return getEmptyData();
  }
}

function getEmptyData() {
  return { 
    settings: {}, 
    kurslar: [], courses: [], Courses: [],
    kitablarimiz: [], books: [], Books: [], kitablar: [],
    marafonlar: [], marathons: [], Marathons: [],
    telimler: [], trainings: [], Trainings: [],
    xeberler: [], news: [], News: [],
    kampaniyalar: [], campaigns: [], Campaigns: [],
    pdfKitablar: [], pdfBooks: [], PdfBooks: [],
    registrations: [], contacts: [],
    social: [], ai_knowledge: []
  };
}
