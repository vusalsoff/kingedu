"use client";

import { motion } from "framer-motion";

export default function GlobalLoader() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const textVariants = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg, #ffffff)"
    }}>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
          padding: "40px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)"
        }}
      >
        <motion.div
          variants={itemVariants}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.img 
            src="/img/Icon.jpeg" 
            alt="King Education Company Logo" 
            style={{ width: "auto", height: "110px", objectFit: "contain", flexShrink: 0, borderRadius: "20px", marginBottom: "25px", boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)" }} 
            animate={{ 
              boxShadow: [
                "0 15px 35px rgba(249, 115, 22, 0.2)",
                "0 20px 45px rgba(249, 115, 22, 0.4)",
                "0 15px 35px rgba(249, 115, 22, 0.2)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        
        <motion.div variants={textVariants} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2 style={{ 
            fontSize: "2rem", 
            fontWeight: "900", 
            marginBottom: "8px", 
            letterSpacing: "-0.03em", 
            margin: "0 0 15px 0",
            textAlign: "center",
            textShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <span style={{ color: "var(--primary, #f97316)" }}>King</span> <span style={{ color: "var(--foreground, #000)" }}>Education Company</span>
          </h2>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          style={{ 
            color: "var(--text-secondary, #64748b)", 
            fontSize: "1.2rem", 
            fontWeight: "700", 
            display: "flex", 
            alignItems: "center",
            marginTop: "10px",
            flexDirection: "column",
            gap: "15px"
          }}
        >
          <div className="spider-spinner">
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
          <motion.span 
            animate={{ opacity: [0.5, 1, 0.5] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ letterSpacing: "2px", textTransform: "uppercase", fontSize: "0.9rem" }}
          >
            Yüklənir...
          </motion.span>
        </motion.div>
      </motion.div>
      <style>{`
        .spider-spinner {
          width: 40px;
          height: 40px;
          position: relative;
          animation: spiderSpin 1.5s linear infinite;
        }
        .spider-spinner div {
          transform-origin: 20px 20px;
          animation: spiderFade 1.2s linear infinite;
        }
        .spider-spinner div:after {
          content: " ";
          display: block;
          position: absolute;
          top: 3px;
          left: 18px;
          width: 4px;
          height: 10px;
          border-radius: 20%;
          background: var(--primary, #f97316);
        }
        .spider-spinner div:nth-child(1) { transform: rotate(0deg); animation-delay: -1.05s; }
        .spider-spinner div:nth-child(2) { transform: rotate(45deg); animation-delay: -0.9s; }
        .spider-spinner div:nth-child(3) { transform: rotate(90deg); animation-delay: -0.75s; }
        .spider-spinner div:nth-child(4) { transform: rotate(135deg); animation-delay: -0.6s; }
        .spider-spinner div:nth-child(5) { transform: rotate(180deg); animation-delay: -0.45s; }
        .spider-spinner div:nth-child(6) { transform: rotate(225deg); animation-delay: -0.3s; }
        .spider-spinner div:nth-child(7) { transform: rotate(270deg); animation-delay: -0.15s; }
        .spider-spinner div:nth-child(8) { transform: rotate(315deg); animation-delay: 0s; }
        @keyframes spiderFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes spiderSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
