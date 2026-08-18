"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, BookOpen, Star, GraduationCap, Video, Book, Trophy, ExternalLink, Activity, Trash2, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCustomAlert } from "@/context/AlertContext";

export default function KabinetPage() {
  const { user, toggleFavorite, logout } = useAuth();
  const { showConfirm } = useCustomAlert();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [userTag, setUserTag] = useState(null);

  useEffect(() => {
    if (user) {
      fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_all" })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.settings) {
          let tagsObj = {};
          try { tagsObj = JSON.parse(data.data.settings.user_tags || '{}'); } catch(e){}
          if (tagsObj[user.id] || tagsObj[user.username]) {
            setUserTag(tagsObj[user.id] || tagsObj[user.username]);
          }
        }
      })
      .catch(e => console.error(e));
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);
    if (mounted && !user) {
      router.push("/");
    }
  }, [user, mounted, router]);

  if (!mounted || !user) return null;

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  const favorites = user.favorites || [];
  
  // Categorize favorites (prioritize type checking to avoid duplicates if older items had wrong default category)
  const getByCategory = (catName, typeNames = []) => favorites.filter(f => {
    if (f.type) {
      return typeNames.some(t => f.type.toLowerCase() === t.toLowerCase());
    }
    return f.category && f.category.toLowerCase().includes(catName.toLowerCase());
  });
  
  const courses = getByCategory("Kurs", ["course", "kurslar"]);
  const trainings = getByCategory("Təlim", ["training", "telimler"]);
  const marathons = getByCategory("Marafon", ["marathon", "marafonlar"]);
  const books = getByCategory("Kitab", ["book", "kitablar", "pdf"]);
  const documents = getByCategory("Sənədlər", ["document"]);

  const getDetailsUrl = (item) => {
    if (item.type === 'document' && item.link) return item.link;
    if (item.pdfUrl) return item.pdfUrl;
    if (item.type === 'course' || item.type === 'kurslar') return `/kurslar/${item.id}`;
    if (item.type === 'training' || item.type === 'telimler') return `/telimler/${item.id}`;
    if (item.type === 'marathon' || item.type === 'marafonlar') return `/marafonlar/${item.id}`;
    if (item.type === 'book' || item.type === 'kitablar') return `/pdf-kitablar/${item.id}`;
    if (item.type === 'news') return `/xeberler/${item.id}`;
    if (item.type === 'campaign') return `/kampaniyalar/${item.id}`;
    
    // Fallbacks based on category if type is missing or default
    if (item.category === 'Təlimlər') return `/telimler/${item.id}`;
    if (item.category === 'Marafonlar') return `/marafonlar/${item.id}`;
    if (item.category === 'Kitablar') return `/pdf-kitablar/${item.id}`;
    
    return `/kurslar/${item.id}`;
  };

  const statCards = [
    { title: "Ümumi Seçilmişlər", count: favorites.length, icon: <Star size={24} />, color: "#eab308", bg: "rgba(234, 179, 8, 0.1)" },
    { title: "Kurslar", count: courses.length, icon: <GraduationCap size={24} />, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
    { title: "Təlimlər", count: trainings.length, icon: <Video size={24} />, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
    { title: "Marafonlar", count: marathons.length, icon: <Trophy size={24} />, color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
    { title: "Kitablar", count: books.length, icon: <Book size={24} />, color: "#f97316", bg: "rgba(249, 115, 22, 0.1)" },
    { title: "Sənədlər", count: documents.length, icon: <BookOpen size={24} />, color: "#ec4899", bg: "rgba(236, 72, 153, 0.1)" }
  ];

  const getFilteredItems = () => {
    if (activeTab === "all") return favorites;
    if (activeTab === "courses") return courses;
    if (activeTab === "trainings") return trainings;
    if (activeTab === "marathons") return marathons;
    if (activeTab === "books") return books;
    if (activeTab === "documents") return documents;
    return [];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ marginTop: "100px", paddingTop: "40px", paddingBottom: "5rem", minHeight: "80vh", position: "relative", zIndex: 10 }} className="container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-md)" }}
      >
        
        {/* Header Profile Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "1.5rem", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "65px", height: "65px", flexShrink: 0, background: "linear-gradient(135deg, var(--primary), #FF913B)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 4px 15px rgba(255,107,0,0.3)" }}>
              <User size={32} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "var(--text-main)", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span>Xoş Gəldiniz, <span style={{ color: "var(--primary)" }}>{user.username || user.name}</span>!</span>
                {userTag && (
                  <span style={{ fontSize: "0.8rem", background: "linear-gradient(135deg, #FFD700, #FDB931)", color: "#000", padding: "4px 12px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "5px", fontWeight: 800 }}>
                    <Crown size={14} /> {userTag}
                  </span>
                )}
              </h1>
              <p style={{ color: "var(--text-main)", opacity: 0.7, margin: "0.25rem 0 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
                <Activity size={16} /> İştirakçı Kabineti - Aktiv İzləyici
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "0.6rem 1.25rem", borderRadius: "var(--radius-md)", cursor: "pointer", fontWeight: 700, transition: "all 0.3s" }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.transform = "none"; }}
          >
            <LogOut size={18} /> Çıxış
          </button>
        </div>

        {/* Stats Grid */}
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>Aktivlik Göstəriciləri</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}
        >
          {statCards.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "var(--shadow-md)" }}
              style={{ background: "var(--bg-color)", padding: "1.25rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <div style={{ width: "45px", height: "45px", borderRadius: "12px", background: stat.bg, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1 }}>{stat.count}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--text-main)", opacity: 0.7, marginTop: "4px", fontWeight: 600 }}>{stat.title}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", overflowX: "auto" }}>
          {[
            { id: "all", label: "Bütün Seçilmişlər", count: favorites.length },
            { id: "courses", label: "Kurslar", count: courses.length },
            { id: "trainings", label: "Təlimlər", count: trainings.length },
            { id: "marathons", label: "Marafonlar", count: marathons.length },
            { id: "books", label: "Kitablar", count: books.length },
            { id: "documents", label: "Sənədlər", count: documents.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.5rem 1rem",
                background: activeTab === tab.id ? "var(--primary)" : "transparent",
                color: activeTab === tab.id ? "white" : "var(--text-main)",
                border: "none",
                borderRadius: "var(--radius-full)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s",
                whiteSpace: "nowrap"
              }}
            >
              {tab.label} <span style={{ opacity: 0.8, fontSize: "0.85em", marginLeft: "4px" }}>({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Selected List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ minHeight: "200px" }}
          >
            {getFilteredItems().length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {getFilteredItems().map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                    style={{ background: "var(--bg-alt)", padding: "1.5rem", borderRadius: "20px", border: "1px solid var(--border-color)", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}
                  >
                    {item.image && (
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "100px", backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1, zIndex: 0, maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))", WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))" }}></div>
                    )}
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "0.4rem 0.8rem", background: "rgba(255,107,0,0.1)", color: "var(--primary)", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          {item.category || "Kateqoriya"}
                        </span>
                        <Star size={20} color="#eab308" fill="#eab308" style={{ filter: "drop-shadow(0 2px 4px rgba(234, 179, 8, 0.4))" }} />
                      </div>
                      <h4 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.5rem 0", lineHeight: 1.4, color: "var(--text-main)" }}>{item.title || item.name}</h4>
                      {item.price && (
                        <p style={{ margin: "0", fontSize: "0.95rem", color: "var(--text-main)", opacity: 0.7, fontWeight: 600 }}>{item.price}</p>
                      )}
                    </div>
                    
                    <div style={{ position: "relative", zIndex: 1, marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                       <Link 
                         href={getDetailsUrl(item)}
                         target={item.type === 'document' ? "_blank" : undefined}
                         style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontSize: "0.95rem", fontWeight: 700, textDecoration: "none", transition: "all 0.2s" }}
                         onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
                         onMouseOut={(e) => e.currentTarget.style.opacity = 1}
                       >
                         {item.type === 'document' ? "Sənədi Aç" : "Ətraflı Bax"} <ExternalLink size={16} />
                       </Link>
                       <button 
                         onClick={async (e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           if (await showConfirm("Bu materialı seçilmişlərdən silmək istədiyinizə əminsiniz?")) {
                             toggleFavorite(item, item.category);
                             showAlert("Material uğurla silindi!", "success");
                           }
                         }} 
                         style={{ background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444", padding: "0.4rem 0.8rem", borderRadius: "10px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s" }} 
                         title="Favorilərdən Sil"
                         onMouseOver={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "white"; }}
                         onMouseOut={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.color = "#ef4444"; }}
                       >
                         Sil
                       </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", background: "var(--bg-color)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-color)" }}>
                <BookOpen size={48} color="var(--primary)" style={{ opacity: 0.3, marginBottom: "1rem" }} />
                <h3 style={{ margin: "0 0 0.5rem 0" }}>Hələlik bura boşdur</h3>
                <p style={{ opacity: 0.7, marginBottom: "1.5rem", textAlign: "center", maxWidth: "400px" }}>
                  Hazırda bu kateqoriyada heç bir materialı favorilərə əlavə etməmisiniz. Siyahıya baxmaq üçün bölmələrə keçid edin.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                  <Link href="/kurslar" style={{ padding: "0.5rem 1.25rem", background: "var(--bg-alt)", border: "1px solid var(--primary)", color: "var(--primary)", borderRadius: "var(--radius-full)", textDecoration: "none", fontWeight: 600 }}>Kurslar</Link>
                  <Link href="/telimler" style={{ padding: "0.5rem 1.25rem", background: "var(--bg-alt)", border: "1px solid var(--primary)", color: "var(--primary)", borderRadius: "var(--radius-full)", textDecoration: "none", fontWeight: 600 }}>Təlimlər</Link>
                  <Link href="/marafonlar" style={{ padding: "0.5rem 1.25rem", background: "var(--bg-alt)", border: "1px solid var(--primary)", color: "var(--primary)", borderRadius: "var(--radius-full)", textDecoration: "none", fontWeight: 600 }}>Marafonlar</Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
