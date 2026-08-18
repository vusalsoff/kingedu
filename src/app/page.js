"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import CourseCard from "@/components/ui/CourseCard";
import Typewriter from "typewriter-effect";
import CountUp from "react-countup";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Flame, TrendingUp, Award, ArrowRight, ShieldCheck, Target, Rocket, Star, Loader2 } from "lucide-react";
import GlobalLoader from "@/components/ui/GlobalLoader";
import { formatImageUrl } from "@/lib/imageUrl";
import "./page.css";

const fallbackTraining = {
  id: "fallback_ai",
  title: <>Süni İntellektlə <span className="text-primary">Biznesin</span><br/>idarəedilməsi Təlimi</>,
  description: "Yalnız bu həftə qeydiyyatdan keçənlərə xüsusi 20% ENDİRİM!",
  benefits: ["AI & ChatGPT", "Biznes Avtomatlaşdırma", "Sertifikatlı Təhsil"],
  image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
};

export default function Home() {
  const [featuredTraining, setFeaturedTraining] = useState(fallbackTraining);
  const [homeSettings, setHomeSettings] = useState({
    stat_1_label: "Məzun", stat_1_value: "200", stat_1_show: true,
    stat_2_label: "İzləyici", stat_2_value: "50000", stat_2_show: true,
    stat_3_label: "Onlayn Təhsil", stat_3_value: "100", stat_3_show: true,
    stat_4_label: "Təlim və Marafon", stat_4_value: "30", stat_4_show: true,
    stat_5_label: "Könüllülük proqramı", stat_5_value: "10", stat_5_show: true,
    about_section_title: "King Education Company MMC",
    about_section_text: "Azərbaycanın gənclərinin inkişafına həsr olunmuş, təhsil və maarifçilik sahəsində dinamik fəaliyyəti ilə seçilən müasir təhsil mərkəzidir.",
    about_section_show: true,
    featured_banner_show: true,
    about_features_data: [
      { id: 1, text: "100% Keyfiyyət Zəmanəti", icon: "ShieldCheck", show: true },
      { id: 2, text: "Praktiki Öyrənmə Metodları", icon: "Target", show: true },
      { id: 3, text: "Karyera və İş Dəstəyi", icon: "Rocket", show: true }
    ],
    custom_banners_data: [
      {
        id: 1,
        title: "Süni İntellektlə Biznesin\nidarəedilməsi Təlimi",
        description: "Yalnız bu həftə qeydiyyatdan keçənlərə xüsusi 20% ENDİRİM!",
        show: true,
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
        link: "/telimler",
        pills: ["✨ AI & ChatGPT", "✨ Biznes Avtomatlaşdırma", "🏆 Sertifikatlı Təhsil"],
        top_card: { title: "100% Praktiki", sub: "Real layihələr", icon: "Award" },
        bottom_card: { title: "+5x Məhsuldarlıq", sub: "Biznesdə sıçrayış", icon: "TrendingUp" }
      }
    ]
  });
  const [loading, setLoading] = useState(true);

  const [dbKurslar, setDbKurslar] = useState([]);
  const [dbTelimler, setDbTelimler] = useState([]);
  const [dbMarafonlar, setDbMarafonlar] = useState([]);
  const [dbKitablar, setDbKitablar] = useState([]);


  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_all" })
        });
        const data = await res.json();
        if (data.success && data.data) {
          const trainings = data.data.Telimler || data.data.Trainings || [];
          const courses = data.data.Kurslar || data.data.Courses || [];
          
          const allItems = [...trainings, ...courses];
          const featured = allItems.find(i => (i.featured === true || i.featured === "true") && i.visible !== false && i.visible !== "false");
          
          
            setDbKurslar((data.data.kurslar || data.data.Courses || []).filter(i => i.visible !== false && i.visible !== "false").sort((a,b) => b.id - a.id).slice(0, 3));
            setDbTelimler((data.data.telimler || data.data.Trainings || []).filter(i => i.visible !== false && i.visible !== "false").sort((a,b) => b.id - a.id).slice(0, 3));
            setDbMarafonlar((data.data.marafonlar || data.data.Marathons || []).filter(i => i.visible !== false && i.visible !== "false").sort((a,b) => b.id - a.id).slice(0, 3));
            setDbKitablar((data.data.kitablar || data.data.Books || []).filter(i => i.visible !== false && i.visible !== "false").sort((a,b) => b.id - a.id).slice(0, 3));

            if (featured) {
            setFeaturedTraining(featured);
          } else {
            setFeaturedTraining(fallbackTraining);
          }

          if (data.data.settings) {
            const s = data.data.settings;
            
            let parsedAboutFeatures = prev => prev.about_features_data;
            if (s.about_features_data) {
              try { parsedAboutFeatures = JSON.parse(s.about_features_data); } catch(e){}
            }
            
            let parsedCustomBanners = prev => prev.custom_banners_data;
            if (s.custom_banners_data) {
              try { parsedCustomBanners = JSON.parse(s.custom_banners_data); } catch(e){}
            }

            setHomeSettings(prev => ({
              ...prev,
              stat_1_label: s.stat_1_label || prev.stat_1_label,
              stat_1_value: s.stat_1_value || prev.stat_1_value,
              stat_1_show: s.stat_1_show !== undefined ? String(s.stat_1_show) !== "false" : prev.stat_1_show,
              stat_2_label: s.stat_2_label || prev.stat_2_label,
              stat_2_value: s.stat_2_value || prev.stat_2_value,
              stat_2_show: s.stat_2_show !== undefined ? String(s.stat_2_show) !== "false" : prev.stat_2_show,
              stat_3_label: s.stat_3_label || prev.stat_3_label,
              stat_3_value: s.stat_3_value || prev.stat_3_value,
              stat_3_show: s.stat_3_show !== undefined ? String(s.stat_3_show) !== "false" : prev.stat_3_show,
              stat_4_label: s.stat_4_label || prev.stat_4_label,
              stat_4_value: s.stat_4_value || prev.stat_4_value,
              stat_4_show: s.stat_4_show !== undefined ? String(s.stat_4_show) !== "false" : prev.stat_4_show,
              stat_5_label: s.stat_5_label || prev.stat_5_label,
              stat_5_value: s.stat_5_value || prev.stat_5_value,
              stat_5_show: s.stat_5_show !== undefined ? String(s.stat_5_show) !== "false" : prev.stat_5_show,
              
              about_section_title: s.about_section_title || s.haqqimizda_basliq || prev.about_section_title,
              about_section_text: s.about_section_text || s.haqqimizda_metn || prev.about_section_text,
                about_cta_subtitle: s.about_cta_subtitle || prev.about_cta_subtitle || "Haqqımızda - RƏSMİ TƏHSİL VƏ İNKİŞAF MƏRKƏZİ",
                about_cta_btn_text: s.about_cta_btn_text || prev.about_cta_btn_text || "Daha Ətraflı",
              about_section_show: (s.about_section_show !== undefined) ? (String(s.about_section_show) !== "false") : ((s.haqqimizda_show !== undefined) ? (String(s.haqqimizda_show) !== "false") : true),
              featured_banner_show: (s.featured_banner_show !== undefined) ? (String(s.featured_banner_show) !== "false") : ((s.aktual_elan_show !== undefined) ? (String(s.aktual_elan_show) !== "false") : true),
              
              about_features_data: s.about_features_data ? parsedAboutFeatures : prev.about_features_data,
              custom_banners_data: s.custom_banners_data ? parsedCustomBanners : prev.custom_banners_data
            }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch home data", err);
        setFeaturedTraining(fallbackTraining);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);
  return (
    <div className="home-page">
      <AnimatePresence>
        {loading && (
          <motion.div
            key="global-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ zIndex: 999999, position: "relative" }}
          >
            <GlobalLoader />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">
            <Typewriter
              options={{
                strings: ['Gələcəyini <span class="text-gradient">Bizimlə</span> Qur!'],
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
              }}
            />
          </h1>
          <p className="hero-subtitle">
            King Education Company – Peşəkar təhsil və fərdi inkişafınız üçün ən doğru ünvan.
          </p>
          <div className="hero-buttons">
            <Button href="/kurslar" variant="primary">Kurslarımıza Bax</Button>
            <Button href="/haqqimizda" variant="secondary">Haqqımızda</Button>
          </div>
        </div>
      </section>

      
        {/* Yeni Bölmələr */}
        {dbKurslar.length > 0 && (
          <section className="section py-20 bg-alt" style={{ padding: "4rem 0", background: "var(--bg-alt)" }}>
            <div className="container">
              <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h2 className="section-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Ən Son Əlavə Edilən <span className="text-primary" style={{ color: "var(--primary)" }}>Kurslarımız</span></h2>
              </div>
              <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                {dbKurslar.map(item => (
                  <CourseCard key={item.id} {...item} type="course" categoryPath="kurslar" />
                ))}
              </div>
            </div>
          </section>
        )}

        {dbTelimler.length > 0 && (
          <section className="section py-20" style={{ padding: "4rem 0" }}>
            <div className="container">
              <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h2 className="section-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Ən Son Əlavə Edilən <span className="text-primary" style={{ color: "var(--primary)" }}>Təlimlərimiz</span></h2>
              </div>
              <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                {dbTelimler.map(item => (
                  <CourseCard key={item.id} {...item} type="training" categoryPath="telimler" />
                ))}
              </div>
            </div>
          </section>
        )}

        {dbMarafonlar.length > 0 && (
          <section className="section py-20 bg-alt" style={{ padding: "4rem 0", background: "var(--bg-alt)" }}>
            <div className="container">
              <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h2 className="section-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Ən Son Əlavə Edilən <span className="text-primary" style={{ color: "var(--primary)" }}>Marafonlar</span></h2>
              </div>
              <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                {dbMarafonlar.map(item => (
                  <CourseCard key={item.id} {...item} type="marathon" categoryPath="marafonlar" />
                ))}
              </div>
            </div>
          </section>
        )}

        {dbKitablar.length > 0 && (
          <section className="section py-20" style={{ padding: "4rem 0" }}>
            <div className="container">
              <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h2 className="section-title" style={{ fontSize: "2.5rem", fontWeight: 800 }}>Ən Son Əlavə Edilən <span className="text-primary" style={{ color: "var(--primary)" }}>Kitablar</span></h2>
              </div>
              <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                {dbKitablar.map(item => (
                  <CourseCard key={item.id} {...item} type="book" categoryPath="kitablar" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Statistics */}
      <section className="stats-section bg-alt">
        <div className="container stats-grid">
          {[1, 2, 3, 4, 5].map((num, i) => {
            const isShow = homeSettings[`stat_${num}_show`];
            const label = homeSettings[`stat_${num}_label`];
            const val = parseInt(homeSettings[`stat_${num}_value`]) || 0;
            
            if (!isShow) return null;
            
            return (
              <motion.div 
                key={num}
                className="stat-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <h3 className="text-gradient">
                  <CountUp end={val} duration={3} separator="." />+
                </h3>
                <p>{label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Custom AI Banners */}
      {homeSettings.custom_banners_data && homeSettings.custom_banners_data.map((banner, index) => {
        if (!banner.show) return null;
        
        return (
          <section key={banner.id || index} className="poster-section container section-padding">
            <motion.div 
              className="poster-container ai-banner-container"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ boxShadow: "0 25px 50px -12px rgba(255, 107, 0, 0.25)" }}
            >
              {/* Animated Background Glow Orbs */}
              <div className="ai-banner-bg-glow glow-1"></div>
              <div className="ai-banner-bg-glow glow-2"></div>

              <div className="poster-content ai-banner-content">
                <motion.div 
                  className="badge ai-badge"
                  animate={{ 
                    scale: [1, 1.06, 1],
                    boxShadow: [
                      "0 0 10px rgba(255, 107, 0, 0.3)",
                      "0 0 25px rgba(255, 107, 0, 0.8)",
                      "0 0 10px rgba(255, 107, 0, 0.3)"
                    ] 
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Zap size={15} className="pulse-icon" /> {banner.badge_text || "YENİ TƏLİM"}
                </motion.div>

                <motion.h2 
                  className="ai-banner-title"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  dangerouslySetInnerHTML={{ __html: banner.title ? banner.title.replace(/\n/g, '<br/>') : "" }}
                />

                <motion.div 
                  className="ai-discount-box"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Flame size={22} className="flame-icon" />
                  <span><strong>{banner.description}</strong></span>
                </motion.div>

                <motion.div 
                  className="ai-feature-pills"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {banner.pills && banner.pills.map((pill, pIdx) => (
                    <span key={pIdx} className="ai-pill">{pill}</span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="ai-btn-wrapper"
                >
                  <Button href={banner.link || "/telimler"} className="ai-action-btn">
                    <Sparkles size={18} /> {banner.button_text || "İndi Endirimlə Qoşul"} <ArrowRight size={18} className="arrow-move" />
                  </Button>
                </motion.div>
              </div>

              <div className="poster-image-wrapper ai-image-wrapper">
                <motion.img 
                  src={formatImageUrl(banner.image) || "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"} 
                  alt="Banner" 
                  className="poster-image ai-image"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <div className="ai-image-overlay"></div>
                
                {/* Floating Badges on Image */}
                {banner.top_card && banner.top_card.title && (
                  <motion.div 
                    className="ai-floating-card card-top"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="float-icon text-primary">
                      <Award size={20} />
                    </div>
                    <div>
                      <strong>{banner.top_card.title}</strong>
                      <span>{banner.top_card.sub}</span>
                    </div>
                  </motion.div>
                )}

                {banner.bottom_card && banner.bottom_card.title && (
                  <motion.div 
                    className="ai-floating-card card-bottom"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <div className="float-icon text-green">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <strong>{banner.bottom_card.title}</strong>
                      <span>{banner.bottom_card.sub}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </section>
        );
      })}




      {/* About CTA (Super Motion Interactive Banner) */}
      {homeSettings.about_section_show && (
        <section className="about-cta super-cta-section">
          <motion.div 
            className="container about-cta-inner super-cta-container"
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45)" }}
          >
            {/* Background Animated Rings & Glows */}
            <div className="cta-bg-shape shape-ring-1"></div>
            <div className="cta-bg-shape shape-ring-2"></div>
            <div className="cta-bg-glow glow-orange"></div>
            <div className="cta-bg-glow glow-blue"></div>

            {/* Top Crown/Star Badge */}
            <div 
              className="hero-badge"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
                background: "rgba(255, 107, 0, 0.12)",
                color: "var(--primary)",
                padding: "0.6rem 1.5rem",
                borderRadius: "50px",
                fontWeight: "700",
                fontSize: "0.95rem",
                marginBottom: "1.5rem",
                border: "1px solid rgba(255, 107, 0, 0.3)",
                boxShadow: "0 4px 15px rgba(255, 107, 0, 0.15)",
                position: "relative",
                zIndex: 10,
                opacity: 1, /* Force opacity 1 in case intersection observer fails */
                transform: "none" /* Force transform none in case intersection observer fails */
              }}
            >
              <Sparkles size={18} style={{flexShrink: 0}} /> <span>{homeSettings.about_cta_subtitle || "Haqqımızda - RƏSMİ TƏHSİL VƏ İNKİŞAF MƏRKƏZİ"}</span>
            </div>

            <div 
              className="cta-title"
            >
              {homeSettings.about_section_title.split(' ')[0]} <span className="cta-highlight">{homeSettings.about_section_title.substring(homeSettings.about_section_title.indexOf(' ')+1)}</span>
            </div>

            <motion.p 
              className="cta-subtitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {homeSettings.about_section_text}
            </motion.p>

            {/* Interactive Feature Cards */}
            <motion.div 
              className="cta-features-grid"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {homeSettings.about_features_data && homeSettings.about_features_data.map((feature, idx) => {
                if (!feature.show) return null;
                
                let IconComp = ShieldCheck;
                if (feature.icon === "Target") IconComp = Target;
                if (feature.icon === "Rocket") IconComp = Rocket;
                if (feature.icon === "Star") IconComp = Star;
                if (feature.icon === "Award") IconComp = Award;
                
                return (
                  <motion.div key={feature.id || idx} className="cta-feature-item" whileHover={{ y: -5, scale: 1.05 }}>
                    <IconComp className={`feature-icon text-${feature.color || 'primary'}`} size={24} />
                    <span>{feature.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="cta-btn-wrapper"
            >
              <Button href="/haqqimizda" className="super-cta-btn">
                <span>{homeSettings.about_cta_btn_text || "Daha Ətraflı"}</span> <ArrowRight size={20} className="arrow-slide" />
              </Button>
            </motion.div>
          </motion.div>
        </section>
      )}
      
    </div>
  );
}
