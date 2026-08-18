"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);

  useEffect(() => {
    setMounted(true);
    try {
      const storedUser = localStorage.getItem("kingsedu_current_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setFavorites(parsedUser.favorites || []);
      }
      const storedAdmin = localStorage.getItem("kingsedu_admin_user");
      if (storedAdmin) {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
      }
    } catch (err) {
      console.error("Auth init error:", err);
    }

    // Background sync students from Google Sheets / API DB
    try {
      fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "student_get_all" })
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.success && Array.isArray(data.students)) {
            const dbUsers = data.students.map(s => {
              let favs = [];
              if (Array.isArray(s.favorites)) favs = s.favorites;
              else if (typeof s.favorites === "string") {
                try { favs = JSON.parse(s.favorites); } catch(e) {}
              }
              return {
                id: s.id || s.name,
                username: s.name,
                password: s.password || "123456",
                createdAt: s.createdAt || new Date().toISOString(),
                favorites: favs
              };
            });
            localStorage.setItem("kingsedu_users", JSON.stringify(dbUsers));

            // Sync current active user if exists in DB
            const cur = localStorage.getItem("kingsedu_current_user");
            if (cur) {
              const parsed = JSON.parse(cur);
              const found = dbUsers.find(u => (u.username || '').toLowerCase() === (parsed.username || '').toLowerCase());
              if (found) {
                setUser(found);
                setFavorites(found.favorites || []);
                localStorage.setItem("kingsedu_current_user", JSON.stringify(found));
              } else {
                setUser(null);
                setFavorites([]);
                localStorage.removeItem("kingsedu_current_user");
              }
            }
          }
        })
        .catch(err => console.log("Silent DB student sync:", err));
    } catch (e) {}
  }, []);

  const saveUserToStorage = (updatedUser) => {
    setUser(updatedUser);
    setFavorites(updatedUser.favorites || []);
    localStorage.setItem("kingsedu_current_user", JSON.stringify(updatedUser));
    
    try {
      const allUsers = JSON.parse(localStorage.getItem("kingsedu_users") || "[]");
      const userIndex = allUsers.findIndex(u => (u.username || '').toLowerCase() === (updatedUser.username || '').toLowerCase());
      if (userIndex > -1) {
        allUsers[userIndex] = updatedUser;
      } else {
        allUsers.push(updatedUser);
      }
      localStorage.setItem("kingsedu_users", JSON.stringify(allUsers));
    } catch (err) {
      console.error("Save users error:", err);
    }

    // Sync with Google Sheets / DB in background
    try {
      fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "student_update_favorites",
          username: updatedUser.username,
          id: updatedUser.id,
          isAdmin: updatedUser.isAdmin,
          favorites: JSON.stringify(updatedUser.favorites || [])
        })
      }).catch(err => console.log("Background fav sync:", err));
    } catch (e) {}
  };

  const register = async (name, email, password) => {
    try {
      const pendingFavs = JSON.parse(localStorage.getItem("kingsedu_pending_favorites") || "[]");
      
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", name, email, password })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return { success: false, message: data.message || data.error || "Qeydiyyat zamanı xəta oldu." };
      }
      
      const newUser = {
        ...data.user,
        username: data.user.name,
        favorites: pendingFavs
      };

      localStorage.removeItem("kingsedu_pending_favorites");
      
      setUser(newUser);
      setFavorites(newUser.favorites);
      localStorage.setItem("kingsedu_current_user", JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, message: "Qeydiyyat zamanı xəta oldu." };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return { success: false, message: data.message || data.error || "Giriş zamanı xəta oldu." };
      }
      
      const foundUser = {
        ...data.user,
        username: data.user.name,
      };

      // If admin, store separately
      if (foundUser.isAdmin) {
        setAdmin(foundUser);
        localStorage.setItem("kingsedu_admin_user", JSON.stringify(foundUser));
      }

      const pendingFavs = JSON.parse(localStorage.getItem("kingsedu_pending_favorites") || "[]");
      if (pendingFavs.length > 0) {
        const existingIds = new Set((foundUser.favorites || []).map(f => f.id));
        const newFavs = pendingFavs.filter(f => !existingIds.has(f.id));
        foundUser.favorites = [...(foundUser.favorites || []), ...newFavs];
        localStorage.removeItem("kingsedu_pending_favorites");
      }

      saveUserToStorage(foundUser);
      return { success: true, user: foundUser };
    } catch (err) {
      return { success: false, message: "Giriş zamanı xəta oldu." };
    }
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("kingsedu_current_user");
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem("kingsedu_admin_user");
  };

  const toggleFavorite = (item, categoryName = "Kurslar") => {
    const enrichedItem = {
      ...item,
      category: item.category || categoryName
    };

    if (!user) {
      // Store in pending for after login/reg, but DO NOT activate star or setFavorites!
      try {
        const pendingFavs = JSON.parse(localStorage.getItem("kingsedu_pending_favorites") || "[]");
        const exists = pendingFavs.some(f => f.id === enrichedItem.id);
        let newPending;
        if (exists) {
          newPending = pendingFavs.filter(f => f.id !== enrichedItem.id);
        } else {
          newPending = [...pendingFavs, enrichedItem];
        }
        localStorage.setItem("kingsedu_pending_favorites", JSON.stringify(newPending));
      } catch (e) {}

      setPendingItem(enrichedItem);
      setAuthModalOpen(true);
      return { success: false, requireAuth: true };
    }

    let updatedFavs;
    const exists = favorites.some(f => String(f.id) === String(enrichedItem.id) && f.type === enrichedItem.type);
    
    if (exists) {
      updatedFavs = favorites.filter(f => !(String(f.id) === String(enrichedItem.id) && f.type === enrichedItem.type));
    } else {
      updatedFavs = [...favorites, enrichedItem];
    }

    const updatedUser = { ...user, favorites: updatedFavs };
    saveUserToStorage(updatedUser);
    return { success: true, isFavorite: !exists };
  };

  const isFavorite = (itemId, itemType = null) => {
    if (!user) return false;
    return favorites.some(f => String(f.id) === String(itemId) && (itemType ? f.type === itemType : true));
  };

  const updateProfile = (newUsername, newPassword) => {
    if (!user) return { success: false, message: "Hesaba daxil olmamısınız." };
    try {
      const allUsers = JSON.parse(localStorage.getItem("kingsedu_users") || "[]");
      const cleanNewName = newUsername ? newUsername.trim() : user.username;
      
      // Check if new username already exists for a DIFFERENT user
      if ((cleanNewName || '').toLowerCase() !== (user.username || '').toLowerCase()) {
        const exists = allUsers.some(u => (u.username || '').toLowerCase() === (cleanNewName || '').toLowerCase() && String(u.id) !== String(user.id));
        if (exists) {
          return { success: false, message: "Bu istifadəçi adı artıq başqa iştirakçı tərəfindən tutulub!" };
        }
      }

      const updatedUser = {
        ...user,
        username: cleanNewName || user.username,
        password: newPassword ? newPassword : user.password
      };

      setUser(updatedUser);
      localStorage.setItem("kingsedu_current_user", JSON.stringify(updatedUser));

      const userIndex = allUsers.findIndex(u => String(u.id) === String(user.id) || (u.username || '').toLowerCase() === (user.username || '').toLowerCase());
      if (userIndex > -1) {
        allUsers[userIndex] = updatedUser;
      } else {
        allUsers.push(updatedUser);
      }
      localStorage.setItem("kingsedu_users", JSON.stringify(allUsers));

      // Background sync with API DB
      try {
        fetch("/api/admin/data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "student_add",
            username: updatedUser.username,
            password: updatedUser.password,
            createdAt: updatedUser.createdAt,
            favorites: JSON.stringify(updatedUser.favorites || [])
          })
        }).catch(err => console.log("Background profile sync:", err));
      } catch (e) {}

      return { success: true, message: "Məlumatlarınız uğurla yeniləndi!", user: updatedUser };
    } catch (err) {
      return { success: false, message: "Yeniləmə zamanı xəta oldu." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        setAdmin,
        favorites,
        login,
        register,
        logout,
        adminLogout,
        toggleFavorite,
        isFavorite,
        updateProfile,
        authModalOpen,
        setAuthModalOpen,
        pendingItem,
        mounted
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
