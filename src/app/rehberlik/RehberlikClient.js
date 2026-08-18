"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { formatImageUrl } from "@/lib/imageUrl";
import Link from "next/link";
import "./Rehberlik.css";

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
      // Ease out cubic for smooth deceleration
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

export default function RehberlikClient({ settings }) {
  const defaultText = `<p style="text-align: justify;"><strong>Mirfəqan Hacıyev</strong> 2007-ci il mayın 11-də Goranboy rayonunun Tapqaraqoyunlu kəndində anadan olmuşdur. O, 2013–2024-cü illərdə Tapqaraqoyunlu kənd N. Aslanov adına ümumitəhsil məktəbini başa vurmuş, məktəb illərindən etibarən öz çalışqanlığı, liderlik keyfiyyətləri və elmi-ictimai fəallığı ilə seçilmişdir. Erkən yaşda valideynlərini itirməsinə baxmayaraq, formalaşdırdığı güclü intizam, iradə və özünüinkişaf əzmi sayəsində qısa müddət ərzində mühüm nailiyyətlərə imza atmışdır; hazırda Gəncə Dövlət Universitetinin Ekologiya mühəndisliyi ixtisasının iştirakçısi olmaqla yanaşı, yüksək akademik göstəricilərinə və fəallığına görə "İlin iştirakçısi" adını qazanmışdır.</p><p style="text-align: justify;">Universitet həyatında aktiv mövqe nümayiş etdirən gənc lider Gəncə Dövlət Universitetinin Ekoklubunun sədri kimi ətraf mühitin qorunması, ekoloji maarifləndirmə və davamlı inkişaf istiqamətində müxtəlif yerli və regional layihələrə rəhbərlik edir. Yalnız ictimai fəaliyyətlərlə kifayətlənməyən Mirfəqan Hacıyev elmi-tədqiqat sahəsində də fəaldır; o, ekologiya və müasir elmi istiqamətlərə həsr olunmuş bir sıra elmi məqalələr yazmış, həmçinin yerli və beynəlxalq səviyyəli çoxsaylı sertifikatlar əldə etmişdir.</p><p style="text-align: justify;">Sahibkarlıq və idarəetmə sahəsində uğurlu addımlar atan Mirfəqan King Education Company rəhbəri kimi fəaliyyət göstərir, eyni zamanda kurslarda tədris prosesini həyata keçirərək peşəkar bilik və təcrübəsini iştirakçılarlə bölüşür. Qrafik dizayn, SMM (sosial media marketinq) və targetinq sahələrində dərin biliklərə malik olan mütəxəssis, əldə etdiyi praktiki bacarıqları və təlimçilik təcrübəsini özünün "Effektiv Təlimçilik sənəti" və "Rəqəmsal Marketinq" adlı kitablarında oxuculara təqdim etmişdir.</p><p style="text-align: justify;">Peşəkar inkişaf və maarifləndirmə missiyasını davam etdirərək müxtəlif platformalarda və təlimlərdə spiker kimi çıxış etmiş, təqdimatları ilə gənclərə motivasiya vermişdir. Zəngin yaradıcılıq potensialına malik olan Mirfəqan Hacıyev ümumilikdə bir neçə kitabın müəllifidir; bunlardan biri Gəncə Dövlət Universitetində təhsil alan iki rus iştirakçınin fantastik macəralarından bəhs edən "Sevgi və Zaman Qanunu" adlı romandır, eyni zamanda o, bədii yaradıcılığa olan sevgisi nəticəsində təsirli şeirlər də qələmə alır. Qarşısına qoyduğu elmi-akademik və peşəkar hədəflər çərçivəsində beynəlxalq ekoloji platformalarda Azərbaycanı layiqincə təmsil etməyi, eləcə də rəhbərlik etdiyi King Education Company-ni ölkənin aparıcı və innovativ təhsil mərkəzlərindən birinə çevirməyi planlaşdıran Mirfəqan Hacıyev məqsədyönlü fəaliyyətini əzmlə davam etdirir.</p>`;

  const bioText = settings?.directorBio || defaultText;
  const leaderName = settings?.directorName || "Mirfəqan Hacıyev Vüqar oğlu";
  const leaderTitle = settings?.directorTitle || "King Education Company - Direktor";
  const leaderImage = settings?.directorImage || "/img/rehber.jpeg";
  const imageVisible = settings?.leaderImageVisible !== "false" && settings?.leaderImageVisible !== false;

  const phone = settings?.directorPhone || "010 379 08 74";
  const email = settings?.directorEmail || "haciMirfəqan@gmail.com";
  const instagram = settings?.directorInsta || "@mirfagann";

  const cleanPhone = phone.replace(/^(📞\s*Telefon:\s*|Telefon:\s*|📞\s*)/i, "").trim();
  const cleanEmail = email.replace(/^(📧\s*E-poçt:\s*|E-poçt:\s*|📧\s*)/i, "").trim();
  const cleanInsta = instagram.replace(/^(📷\s*Instagram:\s*|Instagram:\s*|📷\s*)/i, "").trim();

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

  const s1 = parseStat(settings?.directorStat1Val || "4+", 4, "+");
  const s2 = parseStat(settings?.directorStat2Val || "195+", 195, "+");
  const s3 = parseStat(settings?.directorStat3Val || "48+", 48, "+");

  const infoVisible = settings?.leaderInfoVisible !== "false" && settings?.leaderInfoVisible !== false;
  const contactVisible = settings?.leaderContactVisible !== "false" && settings?.leaderContactVisible !== false;
  const statsVisible = settings?.leaderStatsVisible !== "false" && settings?.leaderStatsVisible !== false;
  const bioVisible = settings?.leaderBioVisible !== "false" && settings?.leaderBioVisible !== false;

  return (
    <div className="rehberlik-page container" style={{ paddingTop: '120px', paddingBottom: '4rem' }}>
      <motion.div 
        className="rehberlik-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="page-title text-gradient" style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '3rem' }}>
          Rəhbərlik
        </h1>
      </motion.div>

      <div className="rehberlik-content">
        {imageVisible && (
          <motion.div 
            className="rehberlik-image-wrapper"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img 
              src={formatImageUrl(leaderImage)} 
              alt={`${leaderName} - KİNG Education Rəhbəri`}
              className="rehber-image" 
            />
            <Link href="/ceo-login" className="rehber-badge" style={{ textDecoration: 'none', color: 'inherit' }}>
              Təsisçi & Rəhbər
            </Link>
          </motion.div>
        )}

        <motion.div 
          className="rehberlik-info"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {infoVisible && (
            <>
              <h2 className="rehber-name">{leaderName}</h2>
              <p className="rehber-subtitle">{leaderTitle}</p>
            </>
          )}
          
          {bioVisible && (
            <div className="rehber-bio rich-text-display">
              {bioText.split('\n').map((para, idx) => {
                if (!para.trim()) return null;
                return <p key={idx} style={{ textAlign: "justify" }}>{para}</p>;
              })}
            </div>
          )}
          
          {/* CEO Contact Info (A5, A6, A7) */}
          {contactVisible && (
            <div className="ceo-contact-card" style={{ background: 'var(--bg-color)', padding: '1.75rem 2.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)', marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                  </svg>
                </span>
                <span>{cleanPhone}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #EA4335, #D23F31)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(234, 67, 53, 0.35)', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <a href={`mailto:${cleanEmail}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '700', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-main)'}>
                  {cleanEmail}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)' }}>
                <span style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 15px rgba(214, 36, 159, 0.4)', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </span>
                <a href={`https://instagram.com/${cleanInsta.replace("@", "")}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '700', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='var(--primary)'} onMouseOut={e => e.currentTarget.style.color='var(--text-main)'}>
                  {cleanInsta.startsWith("@") ? cleanInsta : `@${cleanInsta}`}
                </a>
              </div>
            </div>
          )}
          
          {statsVisible && (
            <div className="rehber-stats">
              <motion.div 
                className="stat-item"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="stat-number"><CountUp end={s1.num} suffix={s1.suffix} hasSeparator={s1.hasSeparator} duration={2} /></span>
                <span className="stat-label">{settings?.directorStat1Label || "İllik Təcrübə"}</span>
              </motion.div>

              <motion.div 
                className="stat-item"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="stat-number"><CountUp end={s2.num} suffix={s2.suffix} hasSeparator={s2.hasSeparator} duration={2.5} /></span>
                <span className="stat-label">{settings?.directorStat2Label || "Uğurlu Məzun"}</span>
              </motion.div>

              <motion.div 
                className="stat-item"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="stat-number"><CountUp end={s3.num} suffix={s3.suffix} hasSeparator={s3.hasSeparator} duration={2.2} /></span>
                <span className="stat-label">{settings?.directorStat3Label || "Təlim & Marafon"}</span>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
