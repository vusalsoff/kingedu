"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, Upload, X, Eye, EyeOff, Sparkles, Calendar, Tag, Image as ImageIcon, FileText } from "lucide-react";
import Loading from "@/app/loading";
import { formatImageUrl, cleanSheetImageUrl } from "@/lib/imageUrl";
import "./NewsManager.css";
import { useCustomAlert } from "@/context/AlertContext";

export default function CampaignsManager() {
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
    instructor: "", // Used as Old Price or Badge text
    price: "",      // Used as New Price / Discount Price
    duration: "",   // Used as End Date / Duration
    date: new Date().toLocaleDateString("az-AZ"),
    image: "",
    description: "",
    longDescription: ""
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
        const list = d.kampaniyalar || d.Kampaniyalar || d.Campaigns || d.campaigns || [];
        setItems(list);

        const s = d.settings || {};
        setSettings(s);

        const isVis = s.campaigns_section_visible !== "false" && s.campaigns_section_visible !== false && s.kampaniyalar_section_visible !== "false" && s.kampaniyalar_section_visible !== false;
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

  const toggleSectionVisibility = async () => {
    const newVal = !sectionVisible;
    setSectionVisible(newVal);
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_setting", key: "campaigns_section_visible", value: newVal ? "true" : "false" })
      });
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_setting", key: "kampaniyalar_section_visible", value: newVal ? "true" : "false" })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      instructor: "",
      price: "",
      duration: "",
      date: new Date().toLocaleDateString("az-AZ"),
      image: "",
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
        price: item.price || "",
        duration: item.duration || "",
        date: item.date || "",
        image: item.image || "",
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
    if (!formData.title || !formData.description) {
      showAlert("Kampaniyanın Adı və Qısa xülasəsini daxil edin!");
      return;
    }
    setSaving(true);
    try {
      const action = editingId ? "update_item" : "add_item";
      const payload = {
        action,
        collection: "Campaigns",
        id: editingId || Date.now().toString(),
        item: {
          ...formData,
          createdAt: editingId ? (items.find(x => x.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
          id: editingId || "cmp_" + Date.now().toString()
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
    if (!await showConfirm("Bu kampaniyanı silmək istəyirsiniz?")) return;
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_item", collection: "Campaigns", id })
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
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="news-manager">
      <div className="news-header-section">
        <div>
          <h1 className="news-header-title">
            <Sparkles size={32} style={{ color: '#f59e0b' }} /> Kampaniyalar İdarəetməsi (Xüsusi Bölmə)
          </h1>
          <p className="news-header-subtitle">
            Buradan iştirakçılar üçün xüsusi endirimli kampaniyalar, hədiyyəli paketlər və vaxtı məhdud təkliflər yaradıb idarə edə bilərsiniz. Kampaniyanın köhnə və yeni qiymətlərini qeyd etməklə cəlbediciliyi artırın.
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
          <button className="news-add-btn" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 8px 20px rgba(245, 158, 11, 0.25)" }} onClick={() => openModal()}>
            <Plus size={20} /> Yeni Kampaniya Yarat
          </button>
        </div>
      </div>

      <div className="news-filter-toolbar">
        <div className="news-search-box">
          <Search size={18} className="news-search-icon" />
          <input 
            type="text" 
            placeholder="⌕ Kampaniyalarda axtar..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "600" }}>
          Cəmi: <strong>{filteredItems.length}</strong> Kampaniya
        </div>
      </div>

      <div className="news-table-card">
        <h3 className="news-table-header-text">Məzmun arxivi / Endirimli Kampaniyalar cədvəli</h3>
        <p className="news-table-desc">Aktiv olan kampaniyalar saytın müvafiq bölməsində istifadəçilərə nümayiş olunur.</p>
        
        {loading ? (
          <Loading embedded={true} />
        ) : (
          <div className="table-responsive">
            <table className="news-table">
              <thead>
                <tr>
                  <th>Media</th>
                  <th>Kampaniya Adı</th>
                  <th>Köhnə Qiymət / Qeyd</th>
                  <th>Endirimli Qiymət</th>
                  <th>Bitmə Tarixi</th>
                  <th>İdarəetmə</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
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
                      <td style={{ textDecoration: "line-through", color: "var(--text-muted)", fontWeight: "600" }}>{item.instructor || "-"}</td>
                      <td style={{ fontWeight: "800", color: "#10b981", fontSize: "1.05rem" }}>{item.price || "Pulsuz"}</td>
                      <td style={{ color: "var(--primary)", fontWeight: "600" }}>{item.duration || "Müddətsiz"}</td>
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
                      Hələ ki, heç bir kampaniya tapılmadı. Yuxarıdakı "Yeni Kampaniya Yarat" düyməsi ilə ilk təklifinizi əlavə edin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating / Editing Campaigns */}
      {isModalOpen && (
        <div className="news-modal-overlay">
          <div className="news-modal-content">
            <div className="news-modal-header">
              <h2>{editingId ? "✨ Kampaniyanı Redaktə Et" : "✨ Yeni Kampaniya Yarat"}</h2>
              <button className="news-modal-close" onClick={() => setModalOpen(false)}>
                <X size={22} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="news-form-body">
              {/* Section 1: Əsas Məlumatlar */}
              <div className="news-form-section">
                <h3 className="news-section-title"><Sparkles size={20} style={{ color: "#f59e0b" }} /> 1. Kampaniya şərtləri və qiymətlər</h3>
                <div className="news-form-grid-2">
                  <div className="news-form-group">
                    <label>Kampaniyanın Adı / Başlığı</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Məs: Yay Mövsümü üçün 50% Endirim Kampaniyası" 
                    />
                  </div>
                  <div className="news-form-group">
                    <label>Bitmə Tarixi / Müddət</label>
                    <input 
                      type="text" 
                      name="duration" 
                      value={formData.duration} 
                      onChange={handleInputChange} 
                      placeholder="Məs: 31 Avqustadək və ya 15 Gün" 
                    />
                  </div>
                  <div className="news-form-group">
                    <label>Köhnə Qiymət (və ya Endirim Faizi)</label>
                    <input 
                      type="text" 
                      name="instructor" 
                      value={formData.instructor} 
                      onChange={handleInputChange} 
                      placeholder="Məs: 200 AZN və ya 30% Endirim" 
                    />
                  </div>
                  <div className="news-form-group">
                    <label>Yeni Endirimli Qiymət</label>
                    <input 
                      type="text" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                      placeholder="Məs: 99 AZN və ya Ödənişsiz" 
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Vizual Media */}
              <div className="news-form-section">
                <h3 className="news-section-title"><ImageIcon size={20} style={{ color: "#6366f1" }} /> 2. Vizual Media (Şəkil)</h3>
                <div className="news-advice-box">
                  <strong>📌 Tövsiyə olunan ölçü: 1200×800.</strong> Cəlbedici kampaniya baneri seçilməsi qeydiyyat sayını dəfələrlə artırır.
                </div>
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
                    {saving ? "Yüklənir..." : "📁 Cihazdan Baner Şəkli Yüklə"}
                  </button>
                  <input 
                    type="text" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    placeholder="Və ya baner şəkli URL ünvanı..." 
                    style={{ flex: 1, minWidth: "250px", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)" }}
                  />
                  {formData.image && (
                    <img src={formatImageUrl(formData.image)} alt="Preview" style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 6, border: "2px solid #f59e0b" }} />
                  )}
                </div>
              </div>

              {/* Section 3: Məzmun */}
              <div className="news-form-section">
                <h3 className="news-section-title"><FileText size={20} style={{ color: "#10b981" }} /> 3. Açıqlama və Şərtlər</h3>
                <div className="news-form-group" style={{ marginBottom: "1.25rem" }}>
                  <label>Qısa Xülasə (Kart üzərində görünəcək cəlbedici mətn)</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows="2" 
                    required 
                    placeholder="Məs: Bütün IT və xarici dil kurslarına ilkin ödənişsiz qoşulma imkanı..."
                  ></textarea>
                </div>
                <div className="news-form-group">
                  <label>Geniş Şərtlər (Kampaniyaya kimlərin qoşula biləcəyi və üstünlüklər)</label>
                  <textarea 
                    name="longDescription" 
                    value={formData.longDescription} 
                    onChange={handleInputChange} 
                    rows="4" 
                    placeholder="Kampaniyanın tam qaydaları, əhatə etdiyi istiqamətlər və əlaqə məlumatları..."
                  ></textarea>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="news-form-footer">
                <button type="button" className="news-reset-btn" onClick={() => setModalOpen(false)}>
                  Ləğv Et
                </button>
                <button type="submit" className="news-submit-btn" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", boxShadow: "0 8px 20px rgba(245, 158, 11, 0.25)" }} disabled={saving}>
                  <Sparkles size={18} /> {saving ? "Yadda Saxlanılır..." : "Kampaniyanı Yadda Saxla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
