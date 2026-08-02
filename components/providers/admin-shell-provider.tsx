"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";

interface AdminShellContextType {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;
  mounted: boolean;
}

const AdminShellContext = createContext<AdminShellContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "blackswan_admin_sidebar_collapsed";

const subscribeAdminShell = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("admin-shell-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("admin-shell-change", callback);
  };
};

const getAdminShellSnapshot = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const getAdminShellServerSnapshot = (): boolean => false;

export function AdminShellProvider({ children }: { children: React.ReactNode }) {
  const isCollapsed = useSyncExternalStore(
    subscribeAdminShell,
    getAdminShellSnapshot,
    getAdminShellServerSnapshot
  );

  const mounted = useSyncExternalStore(
    subscribeAdminShell,
    () => true,
    () => false
  );

  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const setCollapsed = (collapsed: boolean) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, String(collapsed));
      window.dispatchEvent(new Event("admin-shell-change"));
    } catch (e) {
      console.error("Failed to save sidebar collapse state to localStorage:", e);
    }
  };

  const toggleCollapsed = () => {
    setCollapsed(!isCollapsed);
  };

  const toggleMobileOpen = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <AdminShellContext.Provider
      value={{
        isCollapsed,
        toggleCollapsed,
        setCollapsed,
        isMobileOpen,
        setMobileOpen: setIsMobileOpen,
        toggleMobileOpen,
        mounted,
      }}
    >
      {children}
    </AdminShellContext.Provider>
  );
}

export function useAdminShell() {
  const context = useContext(AdminShellContext);
  if (!context) {
    throw new Error("useAdminShell must be used within an AdminShellProvider");
  }
  return context;
}
