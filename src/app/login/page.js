//src/app/login/page.js

"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import Password_Input from "../components/Password_Input";
import { Button } from "@nextui-org/button";
import { useSession } from "../context/SessionContext.js";
import { useRouter } from "next/navigation";
import CustomInput from "../components/CustomInput";

export default function LoginPage() {
  const { isLoggedIn, login, error:sessionError, setError:setSessionError, loading: sessionLoading } = useSession();
  const router = useRouter();
  const [error, setError] = useState(""); // State for error message

  async function handleSubmit(event) {
    event.preventDefault();
    setError(""); // Reset error message

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await login({email, password});

      // Handle successful login, e.g., redirect to a different page
      console.log("Logged in", response);
      router.push("/myTracks"); // Redirect to profile or any protected page
    } catch (error) {
      setError(error.message); // Set error message
    }
  }

  // update error
  useEffect(() => {
    setError(sessionError)
  }, [sessionError])

  // Redirect to another page if the user is already authenticated
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/feed"); // Redirect to the desired page
    }
  }, [router, isLoggedIn]);
  

  return (
    <div
      id="login"
      className="flex size-[400px] flex-col justify-between self-center rounded-lg border-2 border-purple-dark bg-green-darkest/30 p-4 text-white shadow-lg"
    >
      <h1 className="text-center text-3xl text-green">User Login</h1>
      {error && <p className="text-center text-red">{error}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="on">
        <CustomInput
          name="email"
          // classNames={{ inputWrapper: "" }}
          fullWidth={false}
          type="email"
          placeholder="Enter your email"
          autocomplete="email"
          variant="light"
        />
        <Password_Input autoComplete="current-password" placeholder="Enter your password"/>
        <a href="/forgot-password" className="self-end text-green-light">
          Forgot Password?
        </a>
        <Button color="primary" type="submit">
          Login
        </Button>
      </form>
      <div className="flex items-center gap-2">
        {/* Using flex to make the elements display in the same line */}
        <p className="">Don't have an account?</p>
        <a href="/signup" className="text-green-light">
          Sign up
        </a>
      </div>
    </div>
  );
}
