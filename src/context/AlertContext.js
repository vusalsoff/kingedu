"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X, Check } from "lucide-react";
import "./AlertContext.css";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Disable body scroll when confirm dialog is open
  useEffect(() => {
    if (confirmDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [confirmDialog]);

  // Use a custom alert function
  const showAlert = useCallback((message, type = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Automatically infer type from message for better UX if not explicitly provided
    let inferredType = type;
    if (type === "info") {
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes("xəta") || lowerMsg.includes("error") || lowerMsg.includes("olmadı") || lowerMsg.includes("tapılmadı")) {
        inferredType = "error";
      } else if (lowerMsg.includes("uğurla") || lowerMsg.includes("success") || lowerMsg.includes("edildi") || lowerMsg.includes("yadda")) {
        inferredType = "success";
      }
    }

    setAlerts((prev) => [...prev, { id, message, type: inferredType }]);

    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }
    
    return id; // Can return id if they want to manually close it early
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  // Custom confirm function returning a Promise
  const showConfirm = useCallback((message, confirmText = "Bəli", cancelText = "Xeyr") => {
    return new Promise((resolve) => {
      setConfirmDialog({
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle size={26} className="alert-icon-success" />;
      case "error": return <AlertCircle size={26} className="alert-icon-error" />;
      default: return <Info size={26} className="alert-icon-info" />;
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* Toasts (Alerts) Container */}
      <div className="premium-alert-container">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, y: -40, scale: 0.8, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)", transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`premium-alert-box premium-alert-${alert.type}`}
            >
              <div className="alert-icon-wrapper">
                {getIcon(alert.type)}
                <div className="alert-icon-glow"></div>
              </div>
              <p className="premium-alert-message">{alert.message}</p>
              <button className="premium-alert-close" onClick={() => removeAlert(alert.id)}>
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirm Dialog (Modal) */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="premium-confirm-overlay">
            <motion.div 
              className="premium-confirm-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={confirmDialog.onCancel}
            />
            <motion.div
              className="premium-confirm-modal"
              initial={{ opacity: 0, scale: 0.7, y: 30, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
              <div className="confirm-icon-box">
                <AlertCircle size={40} className="confirm-main-icon" />
                <div className="confirm-bg-glow"></div>
              </div>
              
              <h3 className="confirm-title">Diqqət!</h3>
              <p className="confirm-message">{confirmDialog.message}</p>
              
              <div className="confirm-actions">
                <button className="confirm-btn confirm-btn-cancel" onClick={confirmDialog.onCancel}>
                  <X size={18} /> {confirmDialog.cancelText}
                </button>
                <button className="confirm-btn confirm-btn-submit" onClick={confirmDialog.onConfirm}>
                  <Check size={18} /> {confirmDialog.confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AlertContext.Provider>
  );
}

export function useCustomAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useCustomAlert must be used within an AlertProvider");
  }
  return context;
}
