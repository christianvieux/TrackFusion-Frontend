"use client";
import React from "react";
import {
  Link,
  Button,
  Input,
  Checkbox,
  Divider,
  Switch,
} from "@nextui-org/react";
import Password_Input from "../components/Password_Input";
import { useState, useEffect } from "react";
import { register, checkEmail } from "../services/user";
import { generateOtp, verifyOtp } from "../services/otp";
import { useSession } from "../context/SessionContext";
import { useRouter } from "next/navigation";
import CustomInput from "../components/CustomInput";

function Slider({ steps = {}, marks = {}, currentStep = 1 }) {
  return (
    <div>
      <div className="relative flex w-full items-start justify-between">
        {/* <div className="w-full h-1 absolute bg-white top-1/2 z-0"></div> */}
        {marks.map(({ label }, index) => {
          return (
            <div
              key={index}
              className="relative flex w-full flex-1 flex-col items-center justify-center"
            >
              {/* Circle */}
              <div className="relative flex size-full items-center justify-center">
                <div
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-light`}
                >
                  <p className="text-black">{index + 1}</p>
                </div>
                {/* Progress Line */}
                {index < marks.length - 1 && (
                  <div
                    className={`absolute left-1/2 h-1 w-full ${currentStep > index + 1 ? "bg-green-light" : "bg-gray-darker"}`}
                  ></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex w-full items-center justify-evenly">
        {marks.map(({ label }, index) => {
          return (
            <p
              key={index}
              className={`w-1/3 flex-1 text-center text-white ${currentStep != index + 1 && "opacity-25"}`}
            >
              {label}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export default function SignUp() {
  const router = useRouter();
  const { isLoggedIn, login, error: sessionError } = useSession();
  const [step, setStep] = useState(1); // Step 1: Check Email, Step 2: Verify Email, Step 3: Complete Registration
  const initialFormData = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    agreementChecked: false,
  };
  const [formData, setFormData] = useState(initialFormData);
  const [responseMessage, setResponseMessage] = useState(null); // State for error message
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(""); // State for error message

  const [loading, setLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/feed");

  const isValidEmailProvided = !errors.email && formData.email != "";
  const isValidVerificationCodeProvided =
    !errors.verificationCode && formData.verificationCode != "";
  const isValidUsernameProvided = !errors.username && formData.username != "";
  const isValidPasswordProvided = !errors.password && formData.password != "";
  const isValidConfirmPasswordProvided =
    !errors.confirmPassword && formData.confirmPassword != "";
  const isValidAgreementChecked =
    !errors.agreementChecked && formData.agreementChecked;

  const isButtonDisabled = (() => {
    switch (step) {
      case 1:
        return !isValidEmailProvided;
      case 2:
        return !isValidVerificationCodeProvided;
      case 3:
        return (
          !isValidUsernameProvided ||
          !isValidPasswordProvided ||
          !isValidConfirmPasswordProvided ||
          !isValidAgreementChecked
        );
      default:
        return true;
    }
  })();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    let newErrors = { ...errors };

    // Clear the error when the field value changes
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
    setError("");

    // Perform real-time validation for specific fields
    switch (name) {
      case "username":
        if (!value.trim()) {
          newErrors.username = "Username is required";
        } else {
          delete newErrors.username;
        }
        break;
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = "Email address is invalid";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (
          formData.confirmPassword &&
          value !== formData.confirmPassword
        ) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.password;
          delete newErrors.confirmPassword;
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case "agreementChecked":
        if (!checked) {
          newErrors.agreementChecked =
            "Please agree to the terms and privacy policy";
        } else {
          delete newErrors.agreementChecked;
        }
        break;
      case "verificationCode":
        if (!value.trim()) {
          newErrors.verificationCode = "Verification code is required";
        } else {
          delete newErrors.verificationCode;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading("verify");
    try {
      await verifyOtp(
        formData.email,
        formData.verificationCode,
        "registration",
      );
      setStep(3); // Move to registration step
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading("email");
    try {
      const response = await checkEmail(formData.email);
      if (response.exists) {
        setError("Email is already associated with an existing account.");
      } else {
        setStep(2); // Move to verification step
        await generateOtp(formData.email, "registration");
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleResendCode = async () => {
    setError("");
    setLoading("resend");
    try {
      await generateOtp(formData.email, "registration");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  async function handleRegister(e) {
    e.preventDefault();

    setResponseMessage(null);
    // Move validation logic to handleChange for real-time validation
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Proceed with your registration logic
    const username = formData.username;
    const email = formData.email;
    const password = formData.password;
    const code = formData.verificationCode;

    try {
      setLoading("register");
      const response = await register(email, username, password, code);

      // Handle successful login, e.g., redirect to a different page
      // Reset form data after successful submission
      setFormData(initialFormData);
      // Introduce a delay before setting the success message
      setTimeout(() => {
        setResponseMessage(
          <p className="text-center text-success">
            Your account was successfully created!
          </p>,
        );
      }, 0.1 * 1000);

      // Automatically log in the user after registration
      setRedirectPath("/new-profile-picture");
      const user = await login({ email, password });
    } catch (error) {
      setResponseMessage(
        <p className="text-center text-danger">{error.message}</p>,
      ); // Set error message
    }
    setLoading(false);
  }

  // response msg update
  useEffect(() => {
    setResponseMessage(null);
  }, [formData]);

  //session error update
  useEffect(() => {
    setResponseMessage(
      <p className="text-center text-danger">{sessionError}</p>,
    );
  }, [sessionError]);

  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirectPath);
    }
  }, [router, isLoggedIn, redirectPath]);

  // Clear error messages when the step changes
  useEffect(() => {
    setError("");
    setErrors({});
    setResponseMessage(null);
  }, [step]);

  return (
    <div className="flex size-full items-center justify-center">
      <div className="flex w-80 flex-col items-center justify-center rounded-xl border-2 border-green/30 bg-black p-4 text-green shadow-small">
        <form
          onSubmit={
            step === 1
              ? handleCheckEmail
              : step === 2
                ? handleVerifyCode
                : handleRegister
          }
          className="flex size-full flex-col justify-center gap-4"
        >
          <h2 className="text-center text-2xl font-bold">
            Create Your Music Account
          </h2>
          <Slider
            marks={[
              {
                value: 1,
                label: "Enter Email",
              },
              {
                value: 2,
                label: "Verify Email",
              },
              {
                value: 3,
                label: "Complete Registration",
              },
            ]}
            currentStep={step}
          />

          {/* Email Address */}
          {step == 1 && (
            <>
              <CustomInput
                name="email"
                type="email"
                label="Email"
                isRequired
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={errors.email}
                errorMessage={errors.email}
              />
            </>
          )}

          {step == 2 && (
            <>
              <CustomInput
                name="verificationCode"
                type="text"
                label="Verification Code"
                isRequired
                placeholder="Enter the code sent to your email"
                value={formData.verificationCode}
                onChange={handleChange}
                isInvalid={errors.verificationCode}
                errorMessage={errors.verificationCode}
              />
              {/* Resend Code */}
              <p className="text-center">
                Didn't recieve code?{" "}
                <Button
                  className="text-green-light"
                  color="primary"
                  type="button"
                  onPress={handleResendCode} // remains the same
                  isLoading={loading == "resend"}
                  isDisabled={loading}
                  variant="light"
                >
                  Resend Code
                </Button>
              </p>
            </>
          )}

          {step == 3 && (
            <>
              <CustomInput
                name="username"
                type="text"
                label="Username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                onInvalid={errors.username}
                errorMessage={errors.username}
              />
              <Password_Input
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={errors.password}
                errorMessage={errors.password}
              />
              <Password_Input
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                isInvalid={errors.confirmPassword}
                errorMessage={errors.confirmPassword}
              />
              <div className="flex gap-2">
                <Switch
                  name="agreementChecked"
                  onChange={handleChange}
                  isSelected={formData.agreementChecked}
                  color={errors.agreementChecked ? "danger" : "default"}
                />
                <p className="text-green">
                  I agree to the{" "}
                  <a className="text-green-light" href="/terms">
                    terms and conditions
                  </a>{" "}
                  and{" "}
                  <a className="text-green-light" href="/privacy">
                    privacy policy
                  </a>
                  .
                </p>
              </div>
            </>
          )}

          {/* Error msg */}
          {error && <p className="text-center text-red">{error}</p>}
          {responseMessage}
          {/* Go back / Go Next */}
          <div className="flex w-full justify-between gap-4">
            {/* Prev */}
            <Button
              className={`flex-1 ${step === 1 ? "opacity-30" : "opacity-75"}`}
              color="primary"
              onClick={() => setStep(step - 1)}
              type="button"
              isDisabled={step === 1 || loading}
            >
              Back
            </Button>
            {/* Next */}
            {(() => {
              const stepLabel =
                step === 1 ? "email" : step === 2 ? "verify" : "register";

              return (
                <Button
                  className={`flex-1`}
                  color="primary"
                  type="submit"
                  isLoading={loading == stepLabel}
                  isDisabled={isButtonDisabled || loading}
                >
                  {loading
                    ? "Please wait"
                    : step === 1
                      ? "Next"
                      : step === 2
                        ? "Verify Code"
                        : "Register"}
                </Button>
              );
            })()}
          </div>
        </form>
        Already have an account?
        <Link href="/login">&nbsp;Log in&nbsp;</Link>
      </div>
    </div>
  );
  // return (<Login />);
}
