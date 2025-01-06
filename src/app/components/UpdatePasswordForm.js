// src/app/components/UpdatePasswordForm.js

import React, { useEffect, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { EyeFilledIcon } from "../components/Icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/Icons/EyeSlashFilledIcon";
import { updatePassword } from "../services/auth";

export default function UpdatePasswordForm() {
  const [hidePassword, setHidePassword] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    notSameAsCurrent: false,
  });

  const toggleVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);
    try {
      await updatePassword(currentPassword, newPassword);
      setMessage("Password updated successfully");
      setSuccess(true);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setSuccess(false);
    }
    setLoading(false);
  };

  const validateRequirements = (password) => {
    setRequirements({
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      notSameAsCurrent: password !== currentPassword,
    });
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validateRequirements(value);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };

  const isButtonDisabled = () => {
    return (
      !currentPassword ||
      !newPassword ||
      !confirmPassword ||
      Object.keys(errors).length > 0 ||
      Object.values(requirements).some((requirement) => !requirement) ||
      loading
    );
  };
  // Validate form
  useEffect(() => {
    const newErrors = {};
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
  }, [newPassword, confirmPassword]);

  return (
      <form
      id="Update_Password_Form"
        className="overflow-x-auto rounded-lg border-2 border-gray-dark bg-black/60 p-4 flex flex-col gap-4 text-green justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Inputs */}
          <div id="inputs" className="flex flex-col gap-4">
            <h1 className="text-xl">Change password</h1>
            {/* Current Password */}
            <Input
              name="current-password"
              className="min-w-32 teeeeeeeeeeeeeeeeeest"
              classNames={{
                base: "",
                inputWrapper:
                  "group-data-[focus=true]:bg-gray-darker/50 data-[hover=true]:bg-gray-darker/50 bg-black border-4 border-gray-darkest w-auto",
                input: "group-data-[has-value=true]:text-green",
              }}
              fullWidth={false}
              type={!hidePassword ? "text" : "password"}
              label="Current Password"
              placeholder="Enter your current password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              isDisabled={loading}
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
              errorMessage={errors.currentPassword}
              isInvalid={errors.currentPassword}
            />

            {/* New Password */}
            <Input
              name="new-password"
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
              onChange={handleNewPasswordChange}
              isDisabled={loading}
              errorMessage={errors.newPassword}
              isInvalid={errors.newPassword}
            />

            {/* Confirm Password */}
            <Input
              name="confirm-password"
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
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              isDisabled={loading}
              errorMessage={errors.confirmPassword}
              isInvalid={errors.confirmPassword}
            />
          </div>

          {/* Password Requirements */}
          <div className="overflow-auto">
          <div
            id="Requirements"
            className="w-80 rounded-lg bg-gray-dark p-4 text-green"
          >
            <h1 className="mb-2 font-bold">Password requirements</h1>
            <h1 className="mb-4">
              In order to create a strong password, here are some rules to have
              in mind:
            </h1>
            <ul className="list-inside list-disc">
              <li
                className={requirements.minLength ? "text-green" : "text-red"}
              >
                Minimum 8 characters
              </li>
              <li
                className={
                  requirements.hasLowercase ? "text-green" : "text-red"
                }
              >
                At least one lowercase character
              </li>
              <li
                className={
                  requirements.hasUppercase ? "text-green" : "text-red"
                }
              >
                At least one uppercase character
              </li>
              <li
                className={
                  requirements.notSameAsCurrent ? "text-green" : "text-red"
                }
              >
                Can't be the same as the previous password
              </li>
            </ul>
          </div>
          </div>
          
        </div>

        {message.length > 0 && (
          <p className={`${(success && "text-green") || "text-red"}`}>
            {message}
          </p>
        )}
        <Button
          className="!w-fit"
          fullWidth={false}
          color="primary"
          type="submit"
          isLoading={loading}
          isDisabled={isButtonDisabled()}
        >
          {" "}
          Change password
        </Button>
      </form>
  );
}
