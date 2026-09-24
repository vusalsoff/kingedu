"use client";

import { useState } from "react";
import Image from "next/image";
import "./sened-yoxlama.css";
import Button from "@/components/ui/Button";
import { Search, Download, AlertCircle, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SenedYoxlamaPage() {
  const { user, toggleFavorite, isFavorite } = useAuth();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Axtarış zamanı xəta baş verdi");
      }

      setResults(data.results.reverse());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-header">
          <Image src="/img/Logo.jpeg" alt="KING EDUCATION LOGO" width={120} height={120} className="verify-logo" />
          <h1>Sənədlərin vahid yoxlanma sistemi</h1>
          <p>Ad, soyad daxil edərək sənəd məlumatlarınızı yoxlayın</p>
        </div>

        <form className="verify-form" onSubmit={handleSearch}>
          <div className="input-wrapper">
            <label>Ad Soyadınızı daxil edin:</label>
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Məs: Vüsal Süleymanov..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <span className="input-hint">Zəhmət olmasa Azərbaycan hərflərindən istifadə edin</span>
          </div>

          <Button type="submit" disabled={loading} className="verify-btn">
            {loading ? "Axtarılır..." : "YOXLA"}
          </Button>
        </form>

        {error && (
          <div className="verify-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {results !== null && (
          <div className="verify-results">
            {results.length === 0 ? (
              <div className="no-results">
                <AlertCircle size={30} />
                <h3>Sənəd Tapılmadı</h3>
                <p>Daxil etdiyiniz ada uyğun heç bir sənəd sistemdə tapılmadı. Adın düzgün yazıldığından əmin olun.</p>
              </div>
            ) : (
              <div className="results-list">
                <div style={{ marginBottom: "15px", fontWeight: "bold", fontSize: "1.1rem", color: "var(--primary)" }}>
                  Tapılan sənəd sayı: {results.length}
                </div>
                {results.map((item, idx) => (
                  <div key={idx} className="cert-result-card" style={idx === 0 ? { position: "relative", border: "2px solid var(--primary)", boxShadow: "0 4px 15px rgba(255,107,0,0.2)" } : {}}>
                    {idx === 0 && (
                      <div style={{ position: "absolute", top: "-12px", right: "20px", background: "var(--primary)", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", letterSpacing: "1px", textTransform: "uppercase", zIndex: 10 }}>
                        YENİ
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div className="cert-status-badge">✅ Sənəd tapıldı</div>
                      <button
                        onClick={() => {
                          const docItem = {
                            id: item.code || `${item.fullName}-${item.topic}`,
                            type: "document",
                            title: item.topic || "Sənəd",
                            docType: item.docType,
                            code: item.code,
                            date: item.date,
                            link: item.link,
                            fullName: item.fullName,
                            note: item.note
                          };
                          toggleFavorite(docItem, "Sənədlər");
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: isFavorite(item.code || `${item.fullName}-${item.topic}`, "document") ? "#FFB800" : "var(--text-muted)",
                          cursor: "pointer",
                          padding: "5px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px"
                        }}
                        title="Kabinetdə saxla"
                      >
                        <Star size={24} fill={isFavorite(item.code || `${item.fullName}-${item.topic}`, "document") ? "#FFB800" : "none"} />
                      </button>
                    </div>
                    
                    <div style={{ background: "rgba(255,107,0,0.1)", padding: "15px", borderRadius: "10px", margin: "15px 0", borderLeft: "4px solid var(--primary)", fontSize: "0.95rem", lineHeight: "1.5", color: "var(--text-main)" }}>
                      🎉 King Education Company MMC olaraq sizi ürəkdən təbrik edirik! Gələcək fəaliyyətinizdə və karyeranızda sonsuz uğurlar, yeni nailiyyətlər və müvəffəqiyyətlər arzulayırıq! Yolunuz hər zaman açıq olsun! 🚀
                    </div>
                    
                    <div className="cert-info-list">
                      <p><strong>Ad Soyad Ata adı:</strong> {item.fullName}</p>
                      <p><strong>Sənədin növü:</strong> {item.docType || "Təlimdə iştirak"}</p>
                      <p><strong>Sənədin məzmunu:</strong> {item.topic || "Qeyd olunmayıb"}</p>
                      <p><strong>Sənədin kodu / nömrəsi:</strong> {item.code || "Qeyd olunmayıb"}</p>
                      {item.date && <p><strong>Tarix:</strong> {item.date}</p>}
                      {item.note && <p className="result-note"><strong>Qeyd:</strong> {item.note}</p>}
                    </div>

                    <div className="cert-btn-wrap">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="cert-download-btn">
                          <Download size={18} /> Sənədə bax
                        </a>
                      ) : (
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "10px", padding: "10px", backgroundColor: "var(--bg-alt)", borderRadius: "8px", border: "1px dashed var(--border-color)", lineHeight: "1.5" }}>
                          ⚠️ Sistemə yalnız 11 İyuldan etibarən verilən sənədlərin rəqəmsal nüsxəsi (şəkli) əlavə edilmişdir. Sənədiniz bundan əvvəlki tarixə aiddirsə, onun elektron nüsxəsi mövcud deyil, lakin yuxarıdakı məlumatlar sənədinizin rəsmi və etibarlı olduğunu təsdiq edir.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="verify-footer">
        © KING EDUCATION Company MMC-2026
      </div>
    </div>
  );
}
