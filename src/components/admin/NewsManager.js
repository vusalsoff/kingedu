"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, Upload, X, Eye, EyeOff, CheckCircle, RotateCcw, Image as ImageIcon, FileText, Calendar, Tag, Link as LinkIcon, Globe } from "lucide-react";
import Loading from "@/app/loading";
import { formatImageUrl, cleanSheetImageUrl } from "@/lib/imageUrl";
import "./NewsManager.css";
import { useCustomAlert } from "@/context/AlertContext";

export default function NewsManager() {
  const { showAlert, showConfirm } = useCustomAlert();

  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [sectionVisible, setSectionVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, published, draft
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    date: new Date().toLocaleDateString("az-AZ", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "."),
    category: "Ümumi",
    image: "",
    description: "",
    longDescription: "",
    status: "published" // published or draft
  });
  
  const fileInputRef = useRef(null);

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
        const list = d.xeberler || d.Xeberler || d.News || d.news || [];
        setItems(list);

        const s = d.settings || {};
        setSettings(s);

        const isVis = s.news_section_visible !== "false" && s.news_section_visible !== false && s.xeberler_section_visible !== "false" && s.xeberler_section_visible !== false;
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
    const { name, value } = e.target;
    if (name === "title" && (!editingId || !formData.slug)) {
      // Auto-generate slug from title
      const genSlug = value
        .toLowerCase()
        .replace(/ə/g, "e").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ğ/g, "g").replace(/ş/g, "s").replace(/ç/g, "c")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setFormData(prev => ({ ...prev, title: value, slug: genSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

  const toggleSectionVisibility = async () => {
    const newVal = !sectionVisible;
    setSectionVisible(newVal);
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_setting", key: "news_section_visible", value: newVal ? "true" : "false" })
      });
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_setting", key: "xeberler_section_visible", value: newVal ? "true" : "false" })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      date: new Date().toLocaleDateString("az-AZ", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "."),
      category: "Ümumi",
      image: "",
      description: "",
      longDescription: "",
      status: "published"
    });
    setEditingId(null);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title || "",
        slug: item.slug || item.url || item.id || "",
        date: item.date || "",
        category: item.category || "Ümumi",
        image: item.image || "",
        description: item.description || "",
        longDescription: item.longDescription || "",
        status: item.status === "draft" ? "draft" : "published"
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      showAlert("Başlıq və Qısa xülasə sahələrini doldurun!");
      return;
    }
    setSaving(true);
    try {
      const action = editingId ? "update_item" : "add_item";
      const payload = {
        action,
        collection: "News",
        id: editingId || Date.now().toString(),
        item: {
          ...formData,
          createdAt: editingId ? (items.find(x => x.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
          id: editingId || "nws_" + Date.now().toString()
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
    if (!await showConfirm("Bu xəbəri silmək istəyirsiniz?")) return;
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_item", collection: "News", id })
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

  const handleToggleItemVisibility = async (item) => {
    const currentStatus = item.status === "draft" ? "draft" : "published";
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_item",
          collection: "News",
          id: item.id,
          item: { ...item, status: newStatus }
        })
      });
      const result = await res.json();
      if (result.success) {
        setItems(items.map(x => x.id === item.id ? { ...x, status: newStatus } : x));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = !search || 
      (item.title && item.title.toLowerCase().includes(search.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase()));
    
    if (activeFilter === "published") return matchesSearch && item.status !== "draft";
    if (activeFilter === "draft") return matchesSearch && item.status === "draft";
    return matchesSearch;
  });

  return (
    <div className="news-manager">
      <div className="news-header-section">
        <div>
          <h1 className="news-header-title">
            <Globe size={32} style={{ color: 'var(--primary)' }} /> Xəbər yarat və idarə et
          </h1>
          <p className="news-header-subtitle">
            Form sahələri daha aydın qruplaşdırılıb, media hissəsi gücləndirilib və məzmun daxil etmə axını sadələşdirilib. Xəbərlərinizə cədvəl üzərindən tam nəzarət edin.
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
          <button className="news-add-btn" onClick={() => openModal()}>
            <Plus size={20} /> Yeni Xəbər Yarat
          </button>
        </div>
      </div>

      <div className="news-filter-toolbar">
        <div className="news-search-box">
          <Search size={18} className="news-search-icon" />
          <input 
            type="text" 
            placeholder="⌕ Xəbərlərdə axtar..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="news-filter-pills">
          <button 
            type="button" 
            className={`news-filter-pill ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            Hamsı ({items.length})
          </button>
          <button 
            type="button" 
            className={`news-filter-pill ${activeFilter === "published" ? "active" : ""}`}
            onClick={() => setActiveFilter("published")}
          >
            Dərc Edilənlər ({items.filter(x => x.status !== "draft").length})
          </button>
          <button 
            type="button" 
            className={`news-filter-pill ${activeFilter === "draft" ? "active" : ""}`}
            onClick={() => setActiveFilter("draft")}
          >
            Qaralamalar ({items.filter(x => x.status === "draft").length})
          </button>
        </div>
      </div>

      <div className="news-table-card">
        <h3 className="news-table-header-text">Məzmun arxivi / Xəbərlər və idarəetmə cədvəli</h3>
        <p className="news-table-desc">Mövcud xəbərlər daha səliqəli strukturla göstərilir; status, tarix və əməliyyat sahələri daha aydın ayrılır.</p>
        
        {loading ? (
          <Loading embedded={true} />
        ) : (
          <div className="table-responsive">
            <table className="news-table">
              <thead>
                <tr>
                  <th>Media</th>
                  <th>Xəbər</th>
                  <th>Tarix</th>
                  <th>Kateqoriya</th>
                  <th>Status</th>
                  <th>İdarəetmə</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const isDraft = item.status === "draft";
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="news-table-img-wrapper">
                            {item.image ? (
                              <img src={formatImageUrl(item.image)} alt={item.title} className="news-table-img" />
                            ) : (
                              <span className="news-table-no-img">Şəkil yoxdur</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="news-item-title">{item.title}</div>
                          <div className="news-item-summary">{item.description}</div>
                        </td>
                        <td style={{ fontWeight: "600", color: "var(--text-main)" }}>{item.date || "Tarix yoxdur"}</td>
                        <td>
                          <span className="news-badge-cat">{item.category || "Ümumi"}</span>
                        </td>
                        <td>
                          <span className={`news-status-pill ${isDraft ? "draft" : "published"}`}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: isDraft ? "#f59e0b" : "#10b981", display: "inline-block" }}></span>
                            {isDraft ? "Qaralama" : "Dərc edilib"}
                          </span>
                        </td>
                        <td>
                          <div className="news-actions-group">
                            <button 
                              type="button" 
                              className={`news-action-btn vis ${isDraft ? "hidden" : ""}`}
                              onClick={() => handleToggleItemVisibility(item)}
                              title={isDraft ? "Dərc et (Göstər)" : "Qaralamaya keçir (Gizlət)"}
                            >
                              {isDraft ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                      Hələ ki, heç bir xəbər tapılmadı. Yeni xəbər yaratmaq üçün yuxarıdakı "Yeni Xəbər Yarat" düyməsinə klikləyin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating / Editing News */}
      {isModalOpen && (
        <div className="news-modal-overlay">
          <div className="news-modal-content">
            <div className="news-modal-header">
              <h2>{editingId ? "📰 Xəbəri Redaktə Et (Dəyişdir)" : "📰 Yeni Xəbər Yarat"}</h2>
              <button className="news-modal-close" onClick={() => setModalOpen(false)}>
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="news-form-body">
              {/* Section 1: Əsas Məlumatlar */}
              <div className="news-form-section">
                <h3 className="news-section-title"><FileText size={20} style={{ color: "var(--primary)" }} /> 1. Əsas Məlumatlar</h3>
                <div className="news-form-grid-2">
                  <div className="news-form-group">
                    <label>Başlıq</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Məs: iFerm GreenTech III müsabiqəsində uğurla təqdim olundu" 
                    />
                  </div>
                  <div className="news-form-group">
                    <label>Slug / URL (Avtomatik və ya əl ilə)</label>
                    <input 
                      type="text" 
                      name="slug" 
                      value={formData.slug} 
                      onChange={handleInputChange} 
                      placeholder="Məs: iferm-greentech-iii-musabiqesinde-ugur" 
                    />
                  </div>
                  <div className="news-form-group">
                    <label>Tarix</label>
                    <input 
                      type="text" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleInputChange} 
                      placeholder="Məs: 24.04.2026" 
                    />
                  </div>
                  <div className="news-form-group">
                    <label>Kateqoriya</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      <option value="Ümumi">Ümumi</option>
                      <option value="Sərgi">Sərgi</option>
                      <option value="Tədbir">Tədbir</option>
                      <option value="Müsabiqə">Müsabiqə</option>
                      <option value="Elmi-Akademik">Elmi-Akademik</option>
                      <option value="Startap & İnnovasiya">Startap & İnnovasiya</option>
                      <option value="Texnologiya">Texnologiya</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Vizual Media & Önizləmə */}
              <div className="news-form-section">
                <h3 className="news-section-title"><ImageIcon size={20} style={{ color: "#6366f1" }} /> 2. Vizual media və Önizləmə</h3>
                
                <div className="news-advice-box">
                  <strong>📌 Tövsiyə olunan ölçü: 1200×800.</strong> Aydın və keyfiyyətli vizual seçilməsi xəbərin təqdimatını gücləndirir.<br />
                  <strong>💡 Şəkil keyfiyyəti tövsiyəsi:</strong> Kompozisiyası təmiz və mövzuya uyğun vizual seçilməsi xəbərin təqdimat keyfiyyətini artırır. Media sahəsi mobil və desktop görünüş üçün uyğunlaşdırılıb. Böyük ölçülü vizuallar üçün də daha sabit görünüş təmin edilib.
                </div>

                <div className="news-media-preview-area">
                  <div className="news-media-upload-controls">
                    <label style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--text-main)" }}>Şəkil Faylı Yüklə və ya URL yaz:</label>
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
                      {saving ? "Drive-a Yüklənir..." : "📁 Cihazdan Şəkil Seç (Google Drive-a yazır)"}
                    </button>
                    <input 
                      type="text" 
                      name="image" 
                      value={formData.image} 
                      onChange={handleInputChange} 
                      placeholder="Və ya buraya birbaşa şəkil linki (URL) yapışdırın..."
                      style={{ padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", width: "100%", marginTop: "6px" }}
                    />
                    {formData.image && (
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, image: "" }))} 
                        style={{ alignSelf: "flex-start", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Trash2 size={14} /> Şəkli Sil
                      </button>
                    )}
                  </div>

                  <div className={`news-preview-card-box ${formData.image ? "has-image" : ""}`}>
                    {formData.image ? (
                      <div>
                        <img src={formatImageUrl(formData.image)} alt="Preview" className="news-preview-img" />
                        <div style={{ textAlign: "left" }}>
                          <span className="news-badge-cat" style={{ marginBottom: "6px" }}>{formData.category || "Ümumi"}</span>
                          <div style={{ fontWeight: "800", fontSize: "1.1rem", color: "var(--text-main)", marginBottom: "4px" }}>{formData.title || "Xəbər Başlığı"}</div>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>{formData.date}</div>
                          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {formData.description || "Qısa xülasə burda görünəcək..."}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="news-placeholder-icon">🖼️ ✨</div>
                        <div className="news-preview-placeholder-title">Burada şəkil görünəcək</div>
                        <div className="news-preview-placeholder-desc">
                          Media faylı seçildikdən sonra önizləmə avtomatik bu sahədə göstəriləcək. Şəkil yüklənən kimi önizləmə avtomatik yenilənir.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Məzmun */}
              <div className="news-form-section">
                <h3 className="news-section-title"><FileText size={20} style={{ color: "#10b981" }} /> 3. Məzmun</h3>
                <div className="news-form-group" style={{ marginBottom: "1.25rem" }}>
                  <label>Qısa xülasə (Kart üzərində və siyahıda görünəcək qısa mətn)</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows="3" 
                    required 
                    placeholder="Məs: iFerm komandası Azərbaycan Texnologiya Universitetində keçirilən GreenTech III müsabiqəsində layihəsini təqdim edib..."
                  ></textarea>
                </div>
                <div className="news-form-group">
                  <label>Tam məzmun (Xəbərin ətraflı səhifəsinə daxil olduqda oxunan tam mətn)</label>
                  <textarea 
                    name="longDescription" 
                    value={formData.longDescription} 
                    onChange={handleInputChange} 
                    rows="6" 
                    required 
                    placeholder="Xəbərin tam təfərrüatları, iştirakçılar, nəticələr və əlaqəli məlumatlar..."
                  ></textarea>
                </div>
              </div>

              {/* Section 4: Yayım Statusu & Əməliyyatlar */}
              <div className="news-form-section">
                <h3 className="news-section-title"><CheckCircle size={20} style={{ color: "#f59e0b" }} /> 4. Yayım statusu</h3>
                <div className="news-status-toggle-area">
                  <label className={`news-status-option ${formData.status !== "draft" ? "selected" : ""}`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="published" 
                      checked={formData.status !== "draft"} 
                      onChange={() => setFormData(prev => ({ ...prev, status: "published" }))} 
                    />
                    <div className="news-status-label">
                      <strong>✅ Dərc edilsin (Published)</strong>
                      <span>Dərhal saytın Xəbərlər bölməsində hər kəsə göstəriləcək.</span>
                    </div>
                  </label>

                  <label className={`news-status-option ${formData.status === "draft" ? "selected" : ""}`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="draft" 
                      checked={formData.status === "draft"} 
                      onChange={() => setFormData(prev => ({ ...prev, status: "draft" }))} 
                    />
                    <div className="news-status-label">
                      <strong>📝 Qaralama (Draft)</strong>
                      <span>Yalnız admin paneldə qalacaq, saytda istifadəçilərə görünməyəcək.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="news-form-footer">
                <button type="button" className="news-reset-btn" onClick={resetForm} disabled={saving}>
                  <RotateCcw size={18} /> Formu sıfırla
                </button>
                <button type="submit" className="news-submit-btn" disabled={saving}>
                  <CheckCircle size={18} /> {saving ? "Yadda Saxlanılır..." : "Təsdiqlə və paylaş"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
