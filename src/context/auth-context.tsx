import * as React from "react";
import { useAccessToken } from "@/stores/auth.store";
import { useIsAuthStoreHydrated } from "@/stores/hydration.store";

export interface AuthContext {
  isAuthenticated: boolean;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAccessToken();
  const isAuthStoreHydrated = useIsAuthStoreHydrated();

  const isAuthenticated = !!accessToken;

  // Show loading state while checking auth
  if (!isAuthStoreHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
