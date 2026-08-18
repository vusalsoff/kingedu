"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, Upload, X, Eye, EyeOff } from "lucide-react";
import imageCompression from 'browser-image-compression';
import Loading from "@/app/loading";
import { formatImageUrl, cleanSheetImageUrl } from "@/lib/imageUrl";
import "./EntityManager.css";
import { useCustomAlert } from "@/context/AlertContext";

export default function EntityManager({ title, collection }) {
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
    title: "", instructor: "", duration: "", price: "", date: "", 
    description: "", longDescription: "", image: "", pdfUrl: "", curriculum: "",
    videoUrl: "", certificateUrl: "", createdAt: ""
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
        const list = d[collection] 
          || d[collection.toLowerCase()]
          || (collection === 'Courses' ? (d.kurslar || d.Courses || d.courses) : null)
          || (collection === 'Books' ? (d.kitablarimiz || d.kitablar || d.Books || d.books) : null)
          || (collection === 'Marathons' ? (d.marafonlar || d.Marathons || d.marathons) : null)
          || (collection === 'Trainings' ? (d.telimler || d.Trainings || d.trainings) : null)
          || (collection === 'News' ? (d.xeberler || d.Xeberler || d.News || d.news) : null)
          || (collection === 'Campaigns' ? (d.kampaniyalar || d.Kampaniyalar || d.Campaigns || d.campaigns) : null)
          || (collection === 'PdfBooks' ? (d.pdfKitablar || d.pdf_kitablar || d.PdfKitablar || d.pdfBooks || d.Pdfbooks || d.pdfkitablar) : null)
          || [];
        setItems(list);

        const s = d.settings || {};
        setSettings(s);

        const secKeyEng = `${collection}_section_visible`;
        const azName = title.toLowerCase().replace("larımız", "lar").replace("lərimiz", "lər");
        const secKeyAz = `${azName}_section_visible`;

        const isVis = s[secKeyEng] !== "false" && s[secKeyEng] !== false && s[secKeyAz] !== "false" && s[secKeyAz] !== false;
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
  }, [collection]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    try {
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1200,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.replace(/^data:.+;base64,/, "");
        
        try {
          const res = await fetch("/api/admin/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              action: "upload_image", 
              base64: base64String, 
              mimeType: compressedFile.type 
            })
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
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error(error);
      setSaving(false);
      showAlert("Şəkil sıxılarkən xəta oldu.");
    }
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
          body: JSON.stringify({ 
            action: "upload_image", 
            base64: base64String, 
            mimeType: file.type || "application/pdf" 
          })
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
    const secKeyEng = `${collection}_section_visible`;
    const azName = title.toLowerCase().replace("larımız", "lar").replace("lərimiz", "lər");
    const secKeyAz = `${azName}_section_visible`;

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_setting", key: secKeyEng, value: String(newVal) })
      });
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_setting", key: secKeyAz, value: String(newVal) })
      });
      showAlert(`Bütün ${title} bölməsi saytda ${newVal ? "GÖSTƏRİLİR 👁️" : "GİZLƏDİLDİ 🚫"}`);
    } catch (err) {
      console.error(err);
      showAlert("Statusu dəyişərkən xəta oldu!");
    }
  };

  const toggleItemVisibility = async (item) => {
    const visKey = `visibility_${collection}_${item.id}`;
    const currentVis = settings[visKey] !== "false" && settings[visKey] !== false && item.visible !== false && item.visible !== "false" && item.status !== "gizli";
    const newVal = !currentVis;

    setSettings(prev => ({ ...prev, [visKey]: String(newVal) }));
    
    // Update locally in items array too
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, visible: newVal, status: newVal ? "aktiv" : "gizli" } : i));

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_setting", key: visKey, value: String(newVal) })
      });
    } catch (err) {
      console.error(err);
      showAlert("Elementin görünürlüyü yadda saxlanılarkən xəta oldu!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const curriculumArray = formData.curriculum 
      ? formData.curriculum.split("\n").filter(c => c.trim() !== "")
      : [];
      
    let itemPayload = { 
      ...formData, 
      id: editingId || Date.now().toString(),
      image: cleanSheetImageUrl(formData.image) || formData.image,
      pdfUrl: cleanSheetImageUrl(formData.pdfUrl) || formData.pdfUrl || "",
      videoUrl: formData.videoUrl || "",
      certificateUrl: formData.certificateUrl || "",
      curriculum: curriculumArray,
      createdAt: formData.createdAt || new Date().toISOString()
    };

    if (collection === "Leadership" || collection === "Rəhbərlik") {
      itemPayload.name = formData.title;
      itemPayload.role = formData.instructor;
    }

    try {
      let updated = false;
      if (editingId) {
        // Try update_item first so row updates in place without losing position
        const updateRes = await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_item", collection, id: editingId, item: itemPayload })
        });
        const updateJson = await updateRes.json();
        if (updateJson.success) {
          updated = true;
        }
      }
      
      if (!updated) {
        if (editingId) {
          await fetch("/api/admin/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete_item", collection, id: editingId })
          });
        }
        
        await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add_item", collection, item: itemPayload })
        });
      }
      
      setModalOpen(false);
      fetchItems();
      showAlert(editingId ? "Məlumat uğurla yeniləndi (Update)!" : "Yeni məlumat uğurla əlavə edildi!");
    } catch (err) {
      console.error(err);
      showAlert("Yadda saxlayarkən xəta oldu!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!await showConfirm("Bu məlumatı tamamilə silmək (Delete) istədiyinizə əminsiniz?")) return;
    
    setLoading(true);
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_item", collection, id })
      });
      fetchItems();
      showAlert("Məlumat silindi!");
    } catch (err) {
      console.error(err);
      setLoading(false);
      showAlert("Silərkən xəta oldu!");
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title || item.name || "",
        instructor: item.instructor || item.role || "",
        duration: item.duration || "",
        price: item.price || "",
        date: item.date || "",
        description: item.description || "",
        longDescription: item.longDescription || "",
        image: item.image || "",
        pdfUrl: item.pdfUrl || "",
        videoUrl: item.videoUrl || "",
        certificateUrl: item.certificateUrl || "",
        curriculum: Array.isArray(item.curriculum) ? item.curriculum.join("\n") : "",
        createdAt: item.createdAt || ""
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "", instructor: "", duration: "", price: "", date: "", 
        description: "", longDescription: "", image: "", pdfUrl: "", curriculum: "",
        videoUrl: "", certificateUrl: "", createdAt: ""
      });
    }
    setModalOpen(true);
  };

  const filteredItems = items.filter(i => 
    (i.title || i.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="entity-manager">
      <div className="manager-header">
        <div>
          <h1 className="manager-title">{title} İdarəetməsi</h1>
          <p className="manager-subtitle">Sistemdəki bütün {title.toLowerCase()} məlumatlarını buradan əlavə edə, yeniləyə, silə və ya gizlədə bilərsiniz.</p>
        </div>
        <button className="add-btn" onClick={() => openModal()}>
          <Plus size={20} /> Yeni Əlavə Et
        </button>
      </div>

      {/* Section Show / Hide Toggle Card */}
      <div className="section-toggle-card" style={{ borderLeft: sectionVisible ? '5px solid #10b981' : '5px solid #ef4444' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Bütöv Bölmə Statusu:
            <span style={{ fontSize: '0.85rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: sectionVisible ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: sectionVisible ? '#10b981' : '#ef4444', fontWeight: '700' }}>
              {sectionVisible ? "SAYTDA GÖSTƏRİLİR 👁️" : "GİZLƏDİLB (TEMPORARY HIDDEN) 🚫"}
            </span>
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Bu düymə ilə bütöv {title.toLowerCase()} səhifəsini saytda aktiv/qeyri-aktiv edə bilərsiniz.
          </p>
        </div>
        <button 
          type="button"
          onClick={toggleSectionVisibility}
          style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', background: sectionVisible ? '#fff1f2' : '#ecfdf5', color: sectionVisible ? '#e11d48' : '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          {sectionVisible ? <><EyeOff size={18} /> Bütöv Bölməni Gizlət (Hide)</> : <><Eye size={18} /> Bütöv Bölməni Göstər (Show)</>}
        </button>
      </div>

      <div className="manager-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Axtarış..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Cəmi: <strong>{filteredItems.length}</strong> element
        </div>
      </div>

      {loading ? (
        <Loading embedded={true} />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Şəkil</th>
                <th>Başlıq</th>
                <th>Təlimçi / Müəllif</th>
                <th>Müddət / Qiymət</th>
                <th>Tarix</th>
                <th>Əməliyyatlar (Show/Hide | Update | Delete)</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const visKey = `visibility_${collection}_${item.id}`;
                const isItemVis = settings[visKey] !== "false" && settings[visKey] !== false && item.visible !== false && item.visible !== "false" && item.status !== "gizli";

                return (
                  <tr key={item.id} style={{ opacity: isItemVis ? 1 : 0.55, background: isItemVis ? 'transparent' : 'rgba(239, 68, 68, 0.03)' }}>
                    <td>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: isItemVis ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isItemVis ? '#10b981' : '#ef4444', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        {isItemVis ? "Göstərilir 👁️" : "Gizlədilib 🚫"}
                      </span>
                    </td>
                    <td>
                      {item.image ? (
                        <img src={formatImageUrl(item.image)} alt={item.title} className="table-img" />
                      ) : (
                        <div className="no-img">Yoxdur</div>
                      )}
                    </td>
                    <td className="font-semibold" style={{ maxWidth: '220px' }}>
                      {item.title || item.name}
                      {item.pdfUrl && (
                        <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                          <a href={item.pdfUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>📄 PDF Linkinə Bax</a>
                        </div>
                      )}
                    </td>
                    <td>{item.instructor || item.role}</td>
                    <td>{item.duration || "-"} / {item.price || "-"}</td>
                    <td>{item.date || "-"}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          type="button"
                          className={`vis-btn ${!isItemVis ? 'hidden-state' : ''}`} 
                          onClick={() => toggleItemVisibility(item)}
                          title={isItemVis ? "Gizlət (Hide)" : "Göstər (Show)"}
                        >
                          {isItemVis ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button 
                          type="button"
                          className="edit-btn" 
                          onClick={() => openModal(item)}
                          title="Dəyiş / Yenilə (Update)"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          type="button"
                          className="delete-btn" 
                          onClick={() => handleDelete(item.id)}
                          title="Sil (Delete)"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-muted">
                    Heç bir məlumat tapılmadı. "Yeni Əlavə Et" düyməsindən ilk məlumatı əlavə edin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? "Məlumatı Yenilə / Redaktə Et (Update)" : "Yeni Əlavə Et (Add New)"}</h2>
              <button className="close-btn" onClick={() => setModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Başlıq / Ad</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Məs: Qrafik Dizayn Kursu" />
                </div>
                <div className="form-group">
                  <label>Təlimçi (Müəllif / Spiker)</label>
                  <input type="text" name="instructor" value={formData.instructor} onChange={handleInputChange} required placeholder="Məs: Mirfəqan Hacıyev" />
                </div>
                <div className="form-group">
                  <label>Müddət / Həcm</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="Məs: 3 Ay və ya 250 səhifə" />
                </div>
                <div className="form-group">
                  <label>Qiymət</label>
                  <input type="text" name="price" value={formData.price} onChange={handleInputChange} placeholder="Məs: 40 AZN / 15 AZN / Ödənişsiz" />
                </div>
                <div className="form-group">
                  <label>Tarix / Vəziyyət</label>
                  <input type="text" name="date" value={formData.date} onChange={handleInputChange} placeholder="Məs: 1 Sentyabr və ya Satışda / Aktiv" />
                </div>
              </div>

              <div className="form-group mt-4">
                <label>Qısa Açıqlama (Kart üzərində görünəcək)</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" required placeholder="Kurs və ya kitab haqqında qısa məlumat..."></textarea>
              </div>

              <div className="form-group mt-4">
                <label>Geniş Açıqlama (Ətraflı səhifəsinə daxil olanda görünəcək)</label>
                <textarea name="longDescription" value={formData.longDescription} onChange={handleInputChange} rows="4" required placeholder="Ətraflı, geniş açıqlama və üstünlüklər..."></textarea>
              </div>

              <div className="form-group mt-4">
                <label>Nələr əldə edəcəksiniz? / Kurikulum (Hər sətirə 1 mövzu və ya fəsil yazın)</label>
                <textarea name="curriculum" value={formData.curriculum} onChange={handleInputChange} rows="4" placeholder="1. Giriş və Əsas Anlayışlar&#10;2. Praktiki Məşğələlər&#10;3. Final Layihəsi"></textarea>
              </div>

              {(collection === "Courses" || collection === "Trainings" || collection === "Marathons") && (
                <div className="form-grid mt-4">
                  <div className="form-group">
                    <label>Video Linki (YouTube / Vimeo)</label>
                    <input type="text" name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="Məs: https://youtube.com/watch?v=..." />
                  </div>
                  <div className="form-group">
                    <label>Sertifikat Linki (Əgər varsa)</label>
                    <input type="text" name="certificateUrl" value={formData.certificateUrl} onChange={handleInputChange} placeholder="Məs: https://drive.google.com/..." />
                  </div>
                </div>
              )}

              <div className="form-group mt-4">
                <label>Şəkil Yüklə (Və ya Link yaz)</label>
                <div className="image-upload-area">
                  {formData.image && (
                    <div className="preview-img-container">
                      <img src={formatImageUrl(formData.image)} alt="Preview" className="preview-img" />
                      <button type="button" className="remove-img-btn" onClick={() => setFormData({...formData, image: ""})}>Sil</button>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <button 
                    type="button" 
                    className="upload-btn" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                  >
                    <Upload size={18} /> 
                    {saving ? "Drive-a Yüklənir..." : "Cihazdan Şəkil Seç (Google Drive-a yazır)"}
                  </button>
                </div>
                <input 
                  type="text" 
                  name="image" 
                  value={formData.image} 
                  onChange={handleInputChange} 
                  placeholder="Və ya buraya birbaşa şəkil linki (URL) yapışdırın..."
                  style={{ marginTop: '0.75rem', width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>Ləğv et</button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Yadda saxlanılır..." : "Yadda Saxla (Save)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
