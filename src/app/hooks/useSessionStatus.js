//app/hooks/useAuthStatus.js
import { useState, useEffect } from "react";
import { getSessionStatus } from "../services/auth";
import { usePathname } from 'next/navigation'

export const useSessionStatus = () => {
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const data = await getSessionStatus();
        setSessionData(data);
      } catch (error) {
        console.error("Error fetching session status", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    checkSession();
  }, [pathname]); // Only one useEffect, triggered on pathname change


  return { sessionData, loading, error };
};