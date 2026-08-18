export const metadata = {
  title: "Kitablar"
};

import CourseCard from "@/components/ui/CourseCard";
import ComingSoon3D from "@/components/ui/ComingSoon3D";
import { getDbData } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function PdfKitablarPage() {
  const db = await getDbData();
  const settings = db?.settings || {};
  const rawData = db?.kitablar || [];

  const sectionVisible = settings["PdfBooks_section_visible"] !== "false" && settings["PdfBooks_section_visible"] !== false && settings["pdfbooks_section_visible"] !== "false" && settings["pdfbooks_section_visible"] !== false && settings["pdf-kitablar_section_visible"] !== "false" && settings["pdf-kitablar_section_visible"] !== false;

  if (!sectionVisible) {
    return (
      <div className="page-wrapper container" style={{ paddingTop: "140px", paddingBottom: "6rem", textAlign: "center" }}>
        <h1 className="page-title text-gradient" style={{ marginBottom: "2rem" }}>Elektron (PDF) Kitablar</h1>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem", background: "var(--bg-alt)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-md)" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--text-main)" }}>Bölmə Müvəqqəti Bağlıdır</h3>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1.05rem" }}>
            Hazırda elektron kitablar bölməsində yenilənmə işləri aparılır. Xahiş edirik tezliklə yenidən yoxlayın.
          </p>
        </div>
      </div>
    );
  }

  // Filter items based on item-level visibility or status
  const activeItems = rawData.filter(item => {
    if (!item) return false;
    const idStr = String(item.id || item.slug || "");
    const visKey = `PdfBooks_item_${idStr}_visible`;
    const visKey2 = `pdfbooks_item_${idStr}_visible`;
    const visKey3 = `pdf-kitablar_item_${idStr}_visible`;
    const isHidden = settings[visKey] === "false" || settings[visKey] === false || settings[visKey2] === "false" || settings[visKey2] === false || settings[visKey3] === "false" || settings[visKey3] === false || item.visible === false || item.visible === "false" || item.status === "gizli";
    return !isHidden;
  });

  return (
    <div className="page-wrapper container" style={{ paddingTop: "120px", paddingBottom: "5rem" }}>
      <h1 className="page-title text-gradient" style={{ textAlign: "center", marginBottom: "3rem" }}>Elektron (PDF) Kitablar</h1>
      
      {activeItems.length > 0 ? (
        <div className="cards-grid">
          {activeItems.map(item => (
            <CourseCard key={item.id} {...item} categoryPath="pdf-kitablar" detailsUrl={item.pdfUrl || `/pdf-kitablar/${item.id}`} type="pdf" />
          ))}
        </div>
      ) : (
        <ComingSoon3D 
          title="Tezliklə Sizlərlə!" 
          subtitle="King Education şirkətinin rəsmi elektron (PDF) kitab xəzinəsi, dərs vəsaitləri və interaktiv sənədləri çox yaxında buradan birbaşa yükləməyiniz üçün hazır olacaq!"
          badge="📚 KİTABLAR • ÇOX YAXINDA"
        />
      )}
    </div>
  );
}
