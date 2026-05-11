"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "../context/SessionContext";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useSession();

  useEffect(() => {
    async function handleLogout() {
      await logout();
      router.replace("/login");
    }

    handleLogout();
  }, [logout, router]);

  return (
    <main className="flex size-full items-center justify-center p-4 text-foreground">
      <p>Logging out...</p>
    </main>
  );
}