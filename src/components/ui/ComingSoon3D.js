"use client";
import React from "react";
import { Sparkles, Clock, Rocket, Zap } from "lucide-react";
import "./ComingSoon3D.css";

export default function ComingSoon3D({ 
  title = "Tezliklə Sizlərlə!", 
  subtitle = "Bu bölmə üzərində komandamız fəal şəkildə çalışır. 3D innovativ interfeys və ən yeni məzmunlar çox yaxında xidmətinizdə olacaq!",
  badge = "✨ YENİ NƏSİL İNNOVASİYA • ÇOX YAXINDA"
}) {
  return (
    <div className="coming-soon-3d-wrapper">
      <div className="coming-soon-3d-card">
        {/* Floating 3D Background Spheres */}
        <div className="sphere-3d sphere-1"></div>
        <div className="sphere-3d sphere-2"></div>
        <div className="sphere-3d sphere-3"></div>

        {/* 3D Content */}
        <div className="coming-soon-content">
          <div className="coming-soon-badge">
            <Zap size={16} style={{ color: "#FF6B00" }} /> {badge}
          </div>

          <div className="coming-soon-icon-3d">
            🚀
          </div>

          <h2 className="coming-soon-title">{title}</h2>

          <p className="coming-soon-desc">{subtitle}</p>

          <div className="coming-soon-timer-pill">
            <Clock size={18} className="animate-spin" style={{ animationDuration: "10s" }} /> 
            İnteraktiv və Tam Yenilənmiş Paket
          </div>
        </div>
      </div>
    </div>
  );
}
