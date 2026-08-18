"use client";

import Button from "./Button";
import { formatImageUrl } from "@/lib/imageUrl";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";
import "./CourseCard.css";
import { useCustomAlert } from "@/context/AlertContext";

export default function CourseCard({ 
  id,
  image, 
  title, 
  instructor, 
  duration, 
  price, 
  date, 
  description,
  type = "course", // course, marathon, training, book, volunteer
  categoryPath,
  detailsUrl,
  pdfUrl,
  whatsapp_number,
}) {
  const { showAlert, showConfirm } = useCustomAlert();

  
  let defaultMessage = `Salam. Mən «${title}» xidmətinizlə maraqlanıram.`;
  let customUrl = null;

  if (type === "course" || type === "kurslar" || type === "Courses" || type === "courses") {
    defaultMessage = `Salam. Mən «${title}» kursuna qeydiyyatdan keçmək istəyirəm.`;
  } else if (type === "marathon" || type === "marafonlar" || type === "Marathons" || type === "marathons") {
    defaultMessage = `Salam. Mən «${title}» marafonunda iştirak etmək istəyirəm.`;
  } else if (type === "book" || type === "kitablarimiz" || type === "kitablar" || type === "Books" || type === "books") {
    defaultMessage = `Salam. Mən «${title}» kitabını sifariş etmək istəyirəm. (Çatdırılma: Poçt / Kargo ilə / Mərkəzdən)`;
  } else if (type === "training" || type === "telimler" || type === "Trainings" || type === "trainings" || type === "Təlimlər") {
    defaultMessage = `Salam. Mən «${title}» təlimində iştirak etmək istəyirəm.`;
  } else if (type === "volunteer") {
    customUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdDQuU3BxPv3C1t_ELe3va9Xr2-li11ZgFrzoBAWXVhLmHYvw/viewform";
  } else if (type === "pdf" || type === "pdfKitablar" || type === "PdfBooks" || type === "pdf-kitablar") {
    defaultMessage = `Salam. Mən «${title}» adlı PDF kitabı satın almaq istəyirəm.`;
  }

  const encodedMessage = encodeURIComponent(defaultMessage);
  let whatsappUrl = `/api/whatsapp?text=${encodedMessage}&category=${type}`;
  
  if (whatsapp_number) {
    const cleanPhone = String(whatsapp_number).replace(/[^0-9]/g, "");
    if (cleanPhone) {
      whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    }
  }

  const finalUrl = customUrl || whatsappUrl;

  const getBtnText = () => {
    if (type === "volunteer" || type === "marathon" || type === "marafonlar" || type === "Marathons" || type === "marathons") return "İştirak Et";
    if (type === "book" || type === "kitablarimiz" || type === "kitablar" || type === "Books" || type === "books") return "Sifariş Et";
    if (type === "news" || type === "xeberler" || type === "News") return "Ətraflı Oxu";
    if (type === "campaign" || type === "kampaniyalar" || type === "Campaigns") return "Qoşul / Ətraflı";
    if (type === "pdf" || type === "pdfKitablar" || type === "PdfBooks" || type === "pdf-kitablar") return "Satın Al";
    return "Qeydiyyatdan Keç";
  };

  const targetDetailsUrl = (type === "pdf" || type === "pdfKitablar" || type === "PdfBooks" || type === "pdf-kitablar") ? null : (detailsUrl || (categoryPath && id ? `/${categoryPath}/${id}` : null));

  const { toggleFavorite, isFavorite, user } = useAuth();
  const isFav = id ? isFavorite(id, type) : false;

  const handleStarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.isAdmin) {
      showAlert("Siz iştirakçı kimi qeydiyyatdan keçməmisiniz. Zəhmət olmasa, favorilərə əlavə etmək üçün sistemə daxil olun.");
      return;
    }
    if (!id) return;
    const itemObj = {
      id,
      title,
      image,
      price,
      instructor,
      duration,
      date,
      description,
      type,
      pdfUrl: detailsUrl || pdfUrl || "",
      category: type === "course" || type === "kurslar" || type === "Courses" || type === "courses" ? "Kurslar" :
                type === "training" || type === "telimler" || type === "Trainings" || type === "trainings" || type === "Təlimlər" ? "Təlimlər" :
                type === "marathon" || type === "marafonlar" || type === "Marathons" || type === "marathons" ? "Marafonlar" :
                type === "book" || type === "kitablar" || type === "kitablarimiz" || type === "Books" || type === "books" ? "Kitablar" :
                type === "news" || type === "xeberler" || type === "News" || type === "news" ? "Xəbərlər" :
                type === "campaign" || type === "kampaniyalar" || type === "Campaigns" || type === "campaigns" ? "Kampaniyalar" :
                type === "pdf" || type === "pdfKitablar" || type === "PdfBooks" || type === "pdf-kitablar" ? "Kitablar" : "Sertifikatlar"
    };
    toggleFavorite(itemObj, itemObj.category);
  };

  return (
    <div className="card course-card">
      <div className="card-image-wrapper">
        <img src={formatImageUrl(image)} alt={title} className="card-image" />
        {price && <div className="card-price">{price}</div>}
        {id && (
          <button
            className={`card-star-btn ${isFav ? "active" : ""}`}
            onClick={handleStarClick}
            title={isFav ? "Favorilərdən sil" : "Favorilərə əlavə et (Ulduzla)"}
            aria-label="Favorilərə əlavə et"
          >
            <div className="star-icon-wrapper">
              <Star size={22} className="star-svg" fill={isFav ? "#FFB800" : "none"} stroke={isFav ? "#FFB800" : "currentColor"} strokeWidth={isFav ? 2.5 : 2} />
              <span className="star-burst-ring"></span>
            </div>
          </button>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-desc">{description}</p>}
        
        <div className="card-meta">
          {instructor && <span>👨‍🏫 {instructor}</span>}
          {duration && <span>⏱ {duration}</span>}
          {date && <span>📅 {date}</span>}
        </div>
        
        <div className="card-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: 'auto', width: '100%' }}>
          {targetDetailsUrl && (
            <Button href={targetDetailsUrl} className="btn-secondary" style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '600', justifyContent: 'center' }}>
              👁️ Ətraflı Bax
            </Button>
          )}
          <Button href={finalUrl} external={true} style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '600', justifyContent: 'center' }}>
            💬 {getBtnText()}
          </Button>
        </div>
      </div>
    </div>
  );
}
