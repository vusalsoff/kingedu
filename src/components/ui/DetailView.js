"use client";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { formatImageUrl } from "@/lib/imageUrl";
import { useAuth } from "@/context/AuthContext";
import "./DetailView.css";
import { useCustomAlert } from "@/context/AlertContext";

export default function DetailView({ data, defaultCategoryPath, defaultType, settings = {} }) {
  const { showAlert, showConfirm } = useCustomAlert();

  const catPath = data?.categoryPath || defaultCategoryPath || "kurslar";

  if (!data) {
    return (
      <div className="detail-page">
        <div className="container detail-container" style={{ textAlign: "center", padding: "5rem 1rem" }}>
          <div style={{ maxWidth: "500px", margin: "0 auto", background: "var(--bg-color)", padding: "3rem 2rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-md)" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "var(--text-main)" }}>Məlumat tapılmadı</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem", fontSize: "1.05rem" }}>Axtardığınız məlumat bazada mövcud deyil və ya gizlədilib.</p>
            <Link href={`/${catPath}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--primary)", color: "white", padding: "0.75rem 1.75rem", borderRadius: "var(--radius-md)", textDecoration: "none", fontWeight: 600 }}>
              <ArrowLeft size={18} /> Siyahıya qayıt
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const itemType = data.type || defaultType || "course";
  let targetPhone = (settings.wa_courses || "994103685128").replace(/[^0-9]/g, "");
  let defaultMessage = `Salam. Mən «${data.title}» ilə maraqlanıram.`;

  if (itemType === "course" || itemType === "kurslar" || itemType === "Courses" || itemType === "courses") {
    targetPhone = (settings.wa_courses || "994103685128").replace(/[^0-9]/g, "");
    defaultMessage = `Salam. Mən «${data.title}» kursuna qeydiyyatdan keçmək istəyirəm.`;
  } else if (itemType === "marathon" || itemType === "marafonlar" || itemType === "Marathons" || itemType === "marathons") {
    targetPhone = (settings.wa_marathons || "994518885784").replace(/[^0-9]/g, "");
    defaultMessage = `Salam. Mən «${data.title}» marafonunda iştirak etmək istəyirəm.`;
  } else if (itemType === "book" || itemType === "kitablarimiz" || itemType === "kitablar" || itemType === "Books" || itemType === "books") {
    targetPhone = (settings.wa_trainings || "994103790874").replace(/[^0-9]/g, "");
    defaultMessage = `Salam. Mən «${data.title}» kitabını sifariş etmək istəyirəm.`;
  } else if (itemType === "training" || itemType === "telimler" || itemType === "Trainings" || itemType === "trainings" || itemType === "Təlimlər") {
    targetPhone = (settings.wa_trainings || "994103790874").replace(/[^0-9]/g, "");
    defaultMessage = `Salam. Mən «${data.title}» təlimində iştirak etmək istəyirəm.`;
  }

  // Override with item-specific WhatsApp number if provided
  if (data.whatsapp_number) {
    targetPhone = data.whatsapp_number.replace(/[^0-9]/g, "");
  }

  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedMessage}`;

  const getBtnText = () => {
    if (itemType === "marathon" || itemType === "marafonlar" || itemType === "Marathons" || itemType === "marathons") return "Marafona Qoşul";
    if (itemType === "book" || itemType === "kitablarimiz" || itemType === "kitablar" || itemType === "Books" || itemType === "books") return "Kitabı Sifariş Et";
    return "Qeydiyyatdan Keç";
  };

  const { toggleFavorite, isFavorite, user } = useAuth();
  const isFav = data?.id ? isFavorite(data.id) : false;

  const handleStarClick = (e) => {
    e.preventDefault();
    if (!user || user.isAdmin) {
      showAlert("Siz iştirakçı kimi qeydiyyatdan keçməmisiniz. Zəhmət olmasa, favorilərə əlavə etmək üçün sistemə daxil olun.");
      return;
    }
    if (!data?.id) return;
    const itemObj = {
      id: data.id,
      title: data.title,
      image: data.image,
      price: data.price,
      instructor: data.instructor,
      duration: data.duration,
      date: data.date,
      description: data.description || data.longDescription,
      category: itemType === "course" || itemType === "kurslar" || itemType === "Courses" || itemType === "courses" ? "Kurslar" :
                itemType === "training" || itemType === "telimler" || itemType === "Trainings" || itemType === "trainings" || itemType === "Təlimlər" ? "Təlimlər" :
                itemType === "marathon" || itemType === "marafonlar" || itemType === "Marathons" || itemType === "marathons" ? "Marafonlar" :
                itemType === "book" || itemType === "kitablar" || itemType === "kitablarimiz" || itemType === "Books" || itemType === "books" ? "Kitablar" :
                itemType === "news" || itemType === "xeberler" || itemType === "News" || itemType === "news" ? "Xəbərlər" :
                itemType === "campaign" || itemType === "kampaniyalar" || itemType === "Campaigns" || itemType === "campaigns" ? "Kampaniyalar" :
                itemType === "pdf" || itemType === "pdfKitablar" || itemType === "PdfBooks" || itemType === "pdf-kitablar" ? "Kitablar" : "Sertifikatlar"
    };
    toggleFavorite(itemObj, itemObj.category);
  };

  // Parse curriculum robustly
  let curriculumList = [];
  const rawCurriculum = data.benefits || data.curriculum;
  if (Array.isArray(rawCurriculum)) {
    curriculumList = rawCurriculum;
  } else if (typeof rawCurriculum === "string" && rawCurriculum.trim() !== "") {
    try {
      const parsed = JSON.parse(rawCurriculum);
      if (Array.isArray(parsed)) curriculumList = parsed;
      else curriculumList = rawCurriculum.split("\n").filter(Boolean);
    } catch (e) {
      curriculumList = rawCurriculum.split("\n").filter(Boolean);
    }
  }

  return (
    <div className="detail-page">
      <div className="container detail-container">
        
        <Link href={`/${catPath}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontWeight: 600, textDecoration: 'none', marginBottom: '-1rem' }}>
          <ArrowLeft size={20} /> Geriyə qayıt
        </Link>

        <motion.div 
          className="detail-header-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={formatImageUrl(data.image)} alt={data.title} className="detail-cover-image" />
          <div className="detail-header-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <h1 className="detail-title" style={{ margin: 0 }}>{data.title}</h1>
              <button
                onClick={handleStarClick}
                className={`detail-star-btn ${isFav ? "active" : ""}`}
              >
                <div className="star-icon-wrapper" style={{ width: '22px', height: '22px' }}>
                  <Star size={20} className="star-svg" fill={isFav ? "#FFB800" : "none"} stroke={isFav ? "#FFB800" : "currentColor"} strokeWidth={isFav ? 2.5 : 2} />
                  <span className="star-burst-ring"></span>
                </div>
                <span>{isFav ? "Favorilərdədir (Sil)" : "Favorilərə Əlavə Et"}</span>
              </button>
            </div>
            <div className="detail-meta-grid">
              {data.instructor && (
                <div className="meta-item">
                  <span className="meta-label">Təlimçi / Müəllif</span>
                  <span className="meta-value">{data.instructor}</span>
                </div>
              )}
              {data.duration && (
                <div className="meta-item">
                  <span className="meta-label">Müddət / Həcm</span>
                  <span className="meta-value">{data.duration}</span>
                </div>
              )}
              {data.date && (
                <div className="meta-item">
                  <span className="meta-label">Başlama Tarixi</span>
                  <span className="meta-value">{data.date}</span>
                </div>
              )}
              {data.price && (
                <div className="meta-item">
                  <span className="meta-label">Ödəniş / İnvestisiya</span>
                  <span className="meta-value price">{data.price}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="detail-body-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="detail-section-title">Haqqında</h2>
          <div 
            className="rich-text-display detail-description" 
            dangerouslySetInnerHTML={{ __html: data.longDescription || data.description || "Ətraflı məlumat yoxdur." }} 
          />
          
          {curriculumList.length > 0 && (
            <>
              <h2 className="detail-section-title">Nələr əldə edəcəksiniz?</h2>
              <ul className="curriculum-list">
                {curriculumList.map((item, index) => (
                  <li key={index} className="curriculum-item">
                    <CheckCircle className="curriculum-icon" size={22} />
                    <span className="curriculum-text">{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {data.videourl && (
            <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '2px solid var(--primary)', borderRadius: '16px', padding: '1.5rem', marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>▶ Keçmiş Təlim Videosu</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Təlimin video qeydinə daxil olaraq izləyə bilərsiniz.</p>
              </div>
              <a href={data.videourl} target="_blank" rel="noopener noreferrer" className="detail-cta-btn" style={{ background: 'var(--primary)', color: '#fff', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                🎬 Videoya Bax
              </a>
            </div>
          )}

          {data.certificateurl && (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '2px solid #10b981', borderRadius: '16px', padding: '1.5rem', marginTop: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#10b981', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>🎓 Sertifikat Yoxlama</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Təlim/kurs üçün sertifikat bazasına daxil olub sertifikatınızı yükləyə bilərsiniz.</p>
              </div>
              <a href={data.certificateurl} target="_blank" rel="noopener noreferrer" className="detail-cta-btn" style={{ background: '#10b981', color: '#fff', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                ✅ Sertifikat Yüklə
              </a>
            </div>
          )}

          {(itemType === "training" || itemType === "telimler" || itemType === "Trainings" || itemType === "Təlimlər") && (
            <div style={{ background: 'rgba(255, 184, 0, 0.08)', border: '2px solid #FFB800', borderRadius: '16px', padding: '1.5rem', marginTop: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#FFB800', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>🏆 Sertifikat Üçün Müraciət</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Təlimdə iştirak etmisinizsə, rəsmi sertifikatınızı əldə etmək üçün WhatsApp-a yazın.</p>
              </div>
              <a href={`https://api.whatsapp.com/send/?phone=${settings["training_certificate_whatsapp"] || "994103685128"}&text=Salam.+Mən+«${encodeURIComponent(data.title)}»+təlimi+üçün+sertifikat+müraciəti+etmək+istəyirəm.`} target="_blank" rel="noopener noreferrer" className="detail-cta-btn" style={{ background: '#FFB800', color: '#000', textDecoration: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 4px 14px rgba(255, 184, 0, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                💬 Müraciət Et
              </a>
            </div>
          )}

          {data.videoUrl && (
            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <h2 className="detail-section-title">Video İcmal</h2>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src={data.videoUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                  title="Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {(data.status === "Keçmiş" || data.status === "Bitmiş") ? (
            <div className="detail-cta-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <h3>Keçmiş Təlim</h3>
              <p>Bu təlim artıq baş tutmuşdur. Siz onun video yazısına baxa və ya sertifikat üçün müraciət edə bilərsiniz.</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {data.videoUrl && (
                  <a href={data.videoUrl} target="_blank" rel="noopener noreferrer" className="detail-cta-btn" style={{ background: '#3b82f6' }}>
                    📺 Videoya bax
                  </a>
                )}
                <a 
                  href={`https://wa.me/${(settings.certificate_whatsapp || "+994103685128").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Salam. Mən «${data.title}» təliminin sertifikatı üçün müraciət etmək istəyirəm.`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="detail-cta-btn" 
                  style={{ background: '#10b981' }}
                >
                  🎓 Sertifikat üçün müraciət et
                </a>
              </div>
            </div>
          ) : itemType === "book" || itemType === "kitablarimiz" || itemType === "kitablar" || itemType === "Books" || itemType === "books" ? (
            <div className="detail-cta-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <h3>Kitabı Sifariş Et</h3>
              <p>Kitabı mərkəzimizdən götürə və ya poçt/kargo vasitəsilə çatdırılma istəyə bilərsiniz.</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="detail-cta-btn"
                >
                  🏢 Mərkəzdən Götür
                </a>
                <a 
                  href={`https://wa.me/${targetPhone}?text=${encodeURIComponent(`Salam. Mən «${data.title}» kitabını poçt/kargo çatdırılması ilə sifariş etmək istəyirəm.`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="detail-cta-btn" 
                  style={{ background: '#f59e0b' }}
                >
                  📦 Kargo ilə Çatdırılma
                </a>
              </div>
            </div>
          ) : (
            <div className="detail-cta-box">
              <h3>Bizə Qoşulmağa Hazırsınız?</h3>
              <p>Elə indi menecerimizlə əlaqə saxlayın və yerinizi bron edin.</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="detail-cta-btn">
                💬 {getBtnText()}
              </a>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
