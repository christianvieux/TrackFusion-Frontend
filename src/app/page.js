"use client";
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { useSession } from './context/SessionContext';
import LogoutButton from './components/logoutButton';
import { testResponseTime } from "./services/trackService";
import { Button } from "@nextui-org/react";

export default function Test() {  
  const router = useRouter()
  const { user } = useSession();

  const testresponsetime = async () => {
    console.log("Pressed")
    const startTime = Date.now();  // Capture the start time
    await testResponseTime();  // Assuming this function performs the action
  
    const endTime = Date.now();  // Capture the end time
    const duration = (endTime - startTime) / 1000;  // Calculate duration in seconds
  
    console.log(`Done! The operation took ${duration} seconds.`);
  }

  // console.log("This the user", user)

  useEffect(() => {
    router.push("/home");
  }, [router]);

  return null
  return (
    <nav>
      <p className="bg-black text-green" href="/">Home</p>
      {user ? (
        <>
          <p className="bg-black text-green" href="/profile">Profile</p>
          <LogoutButton />
        </>
      ) : (
        <>
          <p className="bg-black text-green" href="/login">Login</p>
          <p className="bg-black text-green" href="/signup">Sign Up</p>
          <Button onPress={testresponsetime} color="primary" variant="bordered">
            Test response time
          </Button>
        </>
      )}
    </nav>
  );
}
