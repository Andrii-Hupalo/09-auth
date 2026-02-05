"use client";

import { useEffect, useState } from "react";
import { checkSession } from "@/lib/api/clientApi";
import { useUserAuthStore } from "@/lib/store/authStore";
import { User } from "@/types/user";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useUserAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useUserAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await checkSession();

        if (response && "email" in response) {
          setUser(response as User);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        console.error("Session check failed:", error);
        clearIsAuthenticated();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [setUser, clearIsAuthenticated]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
