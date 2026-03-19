"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { users as allUsers } from "./mock-data";

export type AppUser = (typeof allUsers)[number];

interface AuthContextValue {
  currentUser: AppUser;
  switchUser: (userId: string) => void;
  hasPermission: (perm: string) => boolean;
  canAccessSite: (siteId: string) => boolean;
  canAccessDevice: (deviceId: string) => boolean;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState("u1"); // default: Federico

  const currentUser = allUsers.find((u) => u.id === userId) || allUsers[0];

  const switchUser = useCallback((id: string) => {
    setUserId(id);
  }, []);

  const hasPermission = useCallback(
    (perm: string) => (currentUser.permissions as string[]).includes(perm),
    [currentUser]
  );

  const canAccessSite = useCallback(
    (siteId: string) => {
      if (currentUser.permissions.includes("admin")) return true;
      return currentUser.sites.includes(siteId);
    },
    [currentUser]
  );

  const canAccessDevice = useCallback(
    (deviceId: string) => {
      if (!currentUser.scopedDevices) return true; // non-vendors see everything
      return currentUser.scopedDevices.includes(deviceId);
    },
    [currentUser]
  );

  const isVendor = currentUser.role === "vendor_service";

  return (
    <AuthContext.Provider
      value={{ currentUser, switchUser, hasPermission, canAccessSite, canAccessDevice, isVendor }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
