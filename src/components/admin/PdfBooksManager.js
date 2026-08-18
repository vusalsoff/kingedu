"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, Upload, X, Eye, EyeOff, FileText, BookOpen, ExternalLink, Image as ImageIcon } from "lucide-react";
import Loading from "@/app/loading";
import { formatImageUrl, cleanSheetImageUrl } from "@/lib/imageUrl";
import "./NewsManager.css";
import "./PdfBooksManager.css";
import { useCustomAlert } from "@/context/AlertContext";

export default function PdfBooksManager() {
  const { showAlert, showConfirm } = useCustomAlert();

  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [sectionVisible, setSectionVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    duration: "",
    date: new Date().getFullYear().toString(),
    image: "",
    pdfUrl: "",
    description: "",
    longDescription: ""
  });
  
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_all" })
      });
      const result = await res.json();
      if (result.success && result.data) {
        const d = result.data;
        const list = d.pdfKitablar || d.pdf_kitablar || d.PdfKitablar || d.pdfBooks || d.Pdfbooks || d.pdfkitablar || [];
        setItems(list);

        const s = d.settings || {};
        setSettings(s);

        const isVis = s.pdfbooks_section_visible !== "false" && s.pdfbooks_section_visible !== false && s["pdf-kitablar_section_visible"] !== "false" && s["pdf-kitablar_section_visible"] !== false;
        setSectionVisible(isVis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.replace(/^data:.+;base64,/, "");
      try {
        const res = await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "upload_image", base64: base64String, mimeType: file.type })
        });
        const result = await res.json();
        if (result.success) {
          setFormData(prev => ({ ...prev, image: cleanSheetImageUrl(result.url) || result.url }));
        } else {
          showAlert("Şəkil yüklənərkən xəta oldu!");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.replace(/^data:.+;base64,/, "");
      try {
        const res = await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "upload_image", base64: base64String, mimeType: file.type || "application/pdf" })
        });
        const result = await res.json();
        if (result.success) {
          setFormData(prev => ({ ...prev, pdfUrl: cleanSheetImageUrl(result.url) || result.url }));
        } else {
          showAlert("PDF yüklənərkən xəta oldu!");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleSectionVisibility = async () => {
    const newVal = !sectionVisible;
    setSectionVisible(newVal);
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_setting", key: "pdfbooks_section_visible", value: newVal ? "true" : "false" })
      });
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_setting", key: "pdf-kitablar_section_visible", value: newVal ? "true" : "false" })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      instructor: "",
      duration: "",
      date: new Date().getFullYear().toString(),
      image: "",
      pdfUrl: "",
      description: "",
      longDescription: ""
    });
    setEditingId(null);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title || "",
        instructor: item.instructor || "",
        duration: item.duration || "",
        date: item.date || "",
        image: item.image || "",
        pdfUrl: item.pdfUrl || "",
        description: item.description || "",
        longDescription: item.longDescription || ""
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.pdfUrl) {
      showAlert("Kitabın Adını və PDF Linkini daxil edin!");
      return;
    }
    setSaving(true);
    try {
      const action = editingId ? "update_item" : "create_item";
      const payload = {
        action,
        collection: "PdfBooks",
        id: editingId || Date.now().toString(),
        data: {
          ...formData,
          createdAt: editingId ? (items.find(x => x.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
        }
      };

      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        setModalOpen(false);
        resetForm();
        fetchItems();
      } else {
        showAlert("Xəta: " + (result.error || "Məlumat yadda saxlanılmadı"));
      }
    } catch (err) {
      console.error(err);
      showAlert("Sistem xətası baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!await showConfirm("Bu kitabı silmək istəyirsiniz?")) return;
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_item", collection: "PdfBooks", id })
      });
      const result = await res.json();
      if (result.success) {
        setItems(items.filter(x => x.id !== id));
      } else {
        showAlert("Silinərkən xəta oldu!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => {
    return !search || 
      (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
      (item.instructor && item.instructor.toLowerCase().includes(search.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="pdfbooks-manager">
      <div className="pdfbooks-header-section">
        <div>
          <h1 className="pdfbooks-header-title">
            <FileText size={32} style={{ color: '#ef4444' }} /> Kitablar İdarəetməsi (Xüsusi Bölmə)
          </h1>
          <p className="pdfbooks-header-subtitle">
            Bu bölmə yalnız ödənişsiz və ya ödənişli PDF formatlı elektron kitabların paylaşılması üçündür. PDF sənədlərini həm cihazdan birbaşa Google Drive-a yükləyə, həm də link vasitəsilə əlavə edə bilərsiniz.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <button 
            type="button"
            onClick={toggleSectionVisibility}
            style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: sectionVisible ? '#fff1f2' : '#ecfdf5', color: sectionVisible ? '#e11d48' : '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {sectionVisible ? <><EyeOff size={18} /> Bütöv Bölməni Gizlət</> : <><Eye size={18} /> Bütöv Bölməni Göstər</>}
          </button>
          <button className="pdfbooks-add-btn" onClick={() => openModal()}>
            <Plus size={20} /> Yeni Kitab Yüklə
          </button>
        </div>
      </div>

      <div className="news-filter-toolbar">
        <div className="news-search-box">
          <Search size={18} className="news-search-icon" />
          <input 
            type="text" 
            placeholder="⌕ Kitablarda axtar..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "600" }}>
          Cəmi: <strong>{filteredItems.length}</strong> Kitab
        </div>
      </div>

      <div className="news-table-card">
        <h3 className="news-table-header-text">Məzmun arxivi / Elektron Kitablar cədvəli</h3>
        <p className="news-table-desc">Siyahıdakı hər bir elektron kitaba baxın, redaktə edin və ya sənədi endirin.</p>
        
        {loading ? (
          <Loading embedded={true} />
        ) : (
          <div className="table-responsive">
            <table className="news-table">
              <thead>
                <tr>
                  <th>Üz Qabığı</th>
                  <th>Kitabın Adı</th>
                  <th>Müəllif / Tərtibçi</th>
                  <th>Səhifə Sayı</th>
                  <th>PDF Link</th>
                  <th>İdarəetmə</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="news-table-img-wrapper" style={{ width: 50, height: 70 }}>
                          {item.image ? (
                            <img src={formatImageUrl(item.image)} alt={item.title} className="news-table-img" />
                          ) : (
                            <span className="news-table-no-img">Qapaq yoxdur</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="news-item-title">{item.title}</div>
                        <div className="news-item-summary">{item.description}</div>
                      </td>
                      <td style={{ fontWeight: "600", color: "var(--text-main)" }}>{item.instructor || "Qeyd olunmayıb"}</td>
                      <td>{item.duration || "Bəlli deyil"}</td>
                      <td>
                        {item.pdfUrl ? (
                          <a href={item.pdfUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: 8, fontWeight: 700, fontSize: "0.8rem", textDecoration: "none" }}>
                            📄 PDF-ə Bax <ExternalLink size={14} />
                          </a>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Link yoxdur</span>
                        )}
                      </td>
                      <td>
                        <div className="news-actions-group">
                          <button 
                            type="button" 
                            className="news-action-btn edit" 
                            onClick={() => openModal(item)}
                            title="Redaktə et / Dəyişdir"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            type="button" 
                            className="news-action-btn delete" 
                            onClick={() => handleDelete(item.id)}
                            title="Sil"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                      Hələ ki, heç bir Kitab tapılmadı. Yuxarıdakı "Yeni Kitab Yüklə" düyməsi ilə əlavə edin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating / Editing PDF Books */}
      {isModalOpen && (
        <div className="news-modal-overlay">
          <div className="news-modal-content">
            <div className="news-modal-header">
              <h2>{editingId ? "📕 Kitabı Redaktə Et (Dəyişdir)" : "📕 Yeni Kitab Yüklə"}</h2>
              <button className="news-modal-close" onClick={() => setModalOpen(false)}>
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="news-form-body">
              {/* Section 1: Əsas Məlumatlar */}
              <div className="news-form-section">
                <h3 className="news-section-title"><BookOpen size={20} style={{ color: "#ef4444" }} /> 1. Kitab haqqında əsas məlumatlar</h3>
                <div className="news-form-grid-2">
                  <div className="news-form-group">
                    <label>Kitabın Adı / Başlığı</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Məs: İngilis Dili Qrammatikası (Tam Kurs)" 
                    />
                  </div>
                  <div className="news-form-group">
                    <label>Müəllif / Tərtibçi</label>
                    <input 
                      type="text" 
                      name="instructor" 
                      value={formData.instructor} 
                      onChange={handleInputChange} 
                      placeholder="Məs: Mirfəqan Hacıyev" 
                    />
                  </div>
                  <div className="news-form-group">
                    <label>Səhifə Sayı / Həcmi</label>
                    <input 
                      type="text" 
                      name="duration" 
                      value={formData.duration} 
                      onChange={handleInputChange} 
                      placeholder="Məs: 240 səhifə" 
                    />
                  </div>
                  <div className="news-form-group">
                    <label>Nəşr İli / Tarix</label>
                    <input 
                      type="text" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleInputChange} 
                      placeholder="Məs: 2026" 
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: PDF Yükləmə Bölməsi (ONLY IN PDF BOOKS!) */}
              <div className="news-form-section" style={{ border: "2px solid #ef4444", background: "rgba(239, 68, 68, 0.02)" }}>
                <h3 className="news-section-title" style={{ color: "#ef4444" }}><FileText size={22} /> 2. 📄 PDF Sənəd / Kitab Linki və ya Yüklə (Google Drive, Dropbox, PDF URL)</h3>
                
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                  Kitabın elektron (PDF) versiyasını həm cihazınızdan birbaşa Google Drive hesabanıza yükləyə, həm də xarici link (Google Drive, Dropbox, Mega və s. URL) olaraq bura yapışdıra bilərsiniz.
                </p>

                <div className={`pdf-upload-box ${formData.pdfUrl ? "has-file" : ""}`}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <input 
                      type="file" 
                      accept=".pdf,application/pdf"
                      ref={pdfInputRef}
                      style={{ display: "none" }}
                      onChange={handlePdfUpload}
                    />
                    <button 
                      type="button" 
                      className="pdf-file-btn" 
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={saving}
                    >
                      <Upload size={18} /> 
                      {saving ? "Drive-a Yüklənir..." : "📁 Cihazdan PDF Yüklə (Google Drive-a yazır)"}
                    </button>
                    {formData.pdfUrl && (
                      <a href={formData.pdfUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0.75rem 1.25rem", background: "#10b981", color: "white", borderRadius: "10px", fontWeight: "700", textDecoration: "none", fontSize: "0.9rem" }}>
                        ✓ Yüklənmiş PDF-i Yoxla <ExternalLink size={16} />
                      </a>
                    )}
                  </div>

                  <div className="news-form-group">
                    <label style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>Və ya buraya birbaşa PDF linki (Google Drive, Dropbox və s. URL) yapışdırın...</label>
                    <input 
                      type="text" 
                      name="pdfUrl" 
                      value={formData.pdfUrl || ""} 
                      onChange={handleInputChange} 
                      placeholder="https://drive.google.com/file/d/..." 
                      style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "8px", width: "100%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Üz Qabığı (Şəkil) */}
              <div className="news-form-section">
                <h3 className="news-section-title"><ImageIcon size={20} style={{ color: "#6366f1" }} /> 3. Kitabın Üz Qabığı (Şəkil)</h3>
                <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <button 
                    type="button" 
                    className="news-file-upload-btn" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                  >
                    <Upload size={18} /> 
                    {saving ? "Yüklənir..." : "📁 Cihazdan Qapaq Şəkli Yüklə"}
                  </button>
                  <input 
                    type="text" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    placeholder="Və ya şəkil URL ünvanı..." 
                    style={{ flex: 1, minWidth: "250px", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)" }}
                  />
                  {formData.image && (
                    <img src={formatImageUrl(formData.image)} alt="Cover preview" style={{ width: 50, height: 70, objectFit: "cover", borderRadius: 6, border: "2px solid #6366f1" }} />
                  )}
                </div>
              </div>

              {/* Section 4: Məzmun */}
              <div className="news-form-section">
                <h3 className="news-section-title"><FileText size={20} style={{ color: "#10b981" }} /> 4. Açıqlama və Təsvir</h3>
                <div className="news-form-group" style={{ marginBottom: "1.25rem" }}>
                  <label>Qısa Açıqlama (Kart üzərində görünəcək)</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows="2" 
                    placeholder="Kitabın bəhs etdiyi mövzu haqqında 1-2 cümlə..."
                  ></textarea>
                </div>
                <div className="news-form-group">
                  <label>Geniş Açıqlama (Kitabın ətraflı səhifəsində oxunacaq)</label>
                  <textarea 
                    name="longDescription" 
                    value={formData.longDescription} 
                    onChange={handleInputChange} 
                    rows="4" 
                    placeholder="Kitabın daxilindəki fəsillər, kimlər üçün nəzərdə tutulduğu və faydaları..."
                  ></textarea>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="news-form-footer">
                <button type="button" className="news-reset-btn" onClick={() => setModalOpen(false)}>
                  Ləğv Et
                </button>
                <button type="submit" className="news-submit-btn" style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", boxShadow: "0 8px 20px rgba(239, 68, 68, 0.25)" }} disabled={saving}>
                  <FileText size={18} /> {saving ? "Yadda Saxlanılır..." : "Kitabı Yadda Saxla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
