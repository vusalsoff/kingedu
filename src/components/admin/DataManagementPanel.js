"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2, Eye, EyeOff, X, Save, Image as ImageIcon } from "lucide-react";
import imageCompression from 'browser-image-compression';
import { useCustomAlert } from "@/context/AlertContext";

export default function DataManagementPanel({ title, sheetName, data, fields, onRefresh }) {
  const { showAlert, showConfirm } = useCustomAlert();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      const initial = {};
      fields.forEach(f => {
        initial[f.key] = f.type === 'boolean' ? true : "";
      });
      setFormData(initial);
    }
    setModalOpen(true);
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        handleChange(key, reader.result);
      };
    } catch (error) {
      console.error("Şəkil yükləmə xətası:", error);
      showAlert("Şəkil yüklənərkən xəta baş verdi.");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const action = editingItem ? "update" : "add";
      const payload = { action, sheetName, data: formData };
      if (editingItem) payload.id = editingItem.id;

      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (result.success) {
        setModalOpen(false);
        showAlert(editingItem ? "Məzmun uğurla yeniləndi!" : "Məzmun uğurla əlavə edildi!", "success");
        if (onRefresh) onRefresh();
      } else {
        showAlert("Xəta baş verdi: " + (result.message || "Bilinməyən xəta"));
      }
    } catch (error) {
      console.error(error);
      showAlert("Xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!await showConfirm("Bu elementi silmək istədiyinizə əminsiniz?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", sheetName, id })
      });
      const result = await res.json();
      if (result.success) {
        showAlert("Məzmun uğurla silindi!", "success");
        if (onRefresh) onRefresh();
      } else {
        showAlert("Silinmədi: " + result.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!await showConfirm("BÜTÜN elementləri silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarılmır!")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_all", sheetName })
      });
      const result = await res.json();
      if (result.success) {
        showAlert("Bütün məzmun uğurla silindi!", "success");
        if (onRefresh) onRefresh();
      } else {
        showAlert("Silinmədi: " + result.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (item) => {
    const isVisible = item.visible !== false && item.visible !== "false";
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", sheetName, id: item.id, data: { ...item, visible: !isVisible } })
      });
      const result = await res.json();
      if (result.success) {
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)", marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "15px" }}>
        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>{title}</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => handleOpenModal()} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--primary)", color: "white", padding: "0.6rem 1.2rem", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 600 }}>
            <PlusCircle size={18} /> Yeni Əlavə Et
          </button>
          {items.length > 0 && (
            <button onClick={handleDeleteAll} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.6rem 1.2rem", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.2)", cursor: "pointer", fontWeight: 600 }}>
              <Trash2 size={18} /> Hamısını Sil
            </button>
          )}
        </div>
      </div>

      {loading && <p style={{ color: "var(--primary)", fontWeight: 600 }}>Gözləyin, əməliyyat icra olunur...</p>}

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
              <th style={{ padding: "1rem 0.5rem" }}>Şəkil</th>
              <th style={{ padding: "1rem 0.5rem" }}>Başlıq</th>
              {fields.some(f => f.key === 'price') && <th style={{ padding: "1rem 0.5rem" }}>Qiymət</th>}
              {fields.some(f => f.key === 'date') && <th style={{ padding: "1rem 0.5rem" }}>Tarix</th>}
              <th style={{ padding: "1rem 0.5rem", textAlign: "center", whiteSpace: "nowrap" }}>Göstərilir</th>
              <th style={{ padding: "1rem 0.5rem", textAlign: "right", whiteSpace: "nowrap" }}>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item.id || idx} style={{ borderBottom: "1px solid var(--border-color)", transition: "all 0.2s" }}>
                <td style={{ padding: "1rem 0.5rem" }}>
                  {item.image ? <img src={item.image} alt={item.title} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} /> : <div style={{ width: "50px", height: "50px", background: "var(--bg-color)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><ImageIcon size={20} opacity={0.5} /></div>}
                </td>
                <td style={{ padding: "1rem 0.5rem", fontWeight: 600 }}>{item.title || item.question}</td>
                {fields.some(f => f.key === 'price') && <td style={{ padding: "1rem 0.5rem" }}>{item.price || "-"}</td>}
                {fields.some(f => f.key === 'date') && <td style={{ padding: "1rem 0.5rem" }}>{item.date || "-"}</td>}
                <td style={{ padding: "1rem 0.5rem", textAlign: "center", whiteSpace: "nowrap" }}>
                  <button onClick={() => toggleVisibility(item)} style={{ background: "transparent", border: "none", cursor: "pointer", color: (item.visible !== false && item.visible !== "false") ? "#10b981" : "#ef4444" }}>
                    {(item.visible !== false && item.visible !== "false") ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </td>
                <td style={{ padding: "1rem 0.5rem", textAlign: "right", whiteSpace: "nowrap" }}>
                  <button onClick={() => handleOpenModal(item)} style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", border: "none", padding: "0.5rem", borderRadius: "8px", cursor: "pointer", marginRight: "10px" }} title="Redaktə et">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", padding: "0.5rem", borderRadius: "8px", cursor: "pointer" }} title="Sil">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Hələ heç bir məlumat əlavə edilməyib.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "var(--bg-alt)", width: "100%", maxWidth: "600px", borderRadius: "20px", padding: "2rem", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{editingItem ? "Redaktə Et" : "Yeni Əlavə Et"}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: "transparent", border: "none", color: "var(--text-main)", cursor: "pointer" }}><X size={24} /></button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {fields.map((f, i) => (
                <div key={i}>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontSize: "0.9rem", fontWeight: 600, opacity: 0.8 }}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea 
                      value={formData[f.key] || ""} 
                      onChange={(e) => handleChange(f.key, e.target.value)} 
                      rows="3"
                      style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }}
                    />
                  ) : f.type === 'image' ? (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, f.key)} 
                        style={{ padding: "0.5rem" }}
                      />
                      {formData[f.key] && <img src={formData[f.key]} alt="Preview" style={{ height: "40px", borderRadius: "5px" }} />}
                    </div>
                  ) : f.type === 'boolean' ? (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input 
                        type="checkbox" 
                        checked={formData[f.key] !== false && formData[f.key] !== "false"} 
                        onChange={(e) => handleChange(f.key, e.target.checked)} 
                        style={{ width: "20px", height: "20px", accentColor: "var(--primary)", cursor: "pointer" }}
                      />
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={formData[f.key] || ""} 
                      onChange={(e) => handleChange(f.key, e.target.value)} 
                      style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "2rem" }}>
              <button onClick={() => setModalOpen(false)} style={{ background: "transparent", color: "var(--text-main)", border: "1px solid var(--border-color)", padding: "0.8rem 1.5rem", borderRadius: "12px", cursor: "pointer", fontWeight: 600 }}>Ləğv Et</button>
              <button onClick={handleSave} disabled={loading} style={{ background: "var(--primary)", color: "white", border: "none", padding: "0.8rem 1.5rem", borderRadius: "12px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                {loading ? "Gözləyin..." : <><Save size={18} /> Yadda Saxla</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
