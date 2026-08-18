"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Mail, Lock, LogIn, UserPlus, User, Eye, EyeOff, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CeoLogin() {
  const { login, register, admin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin && admin.isAdmin) {
      router.push("/admin");
    }
  }, [admin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (email.toLowerCase() !== "mirfeqaninnotebooku@gmail.com") {
      setError("Bu sistemə yalnız Baş İcraçı Direktor (CEO) daxil ola bilər!");
      setLoading(false);
      return;
    }

    let res;
    if (mode === "login") {
      res = await login(email, password);
    } else {
      res = await register(name, email, password);
    }

    if (res.success) {
      if (res.user.isAdmin) {
        router.push("/admin");
      } else {
        setError("Sizin admin hüquqlarınız yoxdur!");
      }
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  if (authLoading) return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-color)", padding: "2rem" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: "var(--bg-alt)", padding: "3rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", width: "100%", maxWidth: "450px", border: "1px solid var(--border-color)" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem", position: "relative" }}>
          <Link href="/" style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center", gap: "5px", color: "var(--text-main)", textDecoration: "none", opacity: 0.7, fontSize: "0.85rem", fontWeight: 600 }}>
            <Home size={16} /> Ana Səhifə
          </Link>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255, 107, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <ShieldCheck size={32} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>CEO / Rəhbərlik Paneli</h1>
          <p style={{ color: "var(--text-main)", opacity: 0.6, fontSize: "0.9rem", marginTop: "0.5rem" }}>Yalnız səlahiyyətli şəxslər daxil ola bilər</p>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", background: "rgba(0,0,0,0.03)", padding: "0.5rem", borderRadius: "16px" }}>
          <button 
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            style={{ flex: 1, padding: "0.8rem", borderRadius: "12px", border: "none", background: mode === "login" ? "var(--bg-color)" : "transparent", color: mode === "login" ? "var(--primary)" : "var(--text-main)", fontWeight: 600, cursor: "pointer", transition: "all 0.3s ease", boxShadow: mode === "login" ? "0 4px 10px rgba(0,0,0,0.05)" : "none" }}
          >
            Giriş
          </button>
          <button 
            type="button"
            onClick={() => { setMode("register"); setError(""); }}
            style={{ flex: 1, padding: "0.8rem", borderRadius: "12px", border: "none", background: mode === "register" ? "var(--bg-color)" : "transparent", color: mode === "register" ? "var(--primary)" : "var(--text-main)", fontWeight: 600, cursor: "pointer", transition: "all 0.3s ease", boxShadow: mode === "register" ? "0 4px 10px rgba(0,0,0,0.05)" : "none" }}
          >
            Qeydiyyat
          </button>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "1rem", borderRadius: "12px", fontSize: "0.85rem", marginBottom: "1.5rem", textAlign: "center", fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {mode === "register" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Ad və Soyad</label>
              <div style={{ position: "relative" }}>
                <User size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-main)", opacity: 0.5 }} />
                <input 
                  type="text" 
                  placeholder="Məs: Mirfəqan Hacıyev" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-main)", opacity: 0.5 }} />
              <input 
                type="email" 
                placeholder="CEO email ünvanı" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Şifrə</label>
            <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrəniz"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", outline: "none" }}
                  required
                />
                <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-main)", opacity: 0.5 }} />
                {showPassword ? (
                  <EyeOff
                    size={18}
                    onClick={() => setShowPassword(false)}
                    style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "var(--text-main)", opacity: 0.5 }}
                  />
                ) : (
                  <Eye
                    size={18}
                    onClick={() => setShowPassword(true)}
                    style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "var(--text-main)", opacity: 0.5 }}
                  />
                )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: "1rem", background: "var(--primary)", color: "white", borderRadius: "12px", border: "none", fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginTop: "0.5rem", transition: "all 0.3s ease", boxShadow: "0 4px 15px rgba(255,107,0,0.3)" }}
          >
            {loading ? "Gözləyin..." : mode === "login" ? <><LogIn size={20} /> Sistemə Daxil Ol</> : <><UserPlus size={20} /> Qeydiyyatı Tamamla</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
