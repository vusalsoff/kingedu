"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import GlobalLoader from "@/components/ui/GlobalLoader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "../ui/Chatbot";
import ScrollToTop from "../ui/ScrollToTop";
import SpiderWebBackground from "../ui/SpiderWebBackground";
import { AuthProvider } from "@/context/AuthContext";
import { AlertProvider } from "@/context/AlertContext";
import AuthModal from "../ui/AuthModal";
import { Wrench } from "lucide-react";

export default function ClientLayout({ children, settings }) {
  const pathname = usePathname();
  const isAdmin = pathname && pathname.startsWith("/admin");
  const isAuth = pathname === "/admin/login" || pathname === "/admin/register" || pathname === "/ceo-login";

  const [liveSettings, setLiveSettings] = useState(settings || {});
  const [isNavigating, setIsNavigating] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    setLiveSettings(settings || {});
  }, [settings]);

  useEffect(() => {
    // Poll for maintenance mode changes to provide a real-time feel
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/data?t=${Date.now()}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_maintenance_mode" })
        });
        const data = await res.json();
        
        const isMaintenance = data.maintenance_mode === "true" || data.maintenance_mode === true;
        setLiveSettings(prev => ({ ...prev, maintenance_mode: isMaintenance }));
      } catch (e) {}
    }, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Security measure: disable right click, F12, Ctrl+U, etc.
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Prevent F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
      }
      // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
      }
      // Prevent Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
      // Prevent Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  const isMaintenance = String(liveSettings?.maintenance_mode) === "true";

  if (isMaintenance && !isAdmin && !isAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-color)", color: "var(--text-main)", padding: "2rem", textAlign: "center" }}>
        <SpiderWebBackground />
        <div style={{ maxWidth: "600px", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,107,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 2s infinite" }}>
            <Wrench size={60} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", margin: 0, background: "linear-gradient(to right, var(--primary), #FF913B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Texniki İşlər Aparılır
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.8, lineHeight: 1.6, fontWeight: 500 }}>
            Hörmətli istifadəçilərimiz, hazırda saytımızda texniki yenilənmə işləri aparılır. Çox qısa zamanda daha mükəmməl və sürətli versiya ilə yenidən xidmətinizdə olacağıq. Anlayışınız üçün təşəkkür edirik!
          </p>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes pulse {
              0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,107,0, 0.4); }
              70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(255,107,0, 0); }
              100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,107,0, 0); }
            }
          `}} />
        </div>
      </div>
    );
  }

  return (
    <AlertProvider>
      <AuthProvider>
        <AuthModal />
      {isNavigating && (
        <div style={{ position: "relative", zIndex: 9999999 }}>
          <GlobalLoader />
        </div>
      )}
      <SpiderWebBackground />
      {isAdmin && !isAuth ? (
        <div className="admin-root-viewport" style={{ width: "100%", minHeight: "100vh", display: "block", overflowX: "hidden" }}>
          {children}
        </div>
      ) : isAuth ? (
        <main>{children}</main>
      ) : (
        <>
          <Navbar settings={settings} />
          <main>{children}</main>
          <Footer settings={settings} />
          <Chatbot />
          <ScrollToTop />
        </>
      )}
      </AuthProvider>
    </AlertProvider>
  );
}
