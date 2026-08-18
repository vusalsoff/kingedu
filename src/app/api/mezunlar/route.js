import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Axtarış üçün ad soyad daxil edin" }, { status: 400 });
    }

    const csvUrl = "https://docs.google.com/spreadsheets/d/1gOdOPgPM4lPSNvMd31K01QL284rEEoKsYeTcDD2bAxU/export?format=csv";
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error("Məlumat bazasına qoşulmaq mümkün olmadı");
    }

    const csvText = await response.text();
    
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    const results = parsed.data.filter(row => {
      const name = row["AD SOYADI ATA ADI"] || "";
      return name.toLowerCase().includes(query.toLowerCase().trim());
    });

    if (results.length > 0) {
      return NextResponse.json({ success: true, data: results });
    } else {
      return NextResponse.json({ success: false, message: "Bu adla məzun tapılmadı" });
    }

  } catch (error) {
    console.error("Məzun axtarış xətası:", error);
    return NextResponse.json({ error: "Sistem xətası baş verdi. Zəhmət olmasa biraz sonra cəhd edin." }, { status: 500 });
  }
}
