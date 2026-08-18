import { NextResponse } from "next/server";
import { allDataMap } from "@/data/mockData";

export async function GET(request) {
  try {
    const sheetUrl = process.env.DB_SHEET_URL;

    if (!sheetUrl) {
      return NextResponse.json({ success: false, message: "DB_SHEET_URL tapılmadı." }, { status: 500 });
    }

    const collections = {
      "kurslar": "Courses",
      "telimler": "Trainings",
      "marafonlar": "Marathons",
      "kitablarimiz": "Books"
    };

    let count = 0;

    for (const [key, collectionName] of Object.entries(collections)) {
      const items = allDataMap[key];
      if (items) {
        for (const item of items) {
          // Send each item to Google Sheets via POST
          await fetch(sheetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: "add_item",
              collection: collectionName,
              item: {
                title: item.title || "",
                instructor: item.instructor || "",
                duration: item.duration || "",
                price: item.price || "",
                date: item.date || "",
                description: item.description || "",
                longDescription: item.longDescription || "",
                image: item.image || "",
                curriculum: item.curriculum || []
              }
            }),
          });
          count++;
        }
      }
    }

    // Default settings seed
    const defaultSettings = [
      { key: "aboutText", value: "KİNG Education fərdi və peşəkar inkişafınız üçün fəaliyyət göstərən tədris mərkəzidir." },
      { key: "leadershipText", value: "KİNG Education rəhbərliyi təhsilin gələcəyini şəkilləndirməyə sadiqdir." },
      { key: "phone", value: "+994 50 123 45 67" },
      { key: "email", value: "info@kingsedu.az" },
      { key: "address", value: "Bakı şəhəri, Nizami küçəsi" },
      { key: "instagram", value: "https://instagram.com/king.education" },
      { key: "marathonLink", value: "https://chat.whatsapp.com/marathon" }
    ];

    for (const setting of defaultSettings) {
      await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: "update_setting",
          key: setting.key,
          value: setting.value
        }),
      });
    }

    return NextResponse.json({ success: true, message: `${count} məlumat və tənzimləmələr uğurla bazaya yazıldı!` });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
