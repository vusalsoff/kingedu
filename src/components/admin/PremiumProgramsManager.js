"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, Upload, X, Eye, EyeOff } from "lucide-react";
import Loading from "@/app/loading";
import { formatImageUrl, cleanSheetImageUrl } from "@/lib/imageUrl";
import "./PremiumProgramsManager.css";
import { useCustomAlert } from "@/context/AlertContext";

export default function PremiumProgramsManager({ title, collection }) {
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
    title: "", shortDescription: "", description: "", price: "", oldPrice: "",
    discount: "", category: "", image: "", status: "Aktiv", sortOrder: "0"
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
        const list = d.PremiumPrograms || d.premiumPrograms || [];
        setItems(list);
        setSettings(d.settings || {});
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
            mimeType: file.type 
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
    reader.readAsDataURL(file);
  };

  const toggleItemVisibility = async (item) => {
    const visKey = `visibility_${collection}_${item.id}`;
    const currentVis = item.visible !== false && item.visible !== "false" && settings[visKey] !== "false";
    const newVal = !currentVis;

    setItems(prev => prev.map(i => i.id === item.id ? { ...i, visible: newVal } : i));
    setSettings(prev => ({ ...prev, [visKey]: String(newVal) }));

    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_setting", key: visKey, value: String(newVal) })
      });
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_item", collection, id: item.id, item: { visible: newVal } })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
      
    const itemPayload = { 
      ...formData, 
      id: editingId || Date.now().toString(),
      image: cleanSheetImageUrl(formData.image) || formData.image,
    };

    try {
      if (editingId) {
        await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_item", collection, id: editingId, item: itemPayload })
        });
      } else {
        await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add_item", collection, item: itemPayload })
        });
      }
      
      setModalOpen(false);
      fetchItems();
      showAlert(editingId ? "Yeniləndi!" : "Əlavə edildi!");
    } catch (err) {
      console.error(err);
      showAlert("Xəta oldu!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!await showConfirm("Bu proqramı silmək istədiyinizə əminsiniz?")) return;
    try {
      await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_item", collection, id })
      });
      setItems(items.filter(i => i.id !== id));
      showAlert("Silindi!");
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title || "",
        shortDescription: item.shortDescription || "",
        description: item.description || "",
        price: item.price || "",
        oldPrice: item.oldPrice || "",
        discount: item.discount || "",
        category: item.category || "",
        image: item.image || item.imageUrl || "",
        status: item.status || "Aktiv",
        sortOrder: item.sortOrder || "0"
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "", shortDescription: "", description: "", price: "", oldPrice: "",
        discount: "", category: "", image: "", status: "Aktiv", sortOrder: "0"
      });
    }
    setModalOpen(true);
  };

  const filteredItems = items.filter(i => 
    (i.title || "").toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));

  return (
    <div className="entity-manager">
      <div className="manager-header">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder={`${title} axtar...`} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="add-new-btn" onClick={() => openModal()}>
          <Plus size={18} /> Yeni Əlavə Et
        </button>
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
                <th>Ad</th>
                <th>Kateqoriya</th>
                <th>Qiymət (Yeni / Köhnə)</th>
                <th>Sıra</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const visKey = `visibility_${collection}_${item.id}`;
                const isItemVis = item.visible !== false && item.visible !== "false" && settings[visKey] !== "false";

                return (
                  <tr key={item.id} style={{ opacity: isItemVis ? 1 : 0.55 }}>
                    <td>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: isItemVis ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: isItemVis ? '#10b981' : '#ef4444' }}>
                        {isItemVis ? "Aktiv 👁️" : "Gizli 🚫"}
                      </span>
                    </td>
                    <td>
                      {item.image ? (
                        <img src={formatImageUrl(item.image)} alt={item.title} className="table-img" />
                      ) : (
                        <div className="no-img">Yoxdur</div>
                      )}
                    </td>
                    <td className="font-semibold">{item.title}</td>
                    <td>{item.category || "-"}</td>
                    <td>{item.price || "-"} / {item.oldPrice ? <strike>{item.oldPrice}</strike> : "-"}</td>
                    <td>{item.sortOrder || "0"}</td>
                    <td>
                      <div className="action-buttons">
                        <button type="button" className={`vis-btn ${!isItemVis ? 'hidden-state' : ''}`} onClick={() => toggleItemVisibility(item)}>
                          {isItemVis ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button type="button" className="edit-btn" onClick={() => openModal(item)}>
                          <Edit2 size={16} />
                        </button>
                        <button type="button" className="delete-btn" onClick={() => handleDelete(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8">Heç bir proqram tapılmadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? "Proqramı Yenilə" : "Yeni Proqram Əlavə Et"}</h2>
              <button className="close-btn" onClick={() => setModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Proqramın Adı</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Kateqoriya</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Məs: Dizayn, Ofis" />
                </div>
                <div className="form-group">
                  <label>Hazırki Qiymət</label>
                  <input type="text" name="price" value={formData.price} onChange={handleInputChange} required placeholder="Məs: 15 AZN" />
                </div>
                <div className="form-group">
                  <label>Köhnə Qiymət</label>
                  <input type="text" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} placeholder="Məs: 30 AZN" />
                </div>
                <div className="form-group">
                  <label>Endirim Etiketi (%)</label>
                  <input type="text" name="discount" value={formData.discount} onChange={handleInputChange} placeholder="Məs: 50%" />
                </div>
                <div className="form-group">
                  <label>Sıralama (Sort Order)</label>
                  <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group mt-4">
                <label>Qısa Açıqlama (Karta çıxan)</label>
                <textarea name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} rows="2" required></textarea>
              </div>

              <div className="form-group mt-4">
                <label>Geniş Açıqlama (Daxil olanda)</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required></textarea>
              </div>

              <div className="form-group mt-4">
                <label>Şəkil Yüklə</label>
                <div className="image-upload-area">
                  {formData.image && (
                    <div className="preview-img-container">
                      <img src={formatImageUrl(formData.image)} alt="Preview" className="preview-img" />
                      <button type="button" className="remove-img-btn" onClick={() => setFormData({...formData, image: ""})}>Sil</button>
                    </div>
                  )}
                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload} />
                  <button type="button" className="upload-btn" onClick={() => fileInputRef.current?.click()} disabled={saving}>
                    <Upload size={18} /> Cihazdan Seç
                  </button>
                </div>
                <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="Və ya URL yapışdırın" style={{ marginTop: '0.75rem', width: '100%', padding: '0.6rem' }} />
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>Ləğv et</button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Yadda saxlanılır..." : "Yadda Saxla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
