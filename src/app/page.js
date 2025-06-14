"use client";
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation'

export default function Test() {  
  const router = useRouter()

  useEffect(() => {
    router.push("/home");
  }, [router]);

  return null
}
