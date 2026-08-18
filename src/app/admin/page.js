"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, LogOut, Settings, Users, BarChart3, PlusCircle, 
  Search, Edit, Trash2, GraduationCap, Video, Book, BookOpen, Trophy, Info, Key, Share2, Crown, HeartHandshake, ChevronDown, Bell, MessageSquare, MoreVertical, Moon, Sun, Lock, X, Menu, TrendingUp, Target, Save, LayoutTemplate, Eye, EyeOff, Upload, Star
} from "lucide-react";
import DataManagementPanel from "@/components/admin/DataManagementPanel";
import imageCompression from 'browser-image-compression';
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useCustomAlert } from "@/context/AlertContext";
import { formatImageUrl } from "@/lib/imageUrl";

export default function AdminPage() {
  const { showAlert, showConfirm } = useCustomAlert();

  const { admin, adminLogout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const [students, setStudents] = useState([]);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [viewingFavoritesStudent, setViewingFavoritesStudent] = useState(null);
  const [userTags, setUserTags] = useState({});

  const [dbDataState, setDbDataState] = useState({
    kurslar: [],
    telimler: [],
    marafonlar: [],
    kitablar: [],
    social: [],
    ai_knowledge: []
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [stats, setStats] = useState({ kurslar: 0, telimler: 0, marafonlar: 0, kitablar: 0 });

  const loadSpecificData = async (category) => {
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_specific", sheetName: category })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setDbDataState(prev => ({
          ...prev,
          [category]: data.data
        }));
      }
      setDataLoaded(true);
    } catch (e) {
      console.error(e);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_stats" })
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (activeMenu.startsWith("content_")) {
      const category = activeMenu.split("content_")[1];
      loadSpecificData(category);
    }
    if (activeMenu === "dashboard") {
      loadStats();
    }
  }, [activeMenu]);

  const [searchStudent, setSearchStudent] = useState("");
  const [tagModalData, setTagModalData] = useState({ isOpen: false, student: null, currentTag: '' });
  
  // Settings State
  const [homeSettings, setHomeSettings] = useState({
    stat_1_label: "Təlim və Kurs İştirakçısı", stat_1_value: "15.000+", stat_1_show: true,
    stat_2_label: "Uğurlu Məzun və Karyera", stat_2_value: "200+", stat_2_show: true,
    stat_3_label: "Keyfiyyət və Peşəkarlıq", stat_3_value: "100%", stat_3_show: true,
    stat_4_label: "Peşəkar Təlimçi", stat_4_value: "50", stat_4_show: true,
    stat_5_label: "Könüllülük proqramı", stat_5_value: "10", stat_5_show: true,

    about_section_title: "King Education Company MMC",
    about_section_text: "Azərbaycanın gənclərinin inkişafına həsr olunmuş, təhsil və maarifçilik sahəsində dinamik fəaliyyəti ilə seçilən müasir təhsil mərkəzidir.",
    about_section_show: true,
    featured_banner_show: true,
    maintenance_mode: false,

    aboutSubtitle1: "RƏSMİ TƏHSİL VƏ İNKİŞAF MƏRKƏZİ",
    aboutTitle1: "King Education Company",
    aboutText1: "Azərbaycanın gənclərinin inkişafına həsr olunmuş, təhsil və maarifçilik sahəsində dinamik fəaliyyəti ilə seçilən müasir təhsil mərkəzidir. Bizim məqsədimiz sadəcə dərs keçmək deyil, gənclərin həyatına yeni biliklər, bacarıqlar və fürsətlər qazandırmaqdır.",
    aboutTitle2: "Yaranma və İnkişaf Yolu",
    aboutText2: "Şirkətin əsası məktəbli illərindən gənclərin inkişafına dəstək olmaq istəyən Mirfəqan Hacıyev tərəfindən qoyulmuşdur. O, kiçik yaşlarından müxtəlif layihələr təşkil edərək həmyaşıdlarını bir araya toplamağa nail olmuş, zamanla bu təşəbbüsləri rəsmi fəaliyyətə çevirmişdir. 24 avqust 2023-cü ildə təsis edilən təşəbbüs, 11 fevral 2025-ci ildən etibarən \"King Education Company\" adı ilə rəsmi fəaliyyətini davam etdirir.",
    aboutTitle3: "Fəaliyyət və Nəticələr",
    aboutText3: "15.000+ iştirakçı müxtəlif kurs, marafon və seminarlarımızda iştirak edib. 200+ məzun əldə etdikləri biliklərlə təhsillərinə və karyeralarına yeni istiqamət veriblər.",
    aboutStat1Label: "Təlim və Kurs İştirakçısı",
    aboutStat1Val: "15.000+",
    aboutStat2Label: "Uğurlu Məzun və Karyera",
    aboutStat2Val: "200+",
    aboutStat3Label: "Keyfiyyət və Peşəkarlıq",
    aboutStat3Val: "100%",
    aboutMilestone1Date: "24 Avqust 2023",
    aboutMilestone1Text: "Təşəbbüsün əsasının qoyulması və ilk gənclər layihələrinin təşkili",
    aboutMilestone2Date: "11 Fevral 2025",
    aboutMilestone2Text: "Rəsmi MMC statusu alaraq \"King Education Company\" kimi tam peşəkar fəaliyyət",
    aboutCtaSubtitle: "GƏLƏCƏYİN LİDERLƏRİ",
    aboutCtaBtnText: "Bütün Kurslara Bax",
    aboutCtaBtnLink: "/kurslar",

    directorName: "Mirfəqan Hacıyev Vüqar oğlu",
    directorTitle: "King Education Company - Direktor",
    directorBio: "Mirfəqan Hacıyev 2007-ci il mayın 11-də Goranboy rayonunun Tapqaraqoyunlu kəndində anadan olmuşdur. O, 2013–2024-cü illərdə Tapqaraqoyunlu kənd N. Aslanov adına ümumitəhsil məktəbini başa vurmuş, məktəb illərindən etibarən öz çalışqanlığı, liderlik keyfiyyətləri və elmi-ictimai fəallığı ilə seçilmişdir. Erkən yaşda valideynlərini itirməsinə baxmayaraq, formalaşdırdığı güclü intizam, iradə və özünüinkişaf əzmi sayəsində qısa müddət ərzində mühüm nailiyyətlərə imza atmışdır; hazırda Gəncə Dövlət Universitetinin Ekologiya mühəndisliyi ixtisasının iştirakçısi olmaqla yanaşı, yüksək akademik göstəricilərinə və fəallığına görə \"İlin iştirakçısi\" adını qazanmışdır.\n\nUniversitet həyatında aktiv mövqe nümayiş etdirən gənc lider Gəncə Dövlət Universitetinin Ekoklubunun sədri kimi ətraf mühitin qorunması, ekoloji maarifləndirmə və davamlı inkişaf istiqamətində müxtəlif yerli və regional layihələrə rəhbərlik edir. Yalnız ictimai fəaliyyətlərlə kifayətlənməyən Mirfəqan Hacıyev elmi-tədqiqat sahəsində də fəaldır; o, ekologiya və müasir elmi istiqamətlərə həsr olunmuş bir sıra elmi məqalələr yazmış, həmçinin yerli və beynəlxalq səviyyəli çoxsaylı sertifikatlar əldə etmişdir.\n\nSahibkarlıq və idarəetmə sahəsində uğurlu addımlar atan Mirfəqan King Education Company rəhbəri kimi fəaliyyət göstərir, eyni zamanda kurslarda tədris prosesini həyata keçirərək peşəkar bilik və təcrübəsini iştirakçılarlə bölüşür. Qrafik dizayn, SMM (sosial media marketinq) və targetinq sahələrində dərin biliklərə malik olan mütəxəssis, əldə etdiyi praktiki bacarıqları və təlimçilik təcrübəsini özünün \"Effektiv Təlimçilik sənəti\" və \"Rəqəmsal Marketinq\" adlı kitablarında oxuculara təqdim etmişdir.\n\nPeşəkar inkişaf və maarifləndirmə missiyasını davam etdirərək müxtəlif platformalarda və təlimlərdə spiker kimi çıxış etmiş, təqdimatları ilə gənclərə motivasiya vermişdir. Zəngin yaradıcılıq potensialına malik olan Mirfəqan Hacıyev ümumilikdə bir neçə kitabın müəllifidir; bunlardan biri Gəncə Dövlət Universitetində təhsil alan iki rus iştirakçınin fantastik macəralarından bəhs edən \"Sevgi və Zaman Qanunu\" adlı romandır, eyni zamanda o, bədii yaradıcılığa olan sevgisi nəticəsində təsirli şeirlər də qələmə alır. Qarşısına qoyduğu elmi-akademik və peşəkar hədəflər çərçivəsində beynəlxalq ekoloji platformalarda Azərbaycanı layiqincə təmsil etməyi, eləcə də rəhbərlik etdiyi King Education Company-ni ölkənin aparıcı və innovativ təhsil mərkəzlərindən birinə çevirməyi planlaşdıran Mirfəqan Hacıyev məqsədyönlü fəaliyyətini əzmlə davam etdirir.",
    directorPhone: "010 379 08 74",
    directorEmail: "haciMirfəqan@gmail.com",
    directorInsta: "mirfagann",
    directorStat1Label: "İllik Təcrübə", directorStat1Val: "4+",
    directorStat2Label: "Uğurlu Məzun", directorStat2Val: "195+",
    directorStat3Label: "Təlim & Marafon", directorStat3Val: "48+",
    directorImage: "/img/rehber.jpeg",

    premium_whatsapp: "0103790874",
    premium_price_1: "17.99",
    premium_price_3: "27.99",
    premium_price_6: "59.99",
    premium_price_12: "111.99",

    phone: "010 379 08 74",
    email: "info@kingsedu.az",
    whatsapp_contact: "https://api.whatsapp.com/send/?phone=0103790874",
    instagram: "https://www.instagram.com/king.edu.az",
    tiktok: "https://www.tiktok.com/@king.edu.az",
    facebook: "https://www.facebook.com/profile.php?id=61591124085845",
    telegram: "https://t.me/+XokLJzABCDE3NWQy",
    linkedin: "https://www.linkedin.com/in/king-education-company-mmc-528162415",
    footer_description_text: "Peşəkar, premium və sürətli təhsil platforması. Biz tamamilə onlayn fəaliyyət göstəririk və gələcəyinizi bizimlə qurmağa dəvət edirik.",
    footer_copyright_text: "King Education Company MMC - 2026 bütün Hüquqlar qorunur"
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isUploadingBannerImg, setIsUploadingBannerImg] = useState({ idx: null, status: false });
  const [isUploadingDirectorImg, setIsUploadingDirectorImg] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  
  const handleDirectorImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingDirectorImg(true);
    try {
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1200, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        const base64data = reader.result;
        const response = await fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            action: "upload_image", 
            fileName: `director_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`, 
            mimeType: compressedFile.type, 
            base64Data: base64data.split(',')[1] 
          })
        });
        const resData = await response.json();
        if (resData.success && resData.url) {
          handleHomeSettingChange('directorImage', resData.url);
        } else {
          showAlert("Şəkil yüklənərkən xəta baş verdi.");
        }
        setIsUploadingDirectorImg(false);
      };
    } catch (err) {
      console.error(err);
      showAlert("Şəkil yüklənmədi.");
      setIsUploadingDirectorImg(false);
    }
  };

  const saveWhatsAppNumbers = async () => {
    try {
      await fetch("/api/admin/data", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_home_settings", key: "wa_courses", value: homeSettings.wa_courses || "" })
      });
      await fetch("/api/admin/data", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_home_settings", key: "wa_trainings", value: homeSettings.wa_trainings || "" })
      });
      await fetch("/api/admin/data", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_home_settings", key: "wa_marathons", value: homeSettings.wa_marathons || "" })
      });
      showAlert("WhatsApp nömrələri uğurla yadda saxlanıldı!");
    } catch(e) {
      showAlert("Xəta baş verdi");
    }
  };

  const handleBannerImageUpload = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingBannerImg({ idx, status: true });
    try {
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1200, useWebWorker: true };
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
              fileName: `banner_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`, 
              mimeType: compressedFile.type, 
              base64Data: base64String 
            })
          });
          const data = await res.json();
          if (data.success) {
            handleUpdateBanner(idx, 'image', data.url);
          } else {
            showAlert("Şəkil yüklənərkən xəta: " + data.message);
          }
        } catch (err) {
          showAlert("Server xətası!");
        } finally {
          setIsUploadingBannerImg({ idx: null, status: false });
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      showAlert("Şəkil sıxışdırılmasında xəta: " + error.message);
      setIsUploadingBannerImg({ idx: null, status: false });
    }
  };

  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!admin) {
        router.push("/ceo-login");
      } else {
        const allowedAdmins = ["mirfəqaninnotebooku@gmail.com", "mirfeqaninnotebooku@gmail.com", "kingeducationcompanymmc@gmail.com"];
        if (!admin.isAdmin || !allowedAdmins.includes((admin.email || "").toLowerCase())) {
          router.push("/ceo-login");
        }
      }
    }
  }, [admin, mounted, router]);

  useEffect(() => {
    if ((activeMenu === "home_settings" || activeMenu === "premium") && !settingsLoaded) {
      const loadSettings = async () => {
        try {
          const res = await fetch(`/api/admin/data?t=${Date.now()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "get_all", bypass_cache: true })
          });
          const data = await res.json();
          if (data.success && data.data && data.data.settings) {
            const s = data.data.settings;
            const defaultPremiumPackages = [
              { id: 1, title: "1 Aylıq Paket", price: s.premium_price_1 || "17.99", popular: false, features: ["Bütün dərslərə giriş", "Aylıq sınaqlar", "Telegram dəstək qrupu"] },
              { id: 3, title: "3 Aylıq Paket", price: s.premium_price_3 || "27.99", popular: true, features: ["Bütün dərslərə giriş", "Limitsiz sınaqlar", "VIP Telegram qrupu", "Həftəlik canlı sual-cavab"] },
              { id: 6, title: "6 Aylıq Paket", price: s.premium_price_6 || "59.99", popular: false, features: ["Bütün dərslərə giriş", "Limitsiz sınaqlar", "VIP Telegram qrupu", "Fərdi mentorluq sessiyası (1 dəfə)"] },
              { id: 12, title: "1 İllik Paket", price: s.premium_price_12 || "111.99", popular: false, features: ["Bütün dərslərə giriş", "Limitsiz sınaqlar", "VIP Telegram qrupu", "Fərdi mentorluq (Hər ay)", "Pulsuz təlim və marafonlar"] }
            ];

            const defaultBanners = [
              {
                id: 1,
                show: true,
                title: "Süni İntellektlə Biznesin idarəedilməsi Təlimi",
                description: "Yalnız bu həftə qeydiyyatdan keçənlərə xüsusi 20% ENDİRİM!",
                linkText: "İndi Endirimlə Qoşul",
                image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop",
                link: "/telimler",
                pills: ["🎯 AI & ChatGPT", "🚀 Biznes Avtomatlaşdırma", "🎓 Sertifikatlı Təhsil"],
                top_card: { title: "100% Praktiki", sub: "Real layihələr" },
                bottom_card: { title: "+5x Məhsuldarlıq", sub: "Biznesdə sıçrayış" }
              }
            ];

            let parsedBanners = defaultBanners;
            if (s.custom_banners_data && typeof s.custom_banners_data === 'string') {
              try {
                const b = JSON.parse(s.custom_banners_data);
                if (Array.isArray(b) && b.length > 0) {
                  parsedBanners = b;
                }
              } catch (e) {}
            }

            let pUsers = {};
            try { pUsers = JSON.parse(s.user_tags || '{}'); } catch(e){}
            setUserTags(pUsers);

            setHomeSettings(prev => ({
              ...prev,
              ...s,
              maintenance_mode: s.maintenance_mode === "true",
              custom_banners_data: parsedBanners,
              about_features_data: s.about_features_data ? JSON.parse(s.about_features_data) : [],
              premium_packages_data: s.premium_packages_data && s.premium_packages_data !== "[]" ? JSON.parse(s.premium_packages_data) : defaultPremiumPackages
            }));
            setSettingsLoaded(true);
          }
        } catch (err) {
          console.error("Settings load error:", err);
        }
      };
      loadSettings();
    }
  }, [activeMenu, settingsLoaded]);

  useEffect(() => {
    if ((activeMenu === "students" || activeMenu === "dashboard") && !studentsLoaded) {
      const loadStudents = async () => {
        try {
          const res = await fetch(`/api/admin/data?t=${Date.now()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "student_get_all" })
          });
          const data = await res.json();
          if (data.success && data.students) {
            setStudents(data.students);
          }
          setStudentsLoaded(true);
        } catch (error) {
          console.error(error);
        }
      };
      loadStudents();
    }
  }, [activeMenu, studentsLoaded]);

  const allowedAdmins = ["mirfəqaninnotebooku@gmail.com", "mirfeqaninnotebooku@gmail.com", "kingeducationcompanymmc@gmail.com"];
  if (!mounted || !admin || !admin.isAdmin || !allowedAdmins.includes((admin.email || "").toLowerCase())) return null;

  const handleLogout = () => {
    adminLogout();
    router.push("/ceo-login");
  };

  const handleSetUserTag = (student) => {
    const currentTag = userTags[student.id || student.username] || "";
    setTagModalData({ isOpen: true, student, currentTag });
  };

  const saveUserTag = async () => {
    const { student, currentTag } = tagModalData;
    if (!student) return;

    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_user_tag", id: student.id || student.username, tag: currentTag.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setUserTags(data.user_tags || {});
        showAlert("Teq uğurla yeniləndi");
        setTagModalData({ isOpen: false, student: null, currentTag: '' });
      }
    } catch(e) {
      showAlert("Xəta baş verdi");
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Statistika", icon: <BarChart3 size={20} /> },
    { id: "students", label: "İştirakçılar", icon: <Users size={20} /> },
    { id: "home_settings", label: "Ana Səhifə", icon: <LayoutTemplate size={20} /> },
      { id: "premium", label: "Premium Paketlər", icon: <Crown size={20} /> },
    { id: "about", label: "Haqqımızda", icon: <Info size={20} /> },
    { id: "leadership", label: "Rəhbərlik", icon: <ShieldCheck size={20} /> },
  ];

  const contentSubItems = [
    { id: "content_kurslar", label: "Kurslar", icon: <BookOpen size={16} /> },
    { id: "content_telimler", label: "Təlimlər", icon: <Video size={16} /> },
    { id: "content_marafonlar", label: "Marafonlar", icon: <Trophy size={16} /> },
    { id: "content_konulluluk", label: "Könüllülük", icon: <Users size={16} /> },
    { id: "content_kitablar", label: "Kitablar", icon: <BookOpen size={16} /> },
    { id: "content_ai_knowledge", label: "Ai Şahzadə", icon: <Crown size={16} /> },
    { id: "content_social", label: "Sosial Media", icon: <Share2 size={16} /> }
  ];

  const handleMenuClick = (id) => {
    setActiveMenu(id);
    if (id.startsWith("content_")) {
      setIsContentExpanded(true);
    } else {
      setIsContentExpanded(false);
    }
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  };

  const handleHomeSettingChange = (key, value) => {
    setHomeSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveHomeSettings = async () => {
    setIsSavingSettings(true);
    try {
      const keys = Object.keys(homeSettings);
      const settingsToSave = {};
      
      for (const key of keys) {
        let valToSave = homeSettings[key];
        if (typeof valToSave === 'object' && valToSave !== null) {
          valToSave = JSON.stringify(valToSave);
        }
        settingsToSave[key] = valToSave;
      }
      
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_settings_batch",
          settings: settingsToSave
        })
      });
      
      if (res.ok) {
        showAlert("Tənzimləmələr uğurla yadda saxlanıldı!");
      } else {
        showAlert("Xəta baş verdi (Server xətası).");
      }
    } catch (error) {
      console.error("Save settings error:", error);
      showAlert("Xəta baş verdi.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleAddFeature = () => {
    const newFeature = { id: Date.now(), text: "Yeni Kart", icon: "Star", color: "primary", show: true };
    setHomeSettings(prev => ({ ...prev, about_features_data: [...(prev.about_features_data || []), newFeature] }));
  };
  const handleUpdateFeature = (index, field, value) => {
    setHomeSettings(prev => {
      const arr = [...(prev.about_features_data || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, about_features_data: arr };
    });
  };
  const handleDeleteFeature = (index) => {
    setHomeSettings(prev => {
      const arr = [...(prev.about_features_data || [])];
      arr.splice(index, 1);
      return { ...prev, about_features_data: arr };
    });
  };

  const handleAddPremiumPackage = () => {
    const newPkg = { id: Date.now(), months: 1, title: "Yeni Paket", price: "0.00", popular: false, features: ["Xüsusiyyət 1", "Xüsusiyyət 2"] };
    setHomeSettings(prev => ({ ...prev, premium_packages_data: [...(prev.premium_packages_data || []), newPkg] }));
  };
  const handleUpdatePremiumPackage = (index, field, value) => {
    setHomeSettings(prev => {
      const arr = [...(prev.premium_packages_data || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, premium_packages_data: arr };
    });
  };
  const handleDeletePremiumPackage = async (index) => {
    if(!await showConfirm("Paketi silmək istədiyinizə əminsiniz?")) return;
    setHomeSettings(prev => {
      const arr = [...(prev.premium_packages_data || [])];
      arr.splice(index, 1);
      return { ...prev, premium_packages_data: arr };
    });
  };

  const handleAddBanner = () => {
    setHomeSettings(prev => ({
      ...prev,
      custom_banners_data: [
        ...(prev.custom_banners_data || []),
        { id: Date.now(), title: "", description: "", link: "", image: "", show: true, pills: [], top_card: {title: "", sub: ""}, bottom_card: {title: "", sub: ""} }
      ]
    }));
  };

  const handleUpdateBanner = (index, field, value) => {
    setHomeSettings(prev => {
      const arr = [...(prev.custom_banners_data || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, custom_banners_data: arr };
    });
  };
  const handleDeleteBanner = async (index) => {
    if(!await showConfirm("Banneri silmək istədiyinizə əminsiniz?")) return;
    setHomeSettings(prev => {
      const arr = [...(prev.custom_banners_data || [])];
      arr.splice(index, 1);
      return { ...prev, custom_banners_data: arr };
    });
  };

  const handleDeleteStudent = async (studentId) => {
    if (!await showConfirm("İştirakçını silmək istədiyinizə əminsiniz?")) return;
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "student_delete", id: studentId })
      });
      const data = await res.json();
      if (data.success) {
        setStudents(prev => prev.filter(s => s.id !== studentId));
      } else {
        alert("Silinmə zamanı xəta baş verdi.");
      }
    } catch (e) {
      console.error(e);
      alert("Silinmə zamanı xəta baş verdi.");
    }
  };

  const getPageTitle = () => {
    if (activeMenu === "dashboard") return "Sistemin Ümumi Vəziyyəti";
    if (activeMenu === "students") return "İştirakçı İdarəetməsi";
    if (activeMenu === "about") return "Haqqımızda Səhifəsi";
    if (activeMenu === "leadership") return "Rəhbərlik Paneli";
    if (activeMenu === "content_kurslar") return "Kurslar İdarəetməsi";
    if (activeMenu === "content_telimler") return "Təlimlər İdarəetməsi";
    if (activeMenu === "content_marafonlar") return "Marafonlar İdarəetməsi";
    if (activeMenu === "content_kitablar") return "Kitablar İdarəetməsi";
    if (activeMenu === "settings") return "Tənzimləmələr";
    if (activeMenu === "home_settings") return "Ana Səhifə İdarəsi";
    if (activeMenu === "premium") return "Premium Üzvlük Paketləri";
    if (activeMenu.startsWith("content_")) {
      const subItem = contentSubItems.find(i => i.id === activeMenu);
      return subItem ? `${subItem.label} İdarəetməsi` : "Məzmun İdarəetməsi";
    }
    return "Mərkəzi İdarəetmə";
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", zIndex: 10, display: "flex", background: "var(--bg-color)" }}>
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", zIndex: 40, backdropFilter: "blur(8px)" }}
            className="lg-hidden"
          />
        )}
      </AnimatePresence>

      {/* ULTRA PREMIUM SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen || isDesktop ? 0 : -320 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "280px",
          height: "100vh",
          background: "var(--bg-alt)",
          borderRight: "1px solid var(--border-color)",
          padding: "2rem 1.5rem",
          overflowY: "auto",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          boxShadow: "10px 0 30px rgba(0,0,0,0.02)"
        }}
        className="admin-sidebar"
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", background: "linear-gradient(135deg, #FF6B00, #ff8c3a)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 8px 20px rgba(255, 107, 0, 0.3)" }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 900, margin: 0, color: "var(--text-main)", letterSpacing: "0.5px" }}>King Edu</h2>
              <p style={{ color: "var(--text-main)", opacity: 0.5, margin: 0, fontSize: "0.75rem", fontWeight: 600 }}>CEO Panel</p>
            </div>
          </div>
          <button 
            className="lg-hidden"
            onClick={() => setIsSidebarOpen(false)}
            style={{ background: "transparent", border: "none", color: "var(--text-main)", cursor: "pointer", padding: "0" }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-main)", opacity: 0.4, margin: "0.5rem 0 0.5rem 0.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>Əsas Menyu</p>
          
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "0.85rem 1rem",
                width: "100%",
                background: activeMenu === item.id ? "var(--primary)" : "transparent",
                color: activeMenu === item.id ? "white" : "var(--text-main)",
                border: "none",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
                opacity: activeMenu === item.id ? 1 : 0.7,
                boxShadow: activeMenu === item.id ? "0 8px 20px rgba(255,107,0,0.25)" : "none"
              }}
              onMouseOver={(e) => { if(activeMenu !== item.id) e.currentTarget.style.opacity = 1; e.currentTarget.style.background = activeMenu === item.id ? "var(--primary)" : "rgba(255,107,0,0.05)"; }}
              onMouseOut={(e) => { if(activeMenu !== item.id) e.currentTarget.style.opacity = 0.7; e.currentTarget.style.background = activeMenu === item.id ? "var(--primary)" : "transparent"; }}
            >
              <div>{item.icon}</div>
              {item.label}
            </button>
          ))}

          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-main)", opacity: 0.4, margin: "1.5rem 0 0.5rem 0.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>Sistem</p>

          {/* Accordion Item: Məzmun */}
          <div>
            <button
              onClick={() => setIsContentExpanded(prev => !prev)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "0.85rem 1rem",
                background: "transparent",
                color: "var(--text-main)",
                border: "none",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textAlign: "left",
                opacity: activeMenu.startsWith("content_") ? 1 : 0.7
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,107,0,0.05)"}
              onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ color: activeMenu.startsWith("content_") ? "var(--primary)" : "inherit" }}>
                  <PlusCircle size={20} />
                </div>
                <span style={{ color: activeMenu.startsWith("content_") ? "var(--primary)" : "inherit" }}>Məzmun İdarəsi</span>
              </div>
              <motion.div animate={{ rotate: isContentExpanded ? 90 : 0 }}>
                {isContentExpanded ? <X size={16} color="var(--primary)" /> : <ChevronDown size={16} opacity={0.5} />}
              </motion.div>
            </button>

            {/* Accordion Sub-items */}
            <AnimatePresence>
              {isContentExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: "hidden", marginLeft: "1.5rem", marginTop: "0.25rem", display: "flex", flexDirection: "column", gap: "0.25rem", borderLeft: "2px solid rgba(255,107,0,0.1)", paddingLeft: "0.5rem" }}
                >
                  {contentSubItems.map(subItem => (
                    <button
                      key={subItem.id}
                      onClick={() => handleMenuClick(subItem.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "0.6rem 1rem",
                        width: "100%",
                        background: activeMenu === subItem.id ? "rgba(255,107,0,0.1)" : "transparent",
                        color: activeMenu === subItem.id ? "var(--primary)" : "var(--text-main)",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textAlign: "left",
                        opacity: activeMenu === subItem.id ? 1 : 0.6
                      }}
                      onMouseOver={(e) => { if(activeMenu !== subItem.id) e.currentTarget.style.opacity = 1; }}
                      onMouseOut={(e) => { if(activeMenu !== subItem.id) e.currentTarget.style.opacity = 0.6; }}
                    >
                      {subItem.icon}
                      {subItem.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => handleMenuClick("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "0.85rem 1rem",
              width: "100%",
              background: activeMenu === "settings" ? "var(--primary)" : "transparent",
              color: activeMenu === "settings" ? "white" : "var(--text-main)",
              border: "none",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "left",
              marginTop: "auto",
              opacity: activeMenu === "settings" ? 1 : 0.7,
              boxShadow: activeMenu === "settings" ? "0 8px 20px rgba(255,107,0,0.25)" : "none"
            }}
          >
            <div><Settings size={20} /></div>
            Tənzimləmələr
          </button>
        </div>

        {/* User Profile Mini */}
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1rem" }}>
              {(admin.username || admin.name || "A").charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{admin.username || admin.name}</p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--text-main)", opacity: 0.5, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{admin.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: "transparent", border: "none", color: "var(--text-main)", opacity: 0.5, cursor: "pointer", padding: "0.5rem" }} title="Çıxış">
            <LogOut size={18} />
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main 
        style={{ 
          flex: 1, 
          marginLeft: isDesktop ? "280px" : "0",
          minHeight: "100%",
          transition: "margin-left 0.3s ease",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          width: "100%",
          overflowX: "hidden"
        }}
      >
        {/* TOP HEADER */}
        <header style={{ height: "80px", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2.5rem", background: "rgba(var(--bg-color-rgb), 0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button 
              className="lg-hidden"
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: "var(--bg-alt)", border: "1px solid var(--border-color)", color: "var(--text-main)", padding: "0.5rem", borderRadius: "8px", cursor: "pointer", display: typeof window !== "undefined" && window.innerWidth < 1024 ? "block" : "none" }}
            >
              <Menu size={20} />
            </button>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-main)" }}>
              {getPageTitle()}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ position: "relative", display: "none" }} className="md-block">
              <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-main)", opacity: 0.4 }} />
              <input 
                type="text" 
                placeholder="Axtarış..." 
                style={{ width: "250px", padding: "0.6rem 1rem 0.6rem 2.5rem", borderRadius: "100px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontSize: "0.9rem" }}
              />
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderLeft: "1px solid var(--border-color)", paddingLeft: "1.5rem" }}>
              <button style={{ background: "var(--bg-alt)", border: "1px solid var(--border-color)", color: "var(--text-main)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                <Bell size={18} />
                <span style={{ position: "absolute", top: "8px", right: "10px", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%", border: "2px solid var(--bg-alt)" }}></span>
              </button>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ background: "var(--bg-alt)", border: "1px solid var(--border-color)", color: "var(--text-main)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT WRAPPER */}
        <div style={{ padding: "clamp(1rem, 4vw, 2.5rem)", flex: 1, width: "100%", boxSizing: "border-box" }}>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeMenu}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            
            {/* DASHBOARD */}
            {activeMenu === "dashboard" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
                  {[
                    { title: "Ümumi İştirakçı", count: (students?.length || 0).toString(), trend: "Yeni", isUp: true, icon: <Users size={24} /> },
                    { title: "Aktiv Kurslar", count: (stats?.kurslar || 0).toString(), trend: "Aktiv", isUp: true, icon: <GraduationCap size={24} /> },
                    { title: "Aktiv Kitablar", count: (stats?.kitablar || 0).toString(), trend: "Aktiv", isUp: true, icon: <Book size={24} /> },
                    { title: "Aktiv Təlimlər", count: (stats?.telimler || 0).toString(), trend: "Aktiv", isUp: true, icon: <Video size={24} /> }
                  ].map((stat, i) => (
                    <div key={i} style={{ background: "var(--bg-alt)", padding: "1.5rem", borderRadius: "24px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,107,0,0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {stat.icon}
                        </div>
                        <span style={{ padding: "0.25rem 0.5rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, background: stat.isUp ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: stat.isUp ? "#10b981" : "#ef4444" }}>
                          {stat.trend}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1.2, color: "var(--text-main)" }}>{stat.count}</div>
                        <div style={{ fontSize: "0.9rem", color: "var(--text-main)", opacity: 0.6, fontWeight: 600 }}>{stat.title}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Son Qeydiyyatlar</h3>
                    <button style={{ background: "transparent", border: "none", color: "var(--primary)", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", whiteSpace: "nowrap" }}>Hamısına Bax</button>
                  </div>
                  <div style={{ overflowX: "auto", width: "100%" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                        <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", color: "var(--text-main)", opacity: 0.5, fontWeight: 600 }}>İstifadəçi</th>
                        <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", color: "var(--text-main)", opacity: 0.5, fontWeight: 600 }}>Tarix</th>
                        <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.85rem", color: "var(--text-main)", opacity: 0.5, fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                        {(!students || students.length === 0) ? (
                          <tr>
                            <td colSpan="3" style={{ padding: "2rem", textAlign: "center", opacity: 0.5, fontWeight: 500 }}>
                              Hələ qeydiyyatdan keçən yoxdur
                            </td>
                          </tr>
                        ) : (
                          [...students]
                            .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()))
                            .slice(0, 5).map(student => (
                            <tr key={student.id || student.username} style={{ borderBottom: "1px solid var(--border-color)" }}>
                              <td style={{ padding: "1.25rem", fontWeight: 600 }}>{student.name || student.username}</td>
                              <td style={{ padding: "1.25rem", opacity: 0.6 }}>{new Date(student.created_at || Date.now()).toLocaleDateString('az-AZ')}</td>
                              <td style={{ padding: "1.25rem" }}>
                                <span style={{ padding: "4px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>Aktiv</span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* STUDENTS */}
            {activeMenu === "students" && (
              <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>Bütün İştirakçılar</h3>
                  <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
                    <Search size={18} style={{ position: "absolute", left: "1.2rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-main)", opacity: 0.4 }} />
                    <input 
                      type="text" 
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      placeholder="Ad və ya Email axtar..."
                      style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.8rem", borderRadius: "100px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontSize: "0.9rem" }}
                    />
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                    <thead>
                      <tr style={{ background: "var(--bg-color)", borderRadius: "12px" }}>
                        <th style={{ padding: "1.25rem", textAlign: "left", fontSize: "0.85rem", color: "var(--text-main)", opacity: 0.5, fontWeight: 600, borderTopLeftRadius: "12px", borderBottomLeftRadius: "12px" }}>İstifadəçi Adı</th>
                        <th style={{ padding: "1.25rem", textAlign: "left", fontSize: "0.85rem", color: "var(--text-main)", opacity: 0.5, fontWeight: 600 }}>Email</th>
                        <th style={{ padding: "1.25rem", textAlign: "left", fontSize: "0.85rem", color: "var(--text-main)", opacity: 0.5, fontWeight: 600 }}>Qeydiyyat Tarixi</th>
                        <th style={{ padding: "1.25rem", textAlign: "right", fontSize: "0.85rem", color: "var(--text-main)", opacity: 0.5, fontWeight: 600, borderTopRightRadius: "12px", borderBottomRightRadius: "12px" }}>Əməliyyat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.filter(s => (s.name || "").toLowerCase().includes(searchStudent.toLowerCase()) || (s.email || "").toLowerCase().includes(searchStudent.toLowerCase())).length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ padding: "2rem", textAlign: "center", opacity: 0.5, fontWeight: 500 }}>
                            Hələ qeydiyyatdan keçən yoxdur
                          </td>
                        </tr>
                      ) : (
                        students.filter(s => (s.name || "").toLowerCase().includes(searchStudent.toLowerCase()) || (s.email || "").toLowerCase().includes(searchStudent.toLowerCase())).map((student) => (
                          <tr key={student.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                            <td style={{ padding: "1.25rem", fontWeight: 600 }}>{student.name}</td>
                            <td style={{ padding: "1.25rem", opacity: 0.8 }}>{student.email}</td>
                            <td style={{ padding: "1.25rem", opacity: 0.6 }}>{new Date(student.created_at).toLocaleDateString('az-AZ')}</td>
                            <td style={{ padding: "1.25rem", textAlign: "right" }}>
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", alignItems: "center" }}>
                                {userTags[student.id || student.username] && (
                                  <span style={{ fontSize: "0.75rem", background: "rgba(255,107,0,0.1)", color: "var(--primary)", padding: "4px 8px", borderRadius: "100px", fontWeight: 700, marginRight: "8px" }}>
                                    {userTags[student.id || student.username]}
                                  </span>
                                )}
                                <button onClick={() => handleSetUserTag(student)} style={{ background: "transparent", border: "none", color: "var(--text-main)", opacity: 0.6, cursor: "pointer", padding: "0.5rem" }} title="Teq / Seçim Əlavə Et">
                                  <Edit size={16} />
                                </button>
                                <button onClick={() => setViewingFavoritesStudent(student)} style={{ background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", padding: "0.5rem" }} title="Ulduzladıqları">
                                  <Star size={18} />
                                </button>
                                <button onClick={() => handleDeleteStudent(student.id)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.5rem" }} title="Sil">
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PREMIUM TAB */}
              {activeMenu === "premium" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>Premium Üzvlük Paketləri</h2>
                      <p style={{ opacity: 0.6, margin: 0, fontWeight: 500 }}>Premium paketlərin siyahısını, qiymətlərini və xüsusiyyətlərini idarə edin.</p>
                    </div>
                    <button 
                      onClick={saveHomeSettings}
                      disabled={isSavingSettings}
                      style={{ padding: "0.8rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "100px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: isSavingSettings ? "not-allowed" : "pointer", boxShadow: "0 4px 15px rgba(255, 107, 0, 0.3)", opacity: isSavingSettings ? 0.7 : 1 }}
                    >
                      <Save size={18} /> {isSavingSettings ? "Yadda Saxlanılır..." : "Dəyişiklikləri Yadda Saxla"}
                    </button>
                  </div>
                  
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

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: "1.5rem" }}>
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
                               <textarea rows="4" value={(pkg.features || []).join('\n')} onChange={(e) => handleUpdatePremiumPackage(idx, 'features', e.target.value.split('\n').map(s=>s.trim()).filter(Boolean))} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", resize: "vertical", lineHeight: "1.5" }} placeholder="Bütün dərslərə giriş\nAylıq sınaqlar..." />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                               <input type="checkbox" id={`pop-${idx}`} checked={pkg.popular || false} onChange={(e) => handleUpdatePremiumPackage(idx, 'popular', e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#FF6B00", cursor: "pointer" }} />
                               <label htmlFor={`pop-${idx}`} style={{ fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>Ən çox seçilən kimi işarələ</label>
                            </div>
                          </div>
                        ))}
                        {(!homeSettings.premium_packages_data || homeSettings.premium_packages_data.length === 0) && (
                           <div style={{ padding: "2rem", textAlign: "center", opacity: 0.5, border: "1px dashed var(--border-color)", borderRadius: "16px", gridColumn: "1 / -1" }}>Paket yoxdur</div>
                        )}
                      </div>
                    </div>
                </div>
              )}

              {/* HOME SETTINGS TAB */}
            {activeMenu === "home_settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>Ana Səhifə İdarəsi</h2>
                    <p style={{ opacity: 0.6, margin: 0, fontWeight: 500 }}>Ana səhifədəki statistikaları və mətnləri buradan yeniləyin.</p>
                  </div>
                  <button 
                    onClick={saveHomeSettings}
                    disabled={isSavingSettings}
                    style={{ padding: "0.8rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "100px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: isSavingSettings ? "not-allowed" : "pointer", boxShadow: "0 4px 15px rgba(255, 107, 0, 0.3)", opacity: isSavingSettings ? 0.7 : 1 }}
                  >
                    <Save size={18} /> {isSavingSettings ? "Yadda Saxlanılır..." : "Dəyişiklikləri Yadda Saxla"}
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: "2rem" }}>
                  
                  {/* Statistics Panel */}
                  <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                      <BarChart3 size={20} color="var(--primary)" /> Ana Səhifə Statistikaları
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "var(--bg-color)", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <label style={{ fontSize: "0.9rem", opacity: 0.8, fontWeight: 700 }}>Statistika {num}</label>
                            <button 
                              onClick={() => handleHomeSettingChange(`stat_${num}_show`, !homeSettings[`stat_${num}_show`])}
                              style={{ background: homeSettings[`stat_${num}_show`] ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", color: homeSettings[`stat_${num}_show`] ? "#10b981" : "#ef4444", border: "none", padding: "0.5rem", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                              title={homeSettings[`stat_${num}_show`] ? "Gizlət" : "Göstər"}
                            >
                              {homeSettings[`stat_${num}_show`] ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                          </div>
                          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                            <input 
                              type="text" 
                              placeholder="Adı (Məzun)"
                              value={homeSettings[`stat_${num}_label`] || ""} 
                              onChange={(e) => handleHomeSettingChange(`stat_${num}_label`, e.target.value)} 
                              style={{ flex: "1 1 120px", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontWeight: 500, fontSize: "0.9rem", minWidth: 0 }} 
                            />
                            <input 
                              type="number" 
                              placeholder="Rəqəm (200)"
                              value={homeSettings[`stat_${num}_value`] || ""} 
                              onChange={(e) => handleHomeSettingChange(`stat_${num}_value`, e.target.value)} 
                              style={{ flex: "0 0 100px", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontWeight: 500, fontSize: "0.9rem", minWidth: 0 }} 
                            />
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  </div>
                  {/* Layout & Visibility */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    
                    
                    <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Info size={20} color="var(--primary)" /> Haqqımızda Bölməsi (CTA)
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Üst Sub-başlıq (Məs: Haqqımızda - RƏSMİ TƏHSİL...)</label>
                          <input type="text" value={homeSettings.about_cta_subtitle === undefined ? "Haqqımızda - RƏSMİ TƏHSİL VƏ İNKİŞAF MƏRKƏZİ" : homeSettings.about_cta_subtitle} onChange={(e) => handleHomeSettingChange('about_cta_subtitle', e.target.value)} placeholder="Haqqımızda - RƏSMİ TƏHSİL VƏ İNKİŞAF MƏRKƏZİ" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Düymə (Button) Mətni</label>
                          <input type="text" value={homeSettings.about_cta_btn_text === undefined ? "Daha Ətraflı" : homeSettings.about_cta_btn_text} onChange={(e) => handleHomeSettingChange('about_cta_btn_text', e.target.value)} placeholder="Daha Ətraflı" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Başlıq</label>
                          <input type="text" value={homeSettings.about_section_title} onChange={(e) => handleHomeSettingChange('about_section_title', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Alt Mətn</label>
                          <textarea rows="3" value={homeSettings.about_section_text} onChange={(e) => handleHomeSettingChange('about_section_text', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500, resize: "vertical" }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                        <LayoutTemplate size={20} color="var(--primary)" /> Səhifə Görünüşü
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "var(--bg-color)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>Aktual Elan / Yeni Təlim</p>
                            <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.6 }}>Ana səhifədə animasiyalı banner kimi göstər</p>
                          </div>
                          <button 
                            onClick={() => handleHomeSettingChange('featured_banner_show', !homeSettings.featured_banner_show)}
                            style={{ background: homeSettings.featured_banner_show ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: homeSettings.featured_banner_show ? "#10b981" : "#ef4444", border: "none", padding: "0.5rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            {homeSettings.featured_banner_show ? <Eye size={20} /> : <EyeOff size={20} />}
                          </button>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "var(--bg-color)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>Haqqımızda CTA</p>
                            <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.6 }}>Aşağıdakı Rəsmi Təhsil Mərkəzi bloku</p>
                          </div>
                          <button 
                            onClick={() => handleHomeSettingChange('about_section_show', !homeSettings.about_section_show)}
                            style={{ background: homeSettings.about_section_show ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: homeSettings.about_section_show ? "#10b981" : "#ef4444", border: "none", padding: "0.5rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            {homeSettings.about_section_show ? <Eye size={20} /> : <EyeOff size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Social Media & Footer Panel */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Share2 size={20} color="var(--primary)" /> Əlaqə & Sosial Şəbəkələr
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Telefon</label>
                          <input type="text" value={homeSettings.phone} onChange={(e) => handleHomeSettingChange('phone', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Email</label>
                          <input type="text" value={homeSettings.email} onChange={(e) => handleHomeSettingChange('email', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Instagram Linki</label>
                            <input type="text" value={homeSettings.instagram} onChange={(e) => handleHomeSettingChange('instagram', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>TikTok Linki</label>
                            <input type="text" value={homeSettings.tiktok} onChange={(e) => handleHomeSettingChange('tiktok', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Facebook Linki</label>
                            <input type="text" value={homeSettings.facebook} onChange={(e) => handleHomeSettingChange('facebook', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Telegram Linki</label>
                            <input type="text" value={homeSettings.telegram} onChange={(e) => handleHomeSettingChange('telegram', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>LinkedIn Linki</label>
                            <input type="text" value={homeSettings.linkedin} onChange={(e) => handleHomeSettingChange('linkedin', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>WhatsApp Birbaşa Link</label>
                            <input type="text" value={homeSettings.whatsapp_contact} onChange={(e) => handleHomeSettingChange('whatsapp_contact', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer Extra Settings */}
                    <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                        <LayoutTemplate size={20} color="var(--primary)" /> Footer (Ən Alt) Yazıları
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Footer Təsvir Mətni</label>
                          <textarea rows="3" value={homeSettings.footer_description_text} onChange={(e) => handleHomeSettingChange('footer_description_text', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500, resize: "vertical" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Müəllif Hüquqları Mətni</label>
                          <input type="text" value={homeSettings.footer_copyright_text} onChange={(e) => handleHomeSettingChange('footer_copyright_text', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banners Panel */}
                  <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", gridColumn: "1 / -1" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                        <LayoutTemplate size={20} color="var(--primary)" style={{ flexShrink: 0 }} /> Ana Səhifə Bannerləri
                      </h3>
                      <button onClick={handleAddBanner} style={{ background: "var(--primary)", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", whiteSpace: "nowrap" }}><PlusCircle size={16} /> Yeni Banner</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {homeSettings.custom_banners_data && homeSettings.custom_banners_data.map((banner, idx) => (
                        <div key={idx} style={{ background: "var(--bg-color)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border-color)", position: "relative" }}>
                          <button onClick={() => handleDeleteBanner(idx)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", padding: "0.5rem", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center" }} title="Sil">
                            <Trash2 size={18} />
                          </button>
                          
                          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap", paddingRight: "3rem" }}>
                            <div style={{ flex: "1 1 200px" }}>
                              <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Başlıq (\n ilə sətrə böl)</label>
                              <textarea rows="2" value={banner.title} onChange={(e) => handleUpdateBanner(idx, 'title', e.target.value)} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", resize: "vertical" }} />
                            </div>
                            <div style={{ flex: "1 1 200px" }}>
                              <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Alt Mətn (Endirim və s.)</label>
                              <textarea rows="2" value={banner.description} onChange={(e) => handleUpdateBanner(idx, 'description', e.target.value)} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", resize: "vertical" }} />
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                            <div style={{ flex: "1 1 150px" }}>
                              <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Şəkil Linki (və ya yüklə)</label>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <input type="text" value={banner.image} onChange={(e) => handleUpdateBanner(idx, 'image', e.target.value)} style={{ flex: 1, padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none" }} />
                                <label style={{ background: "rgba(255,107,0,0.1)", color: "var(--primary)", padding: "0 1rem", borderRadius: "10px", display: "flex", alignItems: "center", cursor: "pointer", border: "1px solid rgba(255,107,0,0.3)" }}>
                                  {isUploadingBannerImg.idx === idx && isUploadingBannerImg.status ? "..." : <Upload size={18} />}
                                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleBannerImageUpload(e, idx)} disabled={isUploadingBannerImg.status} />
                                </label>
                              </div>
                            </div>
                            <div style={{ flex: "1 1 150px" }}>
                              <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Düymə Mətni</label>
                              <input type="text" value={banner.button_text === undefined ? "İndi Endirimlə Qoşul" : banner.button_text} onChange={(e) => handleUpdateBanner(idx, 'button_text', e.target.value)} placeholder="İndi Endirimlə Qoşul" style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none" }} />
                            </div>
                            <div style={{ flex: "1 1 150px" }}>
                              <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Yönləndirmə Linki</label>
                              <input type="text" value={banner.link} onChange={(e) => handleUpdateBanner(idx, 'link', e.target.value)} style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none" }} />
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 200px" }}>
                              <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Kiçik Açar Sözlər (Pills) - Vergüllə ayırın</label>
                              <input type="text" value={(banner.pills || []).join(", ")} onChange={(e) => handleUpdateBanner(idx, 'pills', e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} placeholder="✨ AI & ChatGPT, 🏆 Sertifikatlı" style={{ width: "100%", padding: "0.8rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none" }} />
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 200px", padding: "1rem", background: "rgba(0,0,0,0.1)", borderRadius: "10px" }}>
                              <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Üst Kart</label>
                              <input type="text" value={banner.top_card?.title || ""} onChange={(e) => {
                                const newCards = {...banner};
                                if(!newCards.top_card) newCards.top_card = {};
                                newCards.top_card.title = e.target.value;
                                handleUpdateBanner(idx, 'top_card', newCards.top_card);
                              }} placeholder="Başlıq (100% Praktiki)" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", marginBottom: "5px" }} />
                              <input type="text" value={banner.top_card?.sub || ""} onChange={(e) => {
                                const newCards = {...banner};
                                if(!newCards.top_card) newCards.top_card = {};
                                newCards.top_card.sub = e.target.value;
                                handleUpdateBanner(idx, 'top_card', newCards.top_card);
                              }} placeholder="Alt mətn (Real layihələr)" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }} />
                            </div>
                            <div style={{ flex: "1 1 200px", padding: "1rem", background: "rgba(0,0,0,0.1)", borderRadius: "10px" }}>
                              <label style={{ fontSize: "0.85rem", opacity: 0.7, fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Alt Kart</label>
                              <input type="text" value={banner.bottom_card?.title || ""} onChange={(e) => {
                                const newCards = {...banner};
                                if(!newCards.bottom_card) newCards.bottom_card = {};
                                newCards.bottom_card.title = e.target.value;
                                handleUpdateBanner(idx, 'bottom_card', newCards.bottom_card);
                              }} placeholder="Başlıq (+5x Məhsuldarlıq)" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", marginBottom: "5px" }} />
                              <input type="text" value={banner.bottom_card?.sub || ""} onChange={(e) => {
                                const newCards = {...banner};
                                if(!newCards.bottom_card) newCards.bottom_card = {};
                                newCards.bottom_card.sub = e.target.value;
                                handleUpdateBanner(idx, 'bottom_card', newCards.bottom_card);
                              }} placeholder="Alt mətn (Biznesdə sıçrayış)" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }} />
                            </div>
                            <div style={{ flex: "0 0 100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                               <button onClick={() => handleUpdateBanner(idx, 'show', !banner.show)} style={{ width: "100%", background: banner.show ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: banner.show ? "#10b981" : "#ef4444", border: "none", padding: "0.8rem", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} title={banner.show ? "Gizlət" : "Göstər"}>
                                 {banner.show ? <Eye size={18} /> : <EyeOff size={18} />}
                               </button>
                            </div>
                          </div>
                          
                        </div>
                      ))}
                      {(!homeSettings.custom_banners_data || homeSettings.custom_banners_data.length === 0) && (
                         <div style={{ padding: "2rem", textAlign: "center", opacity: 0.5, border: "1px dashed var(--border-color)", borderRadius: "16px" }}>Banner yoxdur</div>
                      )}
                    </div>
                  </div>

                  {/* Features Panel */}
                  <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", gridColumn: "1 / -1" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                        <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0 }} /> Haqqımızda Xüsusiyyətlər (Kartlar)
                      </h3>
                      <button onClick={handleAddFeature} style={{ background: "var(--primary)", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "10px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", whiteSpace: "nowrap" }}><PlusCircle size={16} /> Yeni Kart</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1rem" }}>
                      {homeSettings.about_features_data && homeSettings.about_features_data.map((feature, idx) => (
                        <div key={idx} style={{ background: "var(--bg-color)", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <input type="text" placeholder="Kartın mətni" value={feature.text || ""} onChange={(e) => handleUpdateFeature(idx, 'text', e.target.value)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontSize: "0.9rem", fontWeight: 500, boxSizing: "border-box", width: "100%" }} />
                            <button onClick={() => handleDeleteFeature(idx)} style={{ flexShrink: 0, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", padding: "0.6rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Sil">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <select value={feature.icon || "Star"} onChange={(e) => handleUpdateFeature(idx, 'icon', e.target.value)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", boxSizing: "border-box", width: "100%" }}>
                              <option value="ShieldCheck">Qalxan (Zəmanət)</option>
                              <option value="Target">Hədəf (Məqsəd)</option>
                              <option value="Rocket">Raket (Sürət/Yüksəliş)</option>
                              <option value="Star">Ulduz (Keyfiyyət)</option>
                              <option value="Award">Mükafat (Uğur)</option>
                            </select>
                            <button onClick={() => handleUpdateFeature(idx, 'show', !feature.show)} style={{ flexShrink: 0, background: feature.show ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: feature.show ? "#10b981" : "#ef4444", border: "none", padding: "0.6rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} title={feature.show ? "Gizlət" : "Göstər"}>
                               {feature.show ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!homeSettings.about_features_data || homeSettings.about_features_data.length === 0) && (
                         <div style={{ padding: "1.5rem", textAlign: "center", opacity: 0.5, border: "1px dashed var(--border-color)", borderRadius: "16px", gridColumn: "1 / -1" }}>Kart yoxdur</div>
                      )}
                    </div>
                  </div>

                  {/* Contact & Social Media Panel */}
                  <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", gridColumn: "1 / -1" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                      <Share2 size={20} color="var(--primary)" /> Əlaqə və Sosial Media
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "1.5rem" }}>
                      
                      {/* Contact Info */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <h4 style={{ margin: 0, fontSize: "0.95rem", opacity: 0.8 }}>Əlaqə Məlumatları</h4>
                        
                        {['phone', 'email', 'whatsapp_contact'].map((field) => {
                          const labelMap = { phone: 'Telefon', email: 'E-poçt', whatsapp_contact: 'WhatsApp Linki' };
                          return (
                            <div key={field} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>
                                <span>{labelMap[field]}</span>
                                <button 
                                  onClick={() => handleHomeSettingChange(`${field}_show`, !homeSettings[`${field}_show`])}
                                  style={{ background: homeSettings[`${field}_show`] !== false ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", color: homeSettings[`${field}_show`] !== false ? "#10b981" : "#ef4444", border: "none", padding: "0.4rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.2s" }}
                                >
                                  {homeSettings[`${field}_show`] !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                              </label>
                              <input 
                                type={field === 'email' ? 'email' : 'text'} 
                                value={homeSettings[field] || ""} 
                                onChange={(e) => handleHomeSettingChange(field, e.target.value)} 
                                style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500, fontSize: "0.9rem" }} 
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Social Media Links */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <h4 style={{ margin: 0, fontSize: "0.95rem", opacity: 0.8 }}>Sosial Media (Linklər)</h4>
                        
                        {["instagram", "tiktok", "facebook", "telegram", "linkedin"].map((social) => (
                          <div key={social} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>
                              <span style={{ textTransform: "capitalize" }}>{social}</span>
                              <button 
                                onClick={() => handleHomeSettingChange(`${social}_show`, !homeSettings[`${social}_show`])}
                                style={{ background: homeSettings[`${social}_show`] !== false ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", color: homeSettings[`${social}_show`] !== false ? "#10b981" : "#ef4444", border: "none", padding: "0.4rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.2s" }}
                              >
                                {homeSettings[`${social}_show`] !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                            </label>
                            <input 
                              type="text" 
                              placeholder={`${social} URL`}
                              value={homeSettings[social] || ""} 
                              onChange={(e) => handleHomeSettingChange(social, e.target.value)} 
                              style={{ width: "100%", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500, fontSize: "0.9rem" }} 
                            />
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                </div>
            )}

            {/* ABOUT TAB */}
            {activeMenu === "about" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>Haqqımızda Səhifəsi</h2>
                    <p style={{ opacity: 0.6, margin: 0, fontWeight: 500 }}>Haqqımızda səhifəsindəki başlıqları və mətnləri buradan yeniləyin.</p>
                  </div>
                  <button 
                    onClick={saveHomeSettings}
                    disabled={isSavingSettings}
                    style={{ padding: "0.8rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "100px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: isSavingSettings ? "not-allowed" : "pointer", boxShadow: "0 4px 15px rgba(255, 107, 0, 0.3)", opacity: isSavingSettings ? 0.7 : 1 }}
                  >
                    <Save size={18} /> {isSavingSettings ? "Yadda Saxlanılır..." : "Dəyişiklikləri Yadda Saxla"}
                  </button>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
                  <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem" }}>1. Əsas Bölmə (Rəsmi Təhsil Və İnkişaf Mərkəzi)</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Alt Başlıq</label>
                        <input type="text" value={homeSettings.aboutSubtitle1 || ""} onChange={(e) => handleHomeSettingChange('aboutSubtitle1', e.target.value)} placeholder="Məs: RƏSMİ TƏHSİL VƏ İNKİŞAF MƏRKƏZİ" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Başlıq</label>
                        <input type="text" value={homeSettings.aboutTitle1 || ""} onChange={(e) => handleHomeSettingChange('aboutTitle1', e.target.value)} placeholder="Məs: King Education Company" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Mətn</label>
                        <textarea rows="4" value={homeSettings.aboutText1 || ""} onChange={(e) => handleHomeSettingChange('aboutText1', e.target.value)} placeholder="Əsas məlumat mətni..." style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500, resize: "vertical" }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem" }}>2. Yaranma və İnkişaf Yolu</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Başlıq</label>
                        <input type="text" value={homeSettings.aboutTitle2 || ""} onChange={(e) => handleHomeSettingChange('aboutTitle2', e.target.value)} placeholder="Məs: Yaranma və İnkişaf Yolu" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Mətn</label>
                        <textarea rows="4" value={homeSettings.aboutText2 || ""} onChange={(e) => handleHomeSettingChange('aboutText2', e.target.value)} placeholder="Tarixçə və inkişaf yolu mətni..." style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500, resize: "vertical" }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem" }}>3. Fəaliyyət və Nəticələr</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Başlıq</label>
                        <input type="text" value={homeSettings.aboutTitle3 || ""} onChange={(e) => handleHomeSettingChange('aboutTitle3', e.target.value)} placeholder="Məs: Fəaliyyət və Nəticələr" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Mətn</label>
                        <textarea rows="4" value={homeSettings.aboutText3 || ""} onChange={(e) => handleHomeSettingChange('aboutText3', e.target.value)} placeholder="Fəaliyyət və Nəticələr mətni..." style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500, resize: "vertical" }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem" }}>4. Statistikalar</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "var(--bg-color)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Statistika 1 Mətn</label>
                          <input type="text" value={homeSettings.aboutStat1Label || ""} onChange={(e) => handleHomeSettingChange('aboutStat1Label', e.target.value)} placeholder="Məs: Təlim və Kurs İştirakçısı" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Statistika 1 Rəqəm</label>
                          <input type="text" value={homeSettings.aboutStat1Val || ""} onChange={(e) => handleHomeSettingChange('aboutStat1Val', e.target.value)} placeholder="Məs: 15.000+" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "var(--bg-color)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Statistika 2 Mətn</label>
                          <input type="text" value={homeSettings.aboutStat2Label || ""} onChange={(e) => handleHomeSettingChange('aboutStat2Label', e.target.value)} placeholder="Məs: Uğurlu Məzun və Karyera" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Statistika 2 Rəqəm</label>
                          <input type="text" value={homeSettings.aboutStat2Val || ""} onChange={(e) => handleHomeSettingChange('aboutStat2Val', e.target.value)} placeholder="Məs: 200+" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "var(--bg-color)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Statistika 3 Mətn</label>
                          <input type="text" value={homeSettings.aboutStat3Label || ""} onChange={(e) => handleHomeSettingChange('aboutStat3Label', e.target.value)} placeholder="Məs: Keyfiyyət və Peşəkarlıq" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Statistika 3 Rəqəm</label>
                          <input type="text" value={homeSettings.aboutStat3Val || ""} onChange={(e) => handleHomeSettingChange('aboutStat3Val', e.target.value)} placeholder="Məs: 100%" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem" }}>5. İnkişaf Mərhələləri (Milestones)</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Tarix 1</label>
                          <input type="text" value={homeSettings.aboutMilestone1Date || ""} onChange={(e) => handleHomeSettingChange('aboutMilestone1Date', e.target.value)} placeholder="Məs: 24 Avqust 2023" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Mətn 1</label>
                          <input type="text" value={homeSettings.aboutMilestone1Text || ""} onChange={(e) => handleHomeSettingChange('aboutMilestone1Text', e.target.value)} placeholder="Məs: Təşəbbüsün əsasının qoyulması..." style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Tarix 2</label>
                          <input type="text" value={homeSettings.aboutMilestone2Date || ""} onChange={(e) => handleHomeSettingChange('aboutMilestone2Date', e.target.value)} placeholder="Məs: 11 Fevral 2025" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Mətn 2</label>
                          <input type="text" value={homeSettings.aboutMilestone2Text || ""} onChange={(e) => handleHomeSettingChange('aboutMilestone2Text', e.target.value)} placeholder="Məs: Rəsmi MMC statusu alaraq..." style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem" }}>6. CTA (Hərəkətə Çağırış) Bölməsi</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Alt Başlıq (Üstdəki Badge)</label>
                          <input type="text" value={homeSettings.aboutCtaSubtitle || ""} onChange={(e) => handleHomeSettingChange('aboutCtaSubtitle', e.target.value)} placeholder="Məs: GƏLƏCƏYİN LİDERLƏRİ" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Əsas Başlıq</label>
                          <input type="text" value={homeSettings.aboutCtaTitle || ""} onChange={(e) => handleHomeSettingChange('aboutCtaTitle', e.target.value)} placeholder="Məs: Siz də Uğur Hikayənizi Bizimlə Yazın!" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Mətn</label>
                        <textarea rows="3" value={homeSettings.aboutCtaText || ""} onChange={(e) => handleHomeSettingChange('aboutCtaText', e.target.value)} placeholder="Məs: KİNG Education ailəsinə qoşulun..." style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500, resize: "vertical" }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Pill 1</label>
                          <input type="text" value={homeSettings.aboutCtaPill1 || ""} onChange={(e) => handleHomeSettingChange('aboutCtaPill1', e.target.value)} placeholder="Məs: 🏆 +15.000 İştirakçı" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Pill 2</label>
                          <input type="text" value={homeSettings.aboutCtaPill2 || ""} onChange={(e) => handleHomeSettingChange('aboutCtaPill2', e.target.value)} placeholder="Məs: 🚀 +200 Məzun" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Pill 3</label>
                          <input type="text" value={homeSettings.aboutCtaPill3 || ""} onChange={(e) => handleHomeSettingChange('aboutCtaPill3', e.target.value)} placeholder="Məs: 💡 100% Praktiki Tədris" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Düymə (Button) Mətni</label>
                          <input type="text" value={homeSettings.aboutCtaBtnText || ""} onChange={(e) => handleHomeSettingChange('aboutCtaBtnText', e.target.value)} placeholder="Məs: Bütün Kurslara Bax" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                        <div>
                          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Düymə (Button) Linki</label>
                          <input type="text" value={homeSettings.aboutCtaBtnLink || ""} onChange={(e) => handleHomeSettingChange('aboutCtaBtnLink', e.target.value)} placeholder="Məs: /kurslar" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === "content_konulluluk" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    Menyu (Navbar) Tənzimləmələri
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Könüllülük Linki (URL)</label>
                      <input type="text" value={homeSettings.volunteerLink || ""} onChange={(e) => handleHomeSettingChange('volunteerLink', e.target.value)} placeholder="https://docs.google.com/forms/..." style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                      <input type="checkbox" id="showVolunteer" checked={homeSettings.volunteerLink_show !== false} onChange={(e) => handleHomeSettingChange('volunteerLink_show', e.target.checked)} style={{ width: "20px", height: "20px", accentColor: "var(--primary)", cursor: "pointer" }} />
                      <label htmlFor="showVolunteer" style={{ fontWeight: 600, cursor: "pointer", opacity: 0.8 }}>"Könüllülük" düyməsini menyuda göstər</label>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={saveHomeSettings} disabled={isSavingSettings} style={{ background: "var(--primary)", color: "white", border: "none", padding: "0.8rem 2rem", borderRadius: "12px", fontWeight: 700, cursor: isSavingSettings ? "not-allowed" : "pointer", opacity: isSavingSettings ? 0.7 : 1, display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.2s" }}>
                    <Save size={18} /> {isSavingSettings ? "Yadda Saxlanılır..." : "Dəyişiklikləri Yadda Saxla"}
                  </button>
                </div>
              </div>
            )}
              {/* LEADERSHIP FORM */}
            {activeMenu === "leadership" && (
              <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.5rem", fontWeight: 800 }}>Rəhbərlik Paneli</h3>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: "0.9rem" }}>Direktor haqqında məlumatları buradan idarə edin.</p>
                  </div>
                  <button 
                    onClick={saveHomeSettings}
                    disabled={isSavingSettings}
                    className="primary-btn"
                    style={{ 
                      padding: "0.8rem 1.5rem", borderRadius: "12px", border: "none", 
                      background: "var(--primary)", color: "#fff", fontWeight: 600, 
                      cursor: isSavingSettings ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", gap: "8px", opacity: isSavingSettings ? 0.7 : 1
                    }}
                  >
                    <Save size={18} />
                    {isSavingSettings ? "Yadda saxlanılır..." : "Yadda Saxla"}
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Ad və Soyad</label>
                    <input type="text" value={homeSettings.directorName || ""} onChange={(e) => handleHomeSettingChange('directorName', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Vəzifə</label>
                    <input type="text" value={homeSettings.directorTitle || ""} onChange={(e) => handleHomeSettingChange('directorTitle', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Direktor Bioqrafiyası (Abzaslar üçün Enter vurun)</label>
                  <textarea rows="10" value={homeSettings.directorBio || ""} onChange={(e) => handleHomeSettingChange('directorBio', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500, resize: "vertical", lineHeight: 1.6 }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Telefon</label>
                    <input type="text" value={homeSettings.directorPhone || ""} onChange={(e) => handleHomeSettingChange('directorPhone', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Email</label>
                    <input type="text" value={homeSettings.directorEmail || ""} onChange={(e) => handleHomeSettingChange('directorEmail', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Instagram Username</label>
                    <input type="text" value={homeSettings.directorInsta || ""} onChange={(e) => handleHomeSettingChange('directorInsta', e.target.value)} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                  </div>
                </div>

                <h4 style={{ margin: "1rem 0 0.5rem 0" }}>Statistikalar</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <input type="text" value={homeSettings.directorStat1Label || ""} onChange={(e) => handleHomeSettingChange('directorStat1Label', e.target.value)} placeholder="Etiket 1 (İllik Təcrübə)" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }} />
                  <input type="text" value={homeSettings.directorStat1Val || ""} onChange={(e) => handleHomeSettingChange('directorStat1Val', e.target.value)} placeholder="Dəyər 1 (4+)" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }} />
                  
                  <input type="text" value={homeSettings.directorStat2Label || ""} onChange={(e) => handleHomeSettingChange('directorStat2Label', e.target.value)} placeholder="Etiket 2 (Uğurlu Məzun)" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }} />
                  <input type="text" value={homeSettings.directorStat2Val || ""} onChange={(e) => handleHomeSettingChange('directorStat2Val', e.target.value)} placeholder="Dəyər 2 (196+)" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }} />
                  
                  <input type="text" value={homeSettings.directorStat3Label || ""} onChange={(e) => handleHomeSettingChange('directorStat3Label', e.target.value)} placeholder="Etiket 3 (Təlim & Marafon)" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }} />
                  <input type="text" value={homeSettings.directorStat3Val || ""} onChange={(e) => handleHomeSettingChange('directorStat3Val', e.target.value)} placeholder="Dəyər 3 (49+)" style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }} />
                </div>

                <h4 style={{ margin: "1rem 0 0.5rem 0" }}>Şəkil</h4>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <input type="text" value={homeSettings.directorImage || ""} onChange={(e) => handleHomeSettingChange('directorImage', e.target.value)} placeholder="Şəkil URL-i (Google Drive linki və ya /img/...)" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                  </div>
                  <label style={{ 
                    padding: "1rem 1.5rem", borderRadius: "12px", background: "var(--bg-color)", 
                    border: "1px solid var(--border-color)", cursor: "pointer", display: "flex", 
                    alignItems: "center", gap: "8px", fontWeight: 600, color: "var(--text-main)",
                    transition: "0.2s"
                  }}>
                    {isUploadingDirectorImg ? "..." : <Upload size={18} />}
                    {isUploadingDirectorImg ? "Yüklənir..." : "Cihazdan Yüklə"}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleDirectorImageUpload} disabled={isUploadingDirectorImg} />
                  </label>
                </div>
                {homeSettings.directorImage && (
                  <div style={{ marginTop: "1rem", borderRadius: "12px", overflow: "hidden", maxWidth: "200px", border: "1px solid var(--border-color)" }}>
                    <img src={homeSettings.directorImage} alt="Director" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}

            {activeMenu === "content_kurslar" && (
              <DataManagementPanel 
                title="Kurslar İdarəetməsi" 
                sheetName="kurslar" 
                data={dbDataState.kurslar} 
                onRefresh={() => loadSpecificData('kurslar')}
                fields={[
                  { key: 'title', label: 'Başlıq' },
                  { key: 'description', label: 'Açıqlama', type: 'textarea' },
                  { key: 'price', label: 'Qiymət' },
                  { key: 'duration', label: 'Müddət' },
                  { key: 'whatsapp_number', label: 'Özəl WhatsApp (Boş olsa ümumi olacaq)' },
                  { key: 'image', label: 'Şəkil (URL/Mənbə)', type: 'image' }
                ]} 
              />
            )}
            {activeMenu === "content_telimler" && (
              <DataManagementPanel 
                title="Təlimlər İdarəetməsi" 
                sheetName="telimler" 
                data={dbDataState.telimler} 
                onRefresh={() => loadSpecificData('telimler')}
                fields={[
                  { key: 'title', label: 'Başlıq' },
                  { key: 'description', label: 'Açıqlama', type: 'textarea' },
                  { key: 'date', label: 'Tarix' },
                  { key: 'whatsapp_number', label: 'Özəl WhatsApp (Boş olsa ümumi olacaq)' },
                  { key: 'image', label: 'Şəkil (URL/Mənbə)', type: 'image' }
                ]} 
              />
            )}
            {activeMenu === "content_marafonlar" && (
              <DataManagementPanel 
                title="Marafonlar İdarəetməsi" 
                sheetName="marafonlar" 
                data={dbDataState.marafonlar} 
                onRefresh={() => loadSpecificData('marafonlar')}
                fields={[
                  { key: 'title', label: 'Başlıq' },
                  { key: 'description', label: 'Açıqlama', type: 'textarea' },
                  { key: 'duration', label: 'Müddət' },
                  { key: 'date', label: 'Tarix' },
                  { key: 'whatsapp_number', label: 'Özəl WhatsApp (Boş olsa ümumi olacaq)' },
                  { key: 'image', label: 'Şəkil (URL/Mənbə)', type: 'image' }
                ]} 
              />
            )}
            {activeMenu === "content_kitablar" && (
              <DataManagementPanel 
                title="Kitablar İdarəetməsi" 
                sheetName="kitablar" 
                data={dbDataState.kitablar} 
                onRefresh={() => loadSpecificData('kitablar')}
                fields={[
                  { key: 'title', label: 'Başlıq' },
                  { key: 'description', label: 'Açıqlama', type: 'textarea' },
                  { key: 'price', label: 'Qiymət' },
                  { key: 'whatsapp_number', label: 'Özəl WhatsApp (Boş olsa ümumi olacaq)' },
                  { key: 'image', label: 'Şəkil (URL/Mənbə)', type: 'image' }
                ]} 
              />
            )}

            {activeMenu === "content_social" && (
              <DataManagementPanel 
                title="Sosial Media İdarəetməsi" 
                sheetName="social" 
                data={dbDataState.social || []}
                onRefresh={() => loadSpecificData('social')}
                fields={[
                  { key: 'title', label: 'Sosial Şəbəkənin Adı' },
                  { key: 'url', label: 'Link (URL)' },
                  { key: 'icon', label: 'İkon (Məs: FaInstagram)' }
                ]}
              />
            )}

            {activeMenu === "content_ai_knowledge" && (
              <DataManagementPanel 
                title="Ai Şahzadə İdarəetməsi" 
                sheetName="ai_knowledge" 
                data={dbDataState.ai_knowledge || []}
                onRefresh={() => loadSpecificData('ai_knowledge')}
                fields={[
                  { key: 'question', label: 'Sual', type: 'textarea' },
                  { key: 'answer', label: 'Cavab', type: 'textarea' }
                ]}
              />
            )}

            {activeMenu === "settings" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))", gap: "2rem" }}>
                
                {/* Profile Information */}
                <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Users size={20} color="var(--primary)" /> Profil Məlumatları
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Tam Adınız</label>
                      <input type="text" readOnly value={admin.username || admin.name || "İstifadəçi"} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", cursor: "not-allowed", fontWeight: 500 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Email Ünvanı</label>
                      <input type="email" readOnly value={admin.email} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", cursor: "not-allowed", fontWeight: 500 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Qeydiyyat Rolu</label>
                      <input type="text" readOnly value={admin.isAdmin ? "Mərkəzi İdarəetmə (CEO)" : "İştirakçı"} style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", cursor: "not-allowed", fontWeight: 700 }} />
                    </div>
                  </div>
                </div>


                {/* Appearance / Theme */}
                <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Moon size={20} color="var(--primary)" /> Görünüş (Dark/Light)
                  </h3>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "1.5rem" }}>
                    <p style={{ textAlign: "center", opacity: 0.7, fontSize: "0.95rem", lineHeight: 1.6 }}>
                      Sistemin görünüşünü öz zövqünüzə görə tənzimləyə bilərsiniz. CEO Panel üçün tünd (dark) rejim tövsiyə olunur.
                    </p>
                    <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
                      <button 
                        onClick={() => setTheme('light')}
                        style={{ flex: 1, padding: "1rem", background: theme === 'light' ? "var(--text-main)" : "var(--bg-color)", color: theme === 'light' ? "var(--bg-color)" : "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: "16px", cursor: "pointer", fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", transition: "all 0.3s" }}
                      >
                        <Sun size={18} /> Açıq
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        style={{ flex: 1, padding: "1rem", background: theme === 'dark' ? "var(--text-main)" : "var(--bg-color)", color: theme === 'dark' ? "var(--bg-color)" : "var(--text-main)", border: "1px solid var(--border-color)", borderRadius: "16px", cursor: "pointer", fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", transition: "all 0.3s" }}
                      >
                        <Moon size={18} /> Tünd
                      </button>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Numbers */}
                <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <MessageSquare size={20} color="#25D366" /> WhatsApp Nömrələri
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Kurslar üçün WhatsApp</label>
                      <input type="text" value={homeSettings.wa_courses || ""} onChange={e => setHomeSettings(prev => ({ ...prev, wa_courses: e.target.value }))} placeholder="Məs: +994501234567" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Təlimlər üçün WhatsApp</label>
                      <input type="text" value={homeSettings.wa_trainings || ""} onChange={e => setHomeSettings(prev => ({ ...prev, wa_trainings: e.target.value }))} placeholder="Məs: +994501234567" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Marafonlar üçün WhatsApp</label>
                      <input type="text" value={homeSettings.wa_marathons || ""} onChange={e => setHomeSettings(prev => ({ ...prev, wa_marathons: e.target.value }))} placeholder="Məs: +994501234567" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                    </div>
                    <button 
                      onClick={saveWhatsAppNumbers}
                      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "#fff", border: "none", padding: "1rem", borderRadius: "12px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "0.5rem", boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)", transition: "all 0.3s" }}
                      onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseOut={e => e.currentTarget.style.transform = "none"}
                    >
                      Nömrələri Yadda Saxla
                    </button>
                  </div>
                </div>

                {/* SEO Settings */}
                <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Search size={20} color="#4285F4" /> SEO & Google Search Console
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>Google Site Verification Kodu</label>
                      <input type="text" value={homeSettings.google_site_verification || ""} onChange={e => setHomeSettings(prev => ({ ...prev, google_site_verification: e.target.value }))} placeholder="Məs: 1234567890abcdef" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>SEO Başlıq (Title)</label>
                      <input type="text" value={homeSettings.seo_title || ""} onChange={e => setHomeSettings(prev => ({ ...prev, seo_title: e.target.value }))} placeholder="Məs: King Education Company" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>SEO Açıqlama (Description)</label>
                      <textarea value={homeSettings.seo_description || ""} onChange={e => setHomeSettings(prev => ({ ...prev, seo_description: e.target.value }))} placeholder="Məs: Kurslar, Təlimlər, Marafonlar..." style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} rows="3" />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", opacity: 0.7, fontWeight: 600 }}>SEO Açar Sözlər (Keywords)</label>
                      <textarea value={homeSettings.seo_keywords || ""} onChange={e => setHomeSettings(prev => ({ ...prev, seo_keywords: e.target.value }))} placeholder="Məs: Kurslar, Təlimlər, İngilis dili..." style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} rows="2" />
                    </div>
                    <button 
                      onClick={async () => {
                        try {
                          await fetch("/api/admin/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update_home_settings", key: "google_site_verification", value: homeSettings.google_site_verification || "" }) });
                          await fetch("/api/admin/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update_home_settings", key: "seo_title", value: homeSettings.seo_title || "" }) });
                          await fetch("/api/admin/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update_home_settings", key: "seo_description", value: homeSettings.seo_description || "" }) });
                          await fetch("/api/admin/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update_home_settings", key: "seo_keywords", value: homeSettings.seo_keywords || "" }) });
                          showAlert("SEO tənzimləmələri uğurla yadda saxlanıldı!");
                        } catch(e) { showAlert("Xəta baş verdi"); }
                      }}
                      style={{ background: "linear-gradient(135deg, #4285F4, #0F52BA)", color: "#fff", border: "none", padding: "1rem", borderRadius: "12px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "0.5rem", boxShadow: "0 4px 15px rgba(66, 133, 244, 0.3)", transition: "all 0.3s" }}
                      onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseOut={e => e.currentTarget.style.transform = "none"}
                    >
                      SEO Yadda Saxla
                    </button>
                  </div>
                </div>

                {/* Maintenance Mode */}
                <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <ShieldCheck size={20} color="#ef4444" /> Saytı Dondur (Texniki İşlər)
                  </h3>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "1.5rem" }}>
                    <p style={{ textAlign: "center", opacity: 0.7, fontSize: "0.95rem", lineHeight: 1.6 }}>
                      Bu rejimi aktivləşdirsəniz, sayt izləyicilər üçün bağlanacaq və ekranda "Texniki işlər aparılır" animasiyalı mesajı görünəcək.
                    </p>
                    <button 
                      onClick={async () => {
                        const newVal = !homeSettings.maintenance_mode;
                        handleHomeSettingChange('maintenance_mode', newVal);
                        try {
                          await fetch(`/api/admin/data?t=${Date.now()}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "update_setting", key: "maintenance_mode", value: newVal })
                          });
                        } catch(e) {}
                      }}
                      style={{ 
                        width: "100%", padding: "1rem", 
                        background: homeSettings.maintenance_mode ? "rgba(239, 68, 68, 0.1)" : "var(--primary)", 
                        color: homeSettings.maintenance_mode ? "#ef4444" : "white", 
                        border: homeSettings.maintenance_mode ? "1px solid #ef4444" : "none", 
                        borderRadius: "16px", cursor: "pointer", fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", transition: "all 0.3s" 
                      }}
                    >
                      {homeSettings.maintenance_mode ? "Saytı Aktivləşdir" : "Saytı Dondur"}
                    </button>
                  </div>
                </div>

                {/* Security / Password & PIN */}
                <div style={{ background: "var(--bg-alt)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--border-color)", gridColumn: "1 / -1", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
                    <Lock size={20} color="var(--primary)" /> Təhlükəsizlik
                  </h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "3rem" }}>
                    {/* Change Password */}
                    <div>
                      <h4 style={{ marginBottom: "1.25rem", fontSize: "0.95rem", fontWeight: 700 }}>Şifrəni Yenilə</h4>
                      <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Hazırkı şifrə" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Yeni şifrə" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        <button type="button" onClick={async () => { 
                          if (!currentPassword || !newPassword) {
                            showAlert("Zəhmət olmasa, həm hazırkı, həm də yeni şifrəni daxil edin.");
                            return;
                          }
                          if(await showConfirm("Şifrəni dəyişmək istədiyinizə əminsiniz?")) { 
                            showAlert("Şifrə uğurla dəyişdirildi!"); 
                            setCurrentPassword("");
                            setNewPassword("");
                          } 
                        }} style={{ padding: "1rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.opacity=0.9} onMouseOut={(e) => e.currentTarget.style.opacity=1}>Şifrəni Dəyiş</button>
                      </form>
                    </div>

                    {/* Change PIN */}
                    <div>
                      <h4 style={{ marginBottom: "1.25rem", fontSize: "0.95rem", fontWeight: 700 }}>Admin PIN Kodunu Yenilə</h4>
                      <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <input type="password" value={currentPin} onChange={e => setCurrentPin(e.target.value)} placeholder="Hazırkı PIN kod (məs: 200726)" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        <input type="password" value={newPin} onChange={e => setNewPin(e.target.value)} placeholder="Yeni PIN kod" style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none", fontWeight: 500 }} />
                        <button type="button" onClick={async () => { 
                          if (!currentPin || !newPin) {
                            showAlert("Zəhmət olmasa, həm hazırkı, həm də yeni PIN kodu daxil edin.");
                            return;
                          }
                          if(await showConfirm("PIN-i yeniləmək istədiyinizə əminsiniz?")) { 
                            showAlert("PIN uğurla yeniləndi!"); 
                            setCurrentPin("");
                            setNewPin("");
                          } 
                        }} style={{ padding: "1rem", background: "transparent", color: "var(--primary)", border: "1px solid var(--primary)", borderRadius: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={(e) => {e.currentTarget.style.background="var(--primary)"; e.currentTarget.style.color="white"}} onMouseOut={(e) => {e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--primary)"}}>PIN-i Yenilə</button>
                      </form>
                    </div>
                  </div>
                </div>

              </div>
            )}


          </motion.div>
        </div>
      </main>

      {/* FAVORITES MODAL */}
      <AnimatePresence>
        {viewingFavoritesStudent && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setViewingFavoritesStudent(null)}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ position: "relative", width: "100%", maxWidth: "500px", background: "var(--bg-color)", borderRadius: "24px", padding: "2rem", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", border: "1px solid var(--border-color)", maxHeight: "80vh", overflowY: "auto" }}
            >
              <button 
                onClick={() => setViewingFavoritesStudent(null)}
                style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "var(--bg-alt)", border: "none", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-main)" }}
              >
                <X size={18} />
              </button>

              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>{viewingFavoritesStudent.name}</h2>
              <p style={{ opacity: 0.6, marginBottom: "2rem" }}>Ulduzlanmış (Seçilmiş) Materiallar</p>

              {(!viewingFavoritesStudent.favorites || viewingFavoritesStudent.favorites.length === 0) ? (
                <div style={{ padding: "3rem 1rem", textAlign: "center", background: "var(--bg-alt)", borderRadius: "16px", border: "1px dashed var(--border-color)" }}>
                  <Star size={40} style={{ color: "var(--primary)", opacity: 0.2, marginBottom: "1rem" }} />
                  <p style={{ opacity: 0.6, margin: 0 }}>İştirakçı heç bir materialı ulduzlamayıb.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {viewingFavoritesStudent.favorites.map((favItem, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--bg-alt)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,107,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", overflow: "hidden" }}>
                        {favItem.image && formatImageUrl(favItem.image) ? (
                          <img 
                            src={formatImageUrl(favItem.image)} 
                            alt={favItem.title} 
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>';
                            }}
                          />
                        ) : (
                          <Star size={20} />
                        )}
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{favItem.title || "Adsız Material"}</div>
                        <div style={{ fontSize: "0.8rem", opacity: 0.6 }}>{favItem.category || "Kateqoriya yoxdur"} {favItem.price ? `• ${favItem.price}₼` : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tagModalData.isOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", zIndex: 999999, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setTagModalData({ ...tagModalData, isOpen: false })}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "var(--bg-color)", padding: "2rem", borderRadius: "24px", width: "90%", maxWidth: "450px", border: "1px solid var(--border-color)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "10px" }}>
                <Crown size={24} color="var(--primary)" /> İştirakçı Teqi
              </h2>
              <p style={{ opacity: 0.7, marginBottom: "1.5rem", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--primary)" }}>{tagModalData.student?.name}</strong> üçün yeni teq daxil edin (məs: Premium, Əsas, VIP). Teqi silmək üçün xananı boş saxlayın.
              </p>
              
              <input 
                autoFocus
                type="text"
                value={tagModalData.currentTag}
                onChange={e => setTagModalData({ ...tagModalData, currentTag: e.target.value })}
                onKeyDown={e => { if (e.key === 'Enter') saveUserTag(); }}
                placeholder="Teq daxil edin..."
                style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "2px solid var(--primary)", background: "var(--bg-alt)", color: "var(--text-main)", outline: "none", fontSize: "1rem", fontWeight: 600, marginBottom: "2rem", boxShadow: "0 4px 15px rgba(255,107,0,0.1)" }}
              />

              <div style={{ display: "flex", gap: "1rem" }}>
                <button 
                  onClick={() => setTagModalData({ ...tagModalData, isOpen: false })}
                  style={{ flex: 1, padding: "1rem", borderRadius: "12px", border: "none", background: "var(--bg-alt)", color: "var(--text-main)", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.background = "var(--border-color)"}
                  onMouseOut={e => e.currentTarget.style.background = "var(--bg-alt)"}
                >
                  Ləğv et
                </button>
                <button 
                  onClick={saveUserTag}
                  style={{ flex: 1, padding: "1rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, var(--primary), #FF913B)", color: "#fff", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 15px rgba(255,107,0,0.3)" }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseOut={e => e.currentTarget.style.transform = "none"}
                >
                  Yadda saxla
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) {
          .lg-hidden { display: none !important; }
        }
        @media (max-width: 768px) {
          .md-block { display: none !important; }
        }
      `}} />
    </div>
  );
}
