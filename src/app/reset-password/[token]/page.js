// src/app/reset-password/[token]/page.js
"use client";

import React, { useState, useEffect } from "react";
import { resetPassword, verifyResetToken } from "../../services/auth";
import { Input, Button } from "@nextui-org/react";
import { EyeFilledIcon } from "../../components/Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../../components/Icons/EyeSlashFilledIcon";

const ResetPasswordForm = ({
  handleSubmit,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  hidePassword,
  toggleVisibility,
  loading,
}) => (
  <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    <Input
      name="new-password"
      className=""
      classNames={{
        base: "w-auto",
        inputWrapper:
          "group-data-[focus=true]:bg-gray-darker/50 data-[hover=true]:bg-gray-darker/50 bg-black border-4 border-gray-darkest w-auto",
        input: "group-data-[has-value=true]:text-green",
      }}
      fullWidth={false}
      type={!hidePassword ? "text" : "password"}
      label="New Password"
      placeholder="Enter new password"
      autoComplete="new-password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {!hidePassword ? (
            <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
          ) : (
            <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
          )}
        </button>
      }
      isDisabled={loading}
    />
    <Input
      name="confirm-password"
      className=""
      classNames={{
        base: "w-auto",
        inputWrapper:
          "group-data-[focus=true]:bg-gray-darker/50 data-[hover=true]:bg-gray-darker/50 bg-black border-4 border-gray-darkest w-auto",
        input: "group-data-[has-value=true]:text-green",
      }}
      fullWidth={false}
      type={!hidePassword ? "text" : "password"}
      label="Confirm Password"
      placeholder="Confirm new password"
      autoComplete="off"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      isDisabled={loading}
    />
    <Button color="primary" type="submit" isLoading={loading}>
      Reset Password
    </Button>
  </form>
);

export default function ResetPassword({ params }) {
  const [state, setState] = useState({
    newPassword: "",
    confirmPassword: "",
    message: "",
    successful: false,
    hidePassword: true,
    loading: false,
    tokenValid: null,
  });

  const {
    newPassword,
    confirmPassword,
    message,
    successful,
    hidePassword,
    loading,
    tokenValid,
  } = state;
  const { token } = params;

  const setField = (field, value) =>
    setState((prevState) => ({ ...prevState, [field]: value }));
  const toggleVisibility = () => setField("hidePassword", !hidePassword);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setField("message", "Passwords do not match.");
      setField("successful", false);
      return;
    }
    try {
      setField("loading", true);
      await resetPassword(token, newPassword);
      setField("message", "Password has been reset successfully.");
      setField("successful", true);
    } catch (error) {
      setField("message", `Unable to reset password. ${error.message}`);
      setField("successful", false);
    }
    setField("loading", false);
  };
  const verifyToken = async (token) => {
    try {
      await verifyResetToken(token);
      setField("tokenValid", true);
    } catch (error) {
      setField("message", `Unable to reset password. ${error.message}`);
      setField("tokenValid", false);
    }
  };

  useEffect(() => {
    verifyToken(token);
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-between gap-4 self-center rounded-lg border-2 border-purple-dark bg-green-darkest/30 p-4 text-green shadow-lg">
      {tokenValid == null && <p className="text-center text-lg">Loading...</p>}
      {tokenValid === false && (
        <>
          <h1 className="text-2xl">Reset your password</h1>
          <p className="text-red">
            The link has expired. Please request a new password reset link.
          </p>
        </>
      )}
      {tokenValid && (
        <>
          <h1 className="text-2xl">Reset your password</h1>
          {successful ? (
            <p className="text-center text-green">
              {message}{" "}
              <a href="/login" className="underline">
                Go to Login
              </a>
            </p>
          ) : (
            <ResetPasswordForm
              handleSubmit={handleSubmit}
              newPassword={newPassword}
              setNewPassword={(value) => setField("newPassword", value)}
              confirmPassword={confirmPassword}
              setConfirmPassword={(value) => setField("confirmPassword", value)}
              hidePassword={hidePassword}
              toggleVisibility={() => setField("hidePassword", !hidePassword)}
              loading={loading}
            />
          )}
        </>
      )}
    </div>
  );
}
