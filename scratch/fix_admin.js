const fs = require('fs');

const path = 'src/app/admin/page.js';
let content = fs.readFileSync(path, 'utf8');

// The new Premium Packages Panel
const newPremiumPanel = `
                    {/* Premium Packages Panel */}
                    <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", gridColumn: "1 / -1" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                          <Crown size={20} color="var(--primary)" /> Premium Üzvlük Paketləri
                        </h3>
                        <button onClick={handleAddPremiumPackage} style={{ background: "var(--primary)", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}><PlusCircle size={16} /> Yeni Paket</button>
                      </div>
                      
                      <div style={{ marginBottom: "2rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>WhatsApp Nömrəsi (Premium müraciətlər üçün)</label>
                        <input type="text" value={homeSettings.premium_whatsapp} onChange={(e) => handleHomeSettingChange('premium_whatsapp', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                        {homeSettings.premium_packages_data && homeSettings.premium_packages_data.map((pkg, idx) => (
                          <div key={idx} style={{ background: "var(--bg-color)", padding: "1.5rem", borderRadius: "16px", border: pkg.popular ? "2px solid #FF6B00" : "1px solid var(--border-color)", position: "relative", display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <button onClick={() => handleDeletePremiumPackage(idx)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", padding: "0.5rem", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center" }} title="Sil">
                              <Trash2 size={18} />
                            </button>
                            
                            <div style={{ display: "flex", gap: "1rem" }}>
                              <div style={{ flex: 1 }}>
                                <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Paket Başlığı</label>
                                <input type="text" value={pkg.title} onChange={(e) => handleUpdatePremiumPackage(idx, 'title', e.target.value)} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none" }} />
                              </div>
                              <div style={{ width: "100px" }}>
                                <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Qiymət</label>
                                <input type="text" value={pkg.price} onChange={(e) => handleUpdatePremiumPackage(idx, 'price', e.target.value)} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none" }} />
                              </div>
                            </div>
                            
                            <div>
                               <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Xüsusiyyətlər (Enter ilə yeni sətirə yazın)</label>
                               <textarea rows="4" value={(pkg.features || []).join('\\n')} onChange={(e) => handleUpdatePremiumPackage(idx, 'features', e.target.value.split('\\n').map(s=>s.trim()).filter(Boolean))} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", resize: "vertical", lineHeight: "1.5" }} placeholder="Bütün dərslərə giriş\\nAylıq sınaqlar..." />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                               <input type="checkbox" id={\`pop-\${idx}\`} checked={pkg.popular || false} onChange={(e) => handleUpdatePremiumPackage(idx, 'popular', e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#FF6B00", cursor: "pointer" }} />
                               <label htmlFor={\`pop-\${idx}\`} style={{ fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>Ən çox seçilən kimi işarələ</label>
                            </div>
                          </div>
                        ))}
                        {(!homeSettings.premium_packages_data || homeSettings.premium_packages_data.length === 0) && (
                           <div style={{ padding: "2rem", textAlign: "center", opacity: 0.5, border: "1px dashed var(--border-color)", borderRadius: "16px", gridColumn: "1 / -1" }}>Paket yoxdur</div>
                        )}
                      </div>
                    </div>`;

// Delete the improperly inserted newPremiumPanel
const regexImproper = /\n\s*\{\/\* Premium Packages Panel \*\/\}[\s\S]*?Paket yoxdur<\/div>\n\s*\)\}\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>\n/g;
content = content.replace(regexImproper, '');

// Restore the missing `</div> </div>` at the end of the Statistikalar block if it's missing
// Actually, they were eaten up by the fuzzy matcher.
content = content.replace(/(\s*\}\)\})\s*(?=\{\/\* Layout & Visibility \*\/)/, '$1\n                      </div>\n                    </div>\n\n');

// Find the old Premium Packages block and replace it with the new one
const regexOld = /\n\s*\{\/\* Premium Packages \*\/\}(?:\n.*)*?1 İllik Qiymət \(AZN\)(?:\n.*)*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>/;

// Wait, the old block doesn't have {/* Premium Packages */} comment anymore because my TargetContent replaced it and deleted it!
// Let's use string indexOf to manually find it.
const startStr = `<div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Crown size={20} color="var(--primary)" /> Premium Üzvlük Paketləri`;
const startIndex = content.indexOf(startStr);
if (startIndex !== -1) {
  const endIndexStr = `1 İllik Qiymət (AZN)</label>`;
  let endIdx = content.indexOf(endIndexStr, startIndex);
  if (endIdx !== -1) {
    // Find the end of this block by finding 4 </div>'s
    let divCount = 0;
    let pos = endIdx;
    while (divCount < 4 && pos < content.length) {
      pos = content.indexOf('</div>', pos + 1);
      divCount++;
    }
    if (pos !== -1) {
      content = content.substring(0, startIndex) + newPremiumPanel + content.substring(pos + 6);
    }
  }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed');
