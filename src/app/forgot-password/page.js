// src/app/forgot-password/page.js

//src/app/login/page.js

"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { forgotPassword } from "../services/auth";

export default function () {
  const [message, setMessage] = useState('');
  const [ successful , setSuccessful ] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
      const result = await forgotPassword(e.target.email.value);
      setMessage('Password reset link has been sent to your email.');
      setSuccessful(true);
    } catch (error) {
      setMessage(`Unable to send password reset link: ${error.message}`);
      setSuccessful(false);
    }
    setLoading(false);
  };

return (
    <div
        id="forgot-password"
        className="flex flex-col justify-between self-center rounded-lg border-2 border-purple-dark bg-green-darkest/30 p-4 text-white shadow-lg"
    >
        {/* Display error message */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {!successful && (<>
                <h1 className="text-center text-3xl text-green">Forgot your password?</h1>
            <p className="text-center">Remember your password? <a href="/login" className="self-end text-green-light">
                Log in here
            </a></p>
            <Input
                name="email"
                className=""
                classNames={{
                    base: "w-auto",
                    inputWrapper:
                        "group-data-[focus=true]:bg-gray-darker/50 data-[hover=true]:bg-gray-darker/50 bg-black border-4 border-gray-darkest w-auto",
                    input: "group-data-[has-value=true]:text-green",
                    // label: "text-pink group-data-[filled-within=true]:text-green",
                }}
                fullWidth={false}
                type="email"
                label="Email"
                placeholder="Enter your email"
                isDisabled={loading}
            />
            </>)}
            
            {message && <p className={`text-center ${successful ? "text-green" : "text-red"}`}>{message}</p>}{" "}
            {!successful && (<>
                <Button color="primary" type="submit" isLoading={loading}>
                Reset Password
            </Button>
            </>)}
            
        </form>
    </div>
);
}
