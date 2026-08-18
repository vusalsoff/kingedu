"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, User, Lock, Mail, ChevronRight, ShieldCheck, UserCircle, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "./AuthModal.css";

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, register } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState("login"); // "login" | "register"

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Student Flow
    if (mode === "login") {
      const res = await login(email, password);
      if (res.success) {
        setAuthModalOpen(false);
        if (res.user && res.user.isAdmin) {
          router.push("/admin");
        } else {
          router.push("/kabinet");
        }
      } else {
        setError(res.message);
      }
    } else {
      const res = await register(name, email, password);
      if (res.success) {
        setAuthModalOpen(false);
        if (res.user && res.user.isAdmin) {
          router.push("/admin");
        } else {
          router.push("/kabinet");
        }
      } else {
        setError(res.message);
      }
    }
    setLoading(false);
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setAuthModalOpen(false)}>
          <motion.div
            className="auth-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="auth-modal-close"
              onClick={() => setAuthModalOpen(false)}
            >
              <X size={20} />
            </button>

            <div className="auth-modal-header" style={{ paddingTop: "2.5rem" }}>
              <div className="auth-logo-icon">
                <UserCircle size={32} />
              </div>
              <h3 className="auth-title">
                {mode === "login" ? "Xoş Gəlmişsiniz!" : "Aramıza Qatılın"}
              </h3>
              <p className="auth-subtitle">
                {mode === "login" 
                  ? "Davam etmək üçün hesabınıza daxil olun" 
                  : "King Education ailəsinə qoşulmaq üçün qeydiyyatdan keçin"}
              </p>
            </div>

            <div className="auth-mode-selector" style={{ marginTop: "1rem" }}>
              <button 
                className={`mode-btn ${mode === "login" ? "active" : ""}`}
                onClick={() => { setMode("login"); setError(""); }}
              >
                Giriş
              </button>
              <button 
                className={`mode-btn ${mode === "register" ? "active" : ""}`}
                onClick={() => { setMode("register"); setError(""); }}
              >
                Qeydiyyat
              </button>
            </div>

            <div className="auth-form-container">
              <AnimatePresence mode="wait">
                <motion.form 
                  key={mode}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="auth-form"
                  onSubmit={handleSubmit}
                >
                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-error">
                      {error}
                    </motion.div>
                  )}

                  {mode === "register" && (
                    <div className="input-group">
                      <input 
                        type="text" 
                        placeholder="Ad və Soyad" 
                        className="auth-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                      />
                      <User size={18} className="auth-icon" />
                    </div>
                  )}

                  <div className="input-group">
                    <input 
                      type="email" 
                      placeholder="Email ünvanı" 
                      className="auth-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                    <Mail size={18} className="auth-icon" />
                  </div>

                  <div className="input-group">
                                        <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Şifrə"
                      className="auth-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Lock size={18} className="auth-icon" />
                    {showPassword ? (
                      <EyeOff
                        size={18}
                        className="password-toggle-icon"
                        onClick={() => setShowPassword(false)}
                        style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "var(--text-main)", opacity: 0.5 }}
                      />
                    ) : (
                      <Eye
                        size={18}
                        className="password-toggle-icon"
                        onClick={() => setShowPassword(true)}
                        style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "var(--text-main)", opacity: 0.5 }}
                      />
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="auth-submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Gözləyin..." : (mode === "login" ? "Daxil Ol" : "Qeydiyyatdan Keç")}
                    {!loading && <ChevronRight size={20} />}
                  </button>
                </motion.form>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
