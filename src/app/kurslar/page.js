export const metadata = {
  title: "Kurslar"
};

import CourseCard from "@/components/ui/CourseCard";
import { getDbData } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function KurslarPage() {
  const db = await getDbData();
  const settings = db?.settings || {};
  const rawData = db?.kurslar || db?.Courses || db?.courses || [];

  const sectionVisible = settings["Courses_section_visible"] !== "false" && settings["Courses_section_visible"] !== false && settings["kurslar_section_visible"] !== "false" && settings["kurslar_section_visible"] !== false;

  if (!sectionVisible) {
    return (
      <div className="page-wrapper container" style={{ paddingTop: "140px", paddingBottom: "6rem", textAlign: "center" }}>
        <h1 className="page-title text-gradient" style={{ marginBottom: "2rem" }}>Kurslarımız</h1>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem", background: "var(--bg-alt)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-md)" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "var(--text-main)" }}>Bölmə Müvəqqəti Bağlıdır</h3>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1.05rem" }}>
            Hazırda kurslar bölməsində yenilənmə və təkmilləşdirmə işləri aparılır. Xahiş edirik tezliklə yenidən yoxlayın.
          </p>
        </div>
      </div>
    );
  }

  const activeKurslar = rawData.filter(item => {
    const visKey = `visibility_Courses_${item.id}`;
    const visKey2 = `visibility_kurslar_${item.id}`;
    const isHidden = settings[visKey] === "false" || settings[visKey] === false || settings[visKey2] === "false" || settings[visKey2] === false || item.visible === false || item.visible === "false" || item.status === "gizli";
    return !isHidden;
  });

  return (
    <div className="page-wrapper container" style={{ paddingTop: "120px", paddingBottom: "5rem" }}>
      <h1 className="page-title text-gradient" style={{ textAlign: "center", marginBottom: "3rem" }}>Kurslarımız</h1>
      
      {activeKurslar.length > 0 ? (
        <div className="cards-grid">
          {activeKurslar.map(course => (
            <CourseCard key={course.id} {...course} categoryPath="kurslar" detailsUrl={`/kurslar/${course.id}`} type="course" />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Hazırda aktiv kurs yoxdur. Admin paneldən əlavə edə və ya gizlədilmiş kursları aktivləşdirə bilərsiniz.
        </div>
      )}
    </div>
  );
}
