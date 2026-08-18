import { NextResponse } from "next/server";
import { getDbData } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text") || "";
    const category = searchParams.get("category") || "";
    
    // Fetch settings from DB
    const db = await getDbData();
    const settings = db?.settings || {};
    
    // Global fallback numbers
    let fallbackPhone = settings.phone || "994103790874";
    
    if (category === "course" || category === "kurslar" || category === "Courses" || category === "courses") {
      fallbackPhone = settings.course_whatsapp || "994103685128";
    } else if (category === "marathon" || category === "marafonlar" || category === "Marathons" || category === "marathons") {
      fallbackPhone = settings.marathon_whatsapp || "994518885784";
    } else if (category === "book" || category === "kitablarimiz" || category === "kitablar" || category === "Books" || category === "books") {
      fallbackPhone = settings.book_whatsapp || "994103790874";
    } else if (category === "training" || category === "telimler" || category === "Trainings" || category === "trainings" || category === "Təlimlər") {
      fallbackPhone = settings.training_whatsapp || "994103790874";
    }

    const cleanPhone = fallbackPhone.replace(/[^0-9]/g, "");
    
    // Check if the global setting is a direct link (only for general support, not category specific)
    let waUrl = null;
    if (!category && settings.whatsapp_contact) {
      waUrl = settings.whatsapp_contact;
    }
    
    if (waUrl && waUrl.includes("api.whatsapp.com")) {
      const hasQ = waUrl.includes("?");
      waUrl = `${waUrl}${hasQ ? '&' : '?'}text=${encodeURIComponent(text)}`;
      return NextResponse.redirect(waUrl);
    } else if (waUrl && waUrl.includes("wa.me")) {
      const hasQ = waUrl.includes("?");
      waUrl = `${waUrl}${hasQ ? '&' : '?'}text=${encodeURIComponent(text)}`;
      return NextResponse.redirect(waUrl);
    }
    
    // Construct the standard API link for the specific category
    const targetPhone = cleanPhone;
    const finalUrl = `https://api.whatsapp.com/send/?phone=${targetPhone}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
    
    return NextResponse.redirect(finalUrl);
  } catch (err) {
    console.error("WhatsApp Redirect Error:", err);
    return NextResponse.redirect("https://api.whatsapp.com/send/?phone=994103790874&type=phone_number&app_absent=0");
  }
}
