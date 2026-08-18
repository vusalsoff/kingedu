"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X, Eye, EyeOff } from "lucide-react";
import Loading from "@/app/loading";
import "./PremiumProgramsManager.css"; // Reuse the same CSS since layout is identical
import { useCustomAlert } from "@/context/AlertContext";

export default function PremiumPackagesManager({ title, collection }) {
  const { showAlert, showConfirm } = useCustomAlert();

  const [items, setItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", duration: "", price: "", whatsapp: "", status: "Aktiv", sortOrder: "0"
  });
  
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
        const list = d.PremiumPackages || d.premiumPackages || [];
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
    if (!await showConfirm("Bu paketi silmək istədiyinizə əminsiniz?")) return;
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
        name: item.name || "",
        duration: item.duration || "",
        price: item.price || "",
        whatsapp: item.whatsapp || "",
        status: item.status || "Aktiv",
        sortOrder: item.sortOrder || "0"
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "", duration: "", price: "", whatsapp: "", status: "Aktiv", sortOrder: "0"
      });
    }
    setModalOpen(true);
  };

  const filteredItems = items.filter(i => 
    (i.name || "").toLowerCase().includes(search.toLowerCase())
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
                <th>Paketin Adı</th>
                <th>Müddət</th>
                <th>Qiymət</th>
                <th>WhatsApp Nömrəsi</th>
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
                    <td className="font-semibold">{item.name}</td>
                    <td>{item.duration || "-"}</td>
                    <td>{item.price || "-"}</td>
                    <td>{item.whatsapp || "-"}</td>
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
                  <td colSpan="7" className="text-center py-8">Heç bir paket tapılmadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>{editingId ? "Paketi Yenilə" : "Yeni Paket Əlavə Et"}</h2>
              <button className="close-btn" onClick={() => setModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Paketin Adı</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Məs: Qızıl Paket" />
                </div>
                <div className="form-group">
                  <label>Müddət</label>
                  <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} required placeholder="Məs: 1 Ay" />
                </div>
                <div className="form-group">
                  <label>Qiymət</label>
                  <input type="text" name="price" value={formData.price} onChange={handleInputChange} required placeholder="Məs: 17.99 AZN" />
                </div>
                <div className="form-group">
                  <label>WhatsApp Nömrəsi (Sifariş üçün)</label>
                  <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="Məs: 0103790874" />
                </div>
                <div className="form-group">
                  <label>Sıralama (Sort Order)</label>
                  <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleInputChange} />
                </div>
              </div>

              <div className="modal-footer mt-6">
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
