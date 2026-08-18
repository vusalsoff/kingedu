const fs = require('fs');
const envLines = fs.readFileSync('.env.local', 'utf8').split('\n');
const env = {};
envLines.forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) env[key.trim()] = rest.join('=').trim();
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const dummyKurslar = [
    { title: 'Ümumi İngilis Dili', description: 'Sıfırdan mükəmməl səviyyəyə qədər İngilis dili kursu.', price: '120 AZN / ay', duration: '6 Ay', image: 'https://images.unsplash.com/photo-1546410531-df4cb71576ac?q=80&w=1000' },
    { title: 'Full-Stack Veb Proqramlaşdırma', description: 'Müasir texnologiyalarla veb inkişafı öyrənin (React, Node.js).', price: '250 AZN / ay', duration: '8 Ay', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000' },
    { title: 'Rəqəmsal Marketinq (SMM)', description: 'Biznesinizi onlayn dünyada böyütməyin yolları.', price: '150 AZN / ay', duration: '4 Ay', image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1000' }
];

const dummyTelimler = [
    { title: 'Süni İntellekt (AI) Biznes Tətbiqləri', description: 'Süni intellekt alətlərindən istifadə edərək vaxta qənaət edin.', date: '15 Oktyabr, 2026', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000' },
    { title: 'Liderlik və Komanda İdarəetməsi', description: 'Gələcəyin liderləri üçün xüsusi inkişaf təlimi.', date: '22 Noyabr, 2026', image: 'https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1000' },
    { title: 'Effektiv Satış Strategiyaları', description: 'Müştəri psixologiyası və satış həcmini artırma yolları.', date: '05 Dekabr, 2026', image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1000' }
];

const dummyMarafonlar = [
    { title: '30 Günlük İngilis Dili Marafonu', description: 'Hər gün praktika edərək dil bacarıqlarınızı inkişaf etdirin.', duration: '1 Ay', date: '01 Sentyabr', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000' },
    { title: 'Oxu və Anlama Marafonu', description: 'Sürətli oxuma və kitablardan daha çox məlumat əldə etmə.', duration: '1 Ay', date: '15 Oktyabr', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000' },
    { title: 'Karyera Planlama Marafonu', description: 'CV hazırlama, müsahibə texnikaları və şəbəkələşmə.', duration: '10 Gün', date: '01 Noyabr', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000' }
];

const dummyKitablar = [
    { title: 'Düşün və Zənginləş (Napoleon Hill)', description: 'Şəxsi inkişaf və maliyyə savadlılığı üzrə ən çox satılan kitab.', price: '12.00', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000' },
    { title: 'Atom Vərdişlər (James Clear)', description: 'Kiçik dəyişikliklərlə böyük nəticələr əldə etməyin yolları.', price: '15.00', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1000' },
    { title: 'Sıfırdan Birə (Peter Thiel)', description: 'Startuplar və gələcəyi necə qurmaq haqqında.', price: '18.00', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000' }
];

async function insertData() {
    console.log("Inserting Kurslar...");
    await supabase.from('kurslar').delete().neq('id', 0); // clear existing
    const { error: e1 } = await supabase.from('kurslar').insert(dummyKurslar);
    if (e1) console.error("Error inserting kurslar:", e1);
    
    console.log("Inserting Telimler...");
    await supabase.from('telimler').delete().neq('id', 0); // clear existing
    const { error: e2 } = await supabase.from('telimler').insert(dummyTelimler);
    if (e2) console.error("Error inserting telimler:", e2);
    
    console.log("Inserting Marafonlar...");
    await supabase.from('marafonlar').delete().neq('id', 0); // clear existing
    const { error: e3 } = await supabase.from('marafonlar').insert(dummyMarafonlar);
    if (e3) console.error("Error inserting marafonlar:", e3);
    
    console.log("Inserting Kitablar...");
    await supabase.from('kitablar').delete().neq('id', 0); // clear existing
    const { error: e4 } = await supabase.from('kitablar').insert(dummyKitablar);
    if (e4) console.error("Error inserting kitablar:", e4);
    
    console.log("Done!");
}
insertData();
