const defaultBanners = [
  {
    id: 1,
    show: true,
    title: "Süni İntellektlə Biznesin idarəedilməsi Təlimi",
    description: "Yalnız bu həftə qeydiyyatdan keçənlərə xüsusi 20% ENDİRİM!",
    linkText: "İndi Endirimlə Qoşul",
    image: "/img/bg2.jpeg", // In their screenshot they have this custom banner probably
    link: "/telimler",
    pills: ["🤖 AI & ChatGPT", "⚙️ Biznes Avtomatlaşdırma", "🎓 Sertifikatlı Təhsil"],
    top_card: { title: "100% Praktiki", sub: "Real layihələr" },
    bottom_card: { title: "+5x Məhsuldarlıq", sub: "Biznesdə sıçrayış" }
  }
];

const aboutFeatures = [
  { id: 1, icon: "Award", title: "Keyfiyyətli Təhsil", desc: "Mütəxəssislər tərəfindən hazırlanmış proqramlar." },
  { id: 2, icon: "Users", title: "Praktiki Yanaşma", desc: "Real layihələr üzərində işləmək imkanı." },
  { id: 3, icon: "Briefcase", title: "Karyera Dəstəyi", desc: "Məzunlara iş tapmaqda köməklik." },
  { id: 4, icon: "Globe", title: "Qlobal Standartlar", desc: "Beynəlxalq tələblərə cavab verən tədris." }
];

const premiumPackages = [
  { id: 1, title: "1 Aylıq Paket", price: "17.99", popular: false, features: ["Bütün dərslərə giriş", "Aylıq sınaqlar", "Telegram dəstək qrupu"] },
  { id: 3, title: "3 Aylıq Paket", price: "27.99", popular: true, features: ["Bütün dərslərə giriş", "Limitsiz sınaqlar", "VIP Telegram qrupu", "Həftəlik canlı sual-cavab"] },
  { id: 6, title: "6 Aylıq Paket", price: "59.99", popular: false, features: ["Bütün dərslərə giriş", "Limitsiz sınaqlar", "VIP Telegram qrupu", "Fərdi mentorluq sessiyası (1 dəfə)"] },
  { id: 12, title: "1 İllik Paket", price: "111.99", popular: false, features: ["Bütün dərslərə giriş", "Limitsiz sınaqlar", "VIP Telegram qrupu", "Fərdi mentorluq (Hər ay)", "Pulsuz təlim və marafonlar"] }
];

const data = {
  action: 'update_settings_batch',
  settings: {
    custom_banners_data: JSON.stringify(defaultBanners),
    about_features_data: JSON.stringify(aboutFeatures),
    premium_packages_data: JSON.stringify(premiumPackages)
  }
};

fetch('http://localhost:3000/api/admin/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(r => r.json())
.then(d => console.log('Settings updated:', d))
.catch(console.error);

// Clear registrations
const deleteData = {
  action: 'delete_all_registrations',
  sheetName: 'telebeler' // we'll truncate this table via api or direct supabase
};
fetch('http://localhost:3000/api/admin/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'custom_sql', query: 'delete from telebeler;' })
}).catch(console.error);
