"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, GraduationCap } from "lucide-react";
import Button from "@/components/ui/Button";
import "../sened-yoxlama/sened-yoxlama.css";
import "./mezunlar.css";

export default function MezunlarPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/mezunlar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Sistem xətası. Lütfən sonra cəhd edin." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-container">
        <div className="verify-header">
          <Image src="/img/Logo.jpeg" alt="KİNG EDUCATION LOGO" width={120} height={120} className="verify-logo" />
          <h1>King Education Company MMC məzunları</h1>
          <p>Ad və soyad daxil edərək məzun məlumatlarınızı yoxlayın</p>
        </div>

        <form onSubmit={handleSearch} className="verify-form">
          <div className="input-wrapper">
            <label>Ad Soyad (Ata adı) daxil edin:</label>
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Məsələn: Məmməd Məmmədov"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="verify-btn" disabled={loading}>
            {loading ? "Axtarılır..." : "MƏZUNU AXTAR"}
          </Button>
        </form>

        {result && (
          <div className="verify-result" style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            {result.success ? (
              <div className="result-success">
                <div className="success-icon-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                  <GraduationCap size={40} className="success-icon" style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Məzun tapıldı!</h3>
                <div className="results-list">
                  {result.data.map((item, index) => (
                    <div key={index} className="result-card" style={{ marginBottom: '1rem', padding: '1.5rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-lg)' }}>
                      <p style={{ marginBottom: '0.5rem' }}><strong>Ad Soyad Ata adı:</strong> {item["AD SOYADI ATA ADI"]}</p>
                      <p style={{ marginBottom: '0.5rem' }}><strong>Kursun adı:</strong> {item["KURSUN ADI"]}</p>
                      <p style={{ marginBottom: '0.5rem' }}><strong>Tədris növü:</strong> {item["TƏDRİS NÖVÜ"]}</p>
                      <p style={{ marginBottom: '0.5rem' }}><strong>Başlama tarixi:</strong> {item["BAŞLAMA TARİXİ"]}</p>
                      <p style={{ marginBottom: '0.5rem' }}><strong>Bitmə tarixi:</strong> {item["BİTMƏ TARİXİ"]}</p>
                      <p style={{ marginBottom: '0.5rem' }}><strong>Ortalaması:</strong> {item["ORTALAMASI"]}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="verify-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'red', marginTop: '1.5rem' }}>
                <Search size={20} />
                <span>{result.message || result.error}</span>
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
