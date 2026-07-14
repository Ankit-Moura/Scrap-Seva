// app/providers.tsx
"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const { tokens, user, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      useAuthStore.persist.rehydrate();

      const state = useAuthStore.getState();

      

      if (state.tokens?.access) {
        try {
          
          const res = await axios.get(`${API_BASE}/users/me/`, {
            headers: { Authorization: `Bearer ${state.tokens.access}` },
          });
          const data = await JSON.stringify(res.data)
          
          setUser(res.data);
        } catch (err) {
          console.error("Failed to fetch user, clearing session", err);
          logout(); // token invalid/expired — force re-login
        }
      }

      setLoading(false);
      setHydrated(true);
    };

    init();
  }, []);


  if (!hydrated) return null;

  return <>{children}</>;
}