const dbUrl = "https://script.google.com/macros/s/AKfycbz0E3c4BGvcU4eUhc8DINcMohpoDZEJjxBgPOCb6MciYGLFfYTYvqP7_TkRgSRoS92pmg/exec";

async function sendRequest(action, data) {
  try {
    const payload = { action, ...data };
    console.log(`Sending ${action}...`);
    let res = await fetch(dbUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });
    const result = await res.json();
    console.log(`Result for ${action}:`, result.message || result.success);
  } catch (e) {
    console.error(`Error in ${action}:`, e.message);
  }
}

async function seedData() {
  // 1. Social Media Links
  const settings = [
    { key: "instagram", value: "https://www.instagram.com/king.edu.az" },
    { key: "whatsapp_contact", value: "https://api.whatsapp.com/send/?phone=994103790874&text&type=phone_number&app_absent=0" },
    { key: "tiktok", value: "https://www.tiktok.com/@king.edu.az" },
    { key: "youtube", value: "https://www.youtube.com/@KingEducationCompanyMMC" },
    { key: "linkedin", value: "https://www.linkedin.com/in/king-education-company-mmc-528162415?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
    { key: "facebook", value: "https://www.facebook.com/profile.php?id=61591124085845" },
    { key: "telegram", value: "https://t.me/+XokLJzABCDE3NWQy" },
    { key: "whatsapp_channel", value: "https://www.whatsapp.com/channel/0029Vb1uTDm3AzNK7TnfBa0z" }
  ];

  for (let s of settings) {
    await sendRequest("update_setting", { key: s.key, value: s.value });
  }

  // 2. Sample Course
  await sendRequest("add_item", {
    collection: "Kurslar",
    item: {
      id: "kurs_1",
      title: "Full-Stack Web Proqramlaşdırma",
      instructor: "Mirfəqan Hacıyev",
      duration: "6 Ay",
      price: "150 AZN",
      date: "01 Sentyabr",
      description: "Sıfırdan mükəmməl səviyyəyə qədər web proqramlaşdırma kursu.",
      longDescription: "Bu kursda HTML, CSS, JavaScript, React, Node.js və verilənlər bazalarını öyrənəcəksiniz.",
      curriculum: ["Giriş və HTML/CSS", "JavaScript Əsasları", "React.js Frontend", "Node.js Backend", "Layihə işi"],
      benefits: ["Rəsmi Sertifikat", "Beynəlxalq Sertifikat", "Təlim Videoları"],
      visible: true
    }
  });

  // 3. Sample Training
  await sendRequest("add_item", {
    collection: "Telimler",
    item: {
      id: "telim_1",
      title: "Rəqəmsal Marketinq Sirləri",
      instructor: "Aylin Məmmədova",
      duration: "2 Gün",
      price: "40 AZN",
      date: "15 Oktyabr",
      description: "Sosial mediada brendinizi necə inkişaf etdirməyi öyrənin.",
      longDescription: "SMM strategiyaları, reklamın qurulması və hədəf kütləsinin tapılması barədə tam praktiki təlim.",
      curriculum: ["Facebook və Instagram Reklamları", "Hədəf kütləsinin analizi", "Büdcənin optimallaşdırılması"],
      benefits: ["Rəsmi Sertifikat", "Tədris Materialları"],
      visible: true,
      featured: true
    }
  });

  // 4. Sample Book
  await sendRequest("add_item", {
    collection: "Kitablar",
    item: {
      id: "kitab_1",
      title: "Satışın Psixologiyası",
      instructor: "Brian Tracy (Tərcümə)",
      price: "15 AZN",
      description: "Dünyanın ən məşhur satış kitablarından biri.",
      longDescription: "İnsanları necə razı salmalı və satış rəqəmlərini necə artırmalı olduğunuzu bu kitabla öyrənin.",
      visible: true
    }
  });

  console.log("Seeding completed!");
}

seedData();
