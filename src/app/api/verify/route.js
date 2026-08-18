import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Axtarış üçün ad soyad daxil edin" }, { status: 400 });
    }

    const searchStr = query.toLowerCase().trim();

    // Fetch Google Sheets CSV
    const csvUrl = "https://docs.google.com/spreadsheets/d/1EPNvzfk0PXAn5WbHYguoyqqIRBK0VFm9bQHceJXlA4E/export?format=csv";
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error("Google Sheets-dən məlumat çəkilə bilmədi");
    }

    const csvData = await response.text();

    // Parse CSV
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    // Bəzən Google Sheets CSV-sində ilk sətir təkrarlanan başlıqlar ola bilər
    // Bizə lazım olan sütun "Sertifikatı alan şəxsin ad soyad və ata adı" (bəzən fərqli yazıla bilər, ona görə keyslərə baxaq)
    const results = [];
    
    // Find primary name column
    const keys = parsed.meta.fields || [];
    const getVal = (row, ...possibilities) => {
      for (const p of possibilities) {
        if (row[p] !== undefined && row[p] !== "") return row[p];
        const cleanP = p.toLowerCase().trim();
        for (const k of keys) {
          if (k.toLowerCase().trim() === cleanP && row[k] !== undefined && row[k] !== "") {
            return row[k];
          }
        }
      }
      // substring search as fallback
      for (const p of possibilities) {
        const cleanP = p.toLowerCase().trim();
        for (const k of keys) {
          if (k.toLowerCase().trim().includes(cleanP) && row[k] !== undefined && row[k] !== "") {
            return row[k];
          }
        }
      }
      return "";
    };

    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i];
      const fullName = getVal(row, "Ad Soyad Ata adı", "Ad, soyad, ata adı", "Sertifikatı alan şəxsin ad soyad və ata adı", "Ad Soyad", "Ad", "Full Name");
      
      // Skip header repetitions or empty names
      if (!fullName || fullName.toLowerCase().includes("sertifikatı alan şəxs") || fullName.toLowerCase() === "ad soyad") continue;

      if (fullName.toLowerCase().includes(searchStr)) {
        results.push({
          code: getVal(row, "Sertifikat Kodu", "Sertifikat kodu", "Kod", "ID", "No", "№"),
          fullName: fullName,
          topic: getVal(row, "Təlimin və ya kursun adı, mövzusu", "Təlim/Kurs adı", "Mövzu", "Kursun adı", "Təlim adı"),
          docType: getVal(row, "Sertifikatın mövzusu", "Sənəd növü", "Sertifikatın növü", "Növü", "Sənədin növü", "Type") || "Təlimdə iştirak",
          date: getVal(row, "Tarix", "Verilmə tarixi", "Date"),
          note: getVal(row, "Qeyd", "Əlavə qeyd", "Note"),
          link: getVal(row, "LİNK", "Link", "Sertifikat linki", "Yükləmə linki", "Download") || null,
        });
      }
    }

    return NextResponse.json({ results });

  } catch (error) {
    console.error("Sənəd yoxlama xətası:", error);
    return NextResponse.json({ error: "Server xətası baş verdi. Bir az sonra yenidən cəhd edin." }, { status: 500 });
  }
}
