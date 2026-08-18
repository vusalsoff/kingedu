"use client";
import { useState, useEffect, useRef } from "react";
import { 
  Award, 
  Users, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  Phone,
  Mail,
  Camera,
  Briefcase,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import "./haqqimizda.css";

function CountUp({ end, suffix = "", hasSeparator = false, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(ease * end));
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  const formattedCount = hasSeparator && count >= 1000 
    ? count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") 
    : count;

  return <span ref={ref}>{formattedCount}{suffix}</span>;
}

export default function HaqqimizdaClient({ settings = {} }) {
  const subtitle1 = settings.aboutSubtitle1 || "RƏSMİ TƏHSİL VƏ İNKİŞAF MƏRKƏZİ";
  const title1 = settings.aboutTitle1 || "King Education Company";
  const text1 = settings.aboutText1 || "Azərbaycanın gənclərinin inkişafına həsr olunmuş, təhsil və maarifçilik sahəsində dinamik fəaliyyəti ilə seçilən müasir təhsil mərkəzidir. Bizim məqsədimiz sadəcə dərs keçmək deyil, gənclərin həyatına yeni biliklər, bacarıqlar və fürsətlər qazandırmaqdır.";
  
  const title2 = settings.aboutTitle2 || "Yaranma və İnkişaf Yolu";
  const text2 = settings.aboutText2 || "Şirkətin əsası məktəbli illərindən gənclərin inkişafına dəstək olmaq istəyən Mirfəqan Hacıyev tərəfindən qoyulmuşdur. O, kiçik yaşlarından müxtəlif layihələr təşkil edərək həmyaşıdlarını bir araya toplamağa nail olmuş, zamanla bu təşəbbüsləri rəsmi fəaliyyətə çevirmişdir. 24 avqust 2023-cü ildə təsis edilən təşəbbüs, 11 fevral 2025-ci ildən etibarən \"King Education Company\" adı ilə rəsmi fəaliyyətini davam etdirir.";
  
  const title3 = settings.aboutTitle3 || "Fəaliyyət və Nəticələr";
  const text3 = settings.aboutText3 || "15.000+ iştirakçı müxtəlif kurs, marafon və seminarlarımızda iştirak edib. 200+ məzun əldə etdikləri biliklərlə təhsillərinə və karyeralarına yeni istiqamət veriblər.";

  const milestone1Date = settings.aboutMilestone1Date || "24 Avqust 2023";
  const milestone1Text = settings.aboutMilestone1Text || "Təşəbbüsün əsasının qoyulması və ilk gənclər layihələrinin təşkili";
  const milestone2Date = settings.aboutMilestone2Date || "11 Fevral 2025";
  const milestone2Text = settings.aboutMilestone2Text || "Rəsmi MMC statusu alaraq \"King Education Company\" kimi tam peşəkar fəaliyyət";

  const ctaSubtitle = settings.aboutCtaSubtitle || "GƏLƏCƏYİN LİDERLƏRİ";
  const ctaTitle = settings.aboutCtaTitle || "Siz də Uğur Hikayənizi Bizimlə Yazın!";
  const ctaText = settings.aboutCtaText || "KİNG Education ailəsinə qoşulun, yeni bacarıqlara yiyələnin və gələcəyin liderləri arasında öz yerinizi tutun.";
  const ctaPill1 = settings.aboutCtaPill1 || "🏆 +15.000 İştirakçı";
  const ctaPill2 = settings.aboutCtaPill2 || "🚀 +200 Məzun";
  const ctaPill3 = settings.aboutCtaPill3 || "💡 100% Praktiki Tədris";
  const ctaBtnText = settings.aboutCtaBtnText || "Bütün Kurslara Bax";
  const ctaBtnLink = settings.aboutCtaBtnLink || "/kurslar";

  const parseStat = (val, defaultNum, defaultSuffix) => {
    if (!val) return { num: defaultNum, suffix: defaultSuffix, hasSeparator: false };
    const str = val.toString().trim();
    const match = str.match(/^([0-9.,]+)(.*)$/);
    if (match) {
      const numStr = match[1];
      const suffix = match[2];
      const hasSep = numStr.includes('.') || numStr.includes(',');
      const rawNum = parseInt(numStr.replace(/[.,]/g, ''), 10);
      return { num: isNaN(rawNum) ? defaultNum : rawNum, suffix, hasSeparator: hasSep || rawNum >= 1000 };
    }
    return { num: defaultNum, suffix: str, hasSeparator: false };
  };

  const stat1Val = settings.aboutStat1Val || settings.about_C5 || "15.000+";
  const stat1Label = settings.aboutStat1Label || settings.about_C6 || "Təlim və Kurs İştirakçısı";
  const s1 = parseStat(stat1Val, 15000, "+");

  const stat2Val = settings.aboutStat2Val || settings.about_C8 || "200+";
  const stat2Label = settings.aboutStat2Label || settings.about_C9 || "Uğurlu Məzun və Karyera";
  const s2 = parseStat(stat2Val, 200, "+");

  const stat3Val = settings.aboutStat3Val || settings.about_C11 || "100%";
  const stat3Label = settings.aboutStat3Label || settings.about_C12 || "Keyfiyyət və Peşəkarlıq";
  const s3 = parseStat(stat3Val, 100, "%");

  const s1Visible = settings.aboutSection1Visible !== "false" && settings.aboutSection1Visible !== false;
  const s2Visible = settings.aboutSection2Visible !== "false" && settings.aboutSection2Visible !== false;
  const statsVisible = settings.aboutStatsVisible !== "false" && settings.aboutStatsVisible !== false;
  const s3Visible = settings.aboutSection3Visible !== "false" && settings.aboutSection3Visible !== false;

  const directorName = settings.directorName || "Mirfəqan Hacıyev Vüqar oğlu";
  const directorTitle = settings.directorTitle || "King Education Company - Direktor";
  const directorBio = settings.directorBio || "";
  const directorPhone = settings.directorPhone || "010 379 08 74";
  const directorEmail = settings.directorEmail || "haciMirfəqan@gmail.com";
  const directorInsta = settings.directorInsta || "mirfagann";
  const directorStat1Label = settings.directorStat1Label || "İllik Təcrübə";
  const directorStat1Val = settings.directorStat1Val || "4+";
  const directorStat2Label = settings.directorStat2Label || "Uğurlu Məzun";
  const directorStat2Val = settings.directorStat2Val || "196+";
  const directorStat3Label = settings.directorStat3Label || "Təlim & Marafon";
  const directorStat3Val = settings.directorStat3Val || "49+";
  const directorImage = settings.directorImage || "/img/mirfeqan.jpeg";

  return (
    <div className="haqqimizda-wrapper container">
      {/* Hero Header Section (A1 & A2) */}
      {s1Visible && (
        <motion.section 
          className="haqqimizda-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-badge">
            <Sparkles size={18} />
            <span>{subtitle1}</span>
          </div>
          
          <h1 className="hero-title text-gradient">
            {title1}
          </h1>
          
          <div className="hero-lead-box">
            <p style={{ margin: 0 }}>
              {text1}
            </p>
          </div>
        </motion.section>
      )}

      {/* Section 2: History & Growth (B1 & B2) */}
      {s2Visible && (
        <motion.section 
          className="haqqimizda-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="feature-card-premium">
            <div className="feature-header">
              <div className="feature-icon-box">
                <Rocket size={28} />
              </div>
              <h2 className="feature-title">{title2}</h2>
            </div>
            
            <div className="feature-body-text">
              {text2}
            </div>

            {/* Interactive Visual Milestones */}
            <div className="milestones-grid">
              <div className="milestone-item">
                <div className="milestone-date">{milestone1Date}</div>
                <div className="milestone-text">
                  {milestone1Text}
                </div>
              </div>
              
              <div className="milestone-item">
                <div className="milestone-date">{milestone2Date}</div>
                <div className="milestone-text">
                  {milestone2Text}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Stats Section (C5-C12 Animated Counters) */}
      {statsVisible && (
        <motion.section 
          className="haqqimizda-section"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="stats-showcase-grid">
            <motion.div className="stat-showcase-card" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <div className="stat-showcase-icon">
                <Users size={24} />
              </div>
              <div className="stat-showcase-number">
                <CountUp end={s1.num} suffix={s1.suffix} hasSeparator={s1.hasSeparator} duration={2.2} />
              </div>
              <div className="stat-showcase-label">{stat1Label}</div>
            </motion.div>

            <motion.div className="stat-showcase-card" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <div className="stat-showcase-icon">
                <Award size={24} />
              </div>
              <div className="stat-showcase-number">
                <CountUp end={s2.num} suffix={s2.suffix} hasSeparator={s2.hasSeparator} duration={2.5} />
              </div>
              <div className="stat-showcase-label">{stat2Label}</div>
            </motion.div>

            <motion.div className="stat-showcase-card" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
              <div className="stat-showcase-icon">
                <Trophy size={24} />
              </div>
              <div className="stat-showcase-number">
                <CountUp end={s3.num} suffix={s3.suffix} hasSeparator={s3.hasSeparator} duration={2.0} />
              </div>
              <div className="stat-showcase-label">{stat3Label}</div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Section 3: Impact & Results (C1 & C2) */}
      {s3Visible && (
        <motion.section 
          className="haqqimizda-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="feature-card-premium" style={{ borderColor: 'rgba(255, 107, 0, 0.25)' }}>
            <div className="feature-header">
              <div className="feature-icon-box">
                <Trophy size={28} />
              </div>
              <h2 className="feature-title">{title3}</h2>
            </div>
            
            <div className="feature-body-text" style={{ fontSize: '1.2rem', fontWeight: '500' }}>
              {text3}
            </div>
          </div>
        </motion.section>
      )}



      {/* CTA Section (Super Motion Success Story Banner) */}
      <section className="haqqimizda-cta super-success-cta">
        <motion.div 
          className="cta-content super-success-content"
          initial={{ opacity: 0, y: 50, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          whileHover={{ boxShadow: "0 25px 60px rgba(0, 0, 0, 0.45)" }}
        >
          {/* Animated Background Glow Orbs & Rings */}
          <div className="success-bg-shape ring-left"></div>
          <div className="success-bg-shape ring-right"></div>
          <div className="success-bg-glow glow-gold"></div>
          <div className="success-bg-glow glow-cyan"></div>

          {/* Top Sparkling Badge */}
          <motion.div 
            className="success-badge"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={16} className="sparkle-spin" /> {ctaSubtitle} <Sparkles size={16} className="sparkle-spin" />
          </motion.div>

          <motion.h2
            className="success-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            dangerouslySetInnerHTML={{ __html: ctaTitle.replace('Uğur Hikayənizi', '<span class="success-highlight">Uğur Hikayənizi</span>') }}
          />

          <motion.p 
            className="success-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {ctaText}
          </motion.p>

          {/* Mini Interactive Stat Pills */}
          <motion.div 
            className="success-pills-grid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.span className="success-pill" whileHover={{ y: -3, scale: 1.05 }}>
              {ctaPill1}
            </motion.span>
            <motion.span className="success-pill" whileHover={{ y: -3, scale: 1.05 }}>
              {ctaPill2}
            </motion.span>
            <motion.span className="success-pill" whileHover={{ y: -3, scale: 1.05 }}>
              {ctaPill3}
            </motion.span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="success-btn-wrapper"
          >
            <Link href={ctaBtnLink} className="super-success-btn">
              <span>{ctaBtnText}</span>
              <ArrowRight size={20} className="arrow-move-right" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
