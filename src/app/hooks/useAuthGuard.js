// src/hooks/useAuthGuard.js
import React from "react";
import { useSession } from "../context/SessionContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // or your preferred toast library

export const useAuthGuard = () => {
  const { user } = useSession();
  const router = useRouter();

  const guardAction = (action, options = { showToast: true }) => {
    if (!user) {
      if (options.showToast) {
        toast.error("Please log in to perform this action", {
          action: {
            label: "Log in",
            onClick: () => router.push("/login")
          }
        });
      }
      return false;
    }
    return true;
  };

  return guardAction;
};