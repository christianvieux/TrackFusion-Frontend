"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Form, Switch } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import AuthCard from "../components/Auth/AuthCard";
import AuthMessage from "../components/Auth/AuthMessage";
import AuthPasswordField from "../components/Auth/AuthPasswordField";
import AuthStepProgress from "../components/Auth/AuthStepProgress";
import AuthTextField from "../components/Auth/AuthTextField";
import {
  validateEmail,
  validatePassword,
  validatePasswordsMatch,
  validateRequired,
} from "../components/Auth/AuthValidation";

import { useSession } from "../context/SessionContext";
import { checkEmail, register } from "../services/userService";
import { generateOtp, verifyOtp } from "../services/otpService";

const SIGNUP_STEPS = [
  { label: "Email" },
  { label: "Verify" },
  { label: "Account" },
];

const INITIAL_FORM = {
  email: "",
  verificationCode: "",
  username: "",
  password: "",
  confirmPassword: "",
  agreementChecked: false,
};

export default function SignUpPage() {
  const router = useRouter();
  const { isLoggedIn, login, error: sessionError } = useSession();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  const isBusy = Boolean(loadingAction);

  const canContinue = useMemo(() => {
    if (step === 1) return !validateEmail(form.email);

    if (step === 2) {
      return !validateRequired(form.verificationCode, "Verification code");
    }

    return (
      !validateRequired(form.username, "Username") &&
      !validatePassword(form.password) &&
      !validatePasswordsMatch(form.password, form.confirmPassword) &&
      form.agreementChecked
    );
  }, [form, step]);

  function updateField(event) {
    const { name, value, checked, type } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleEmailStep() {
    setLoadingAction("email");

    try {
      const response = await checkEmail(form.email);

      if (response.exists) {
        setError("Email is already associated with an existing account.");
        return;
      }

      await generateOtp(form.email, "registration");
      setStep(2);
    } catch (error) {
      setError(error.message || "Could not send verification code");
    } finally {
      setLoadingAction("");
    }
  }

  async function handleVerifyStep() {
    setLoadingAction("verify");

    try {
      await verifyOtp(form.email, form.verificationCode, "registration");
      setStep(3);
    } catch (error) {
      setError(error.message || "Invalid verification code");
    } finally {
      setLoadingAction("");
    }
  }

  async function handleRegisterStep() {
    setLoadingAction("register");

    try {
      await register(
        form.email,
        form.username,
        form.password,
        form.verificationCode,
      );

      setSuccess("Your account was successfully created!");
      await login({ email: form.email, password: form.password });

      router.push("/new-profile-picture");
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoadingAction("");
    }
  }

  async function handleResendCode() {
    setLoadingAction("resend");

    try {
      await generateOtp(form.email, "registration");
      setSuccess("Verification code sent again.");
    } catch (error) {
      setError(error.message || "Could not resend code");
    } finally {
      setLoadingAction("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (step === 1) return handleEmailStep();
    if (step === 2) return handleVerifyStep();

    return handleRegisterStep();
  }

  function goBack() {
    setError("");
    setSuccess("");
    setStep((currentStep) => Math.max(1, currentStep - 1));
  }

  useEffect(() => {
    if (sessionError) setError(sessionError);
  }, [sessionError]);

  useEffect(() => {
    if (isLoggedIn) router.push("/new-profile-picture");
  }, [isLoggedIn, router]);

  return (
    <main className="flex size-full items-center justify-center p-4">
      <AuthCard
        title="Create Your Music Account"
        footer={
          <>
            <span>Already have an account?</span>
            <Link href="/login" className="text-primary hover:text-primary-hover">
              Log in
            </Link>
          </>
        }
      >
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="rounded-lg border border-warning/50 bg-warning/10 p-3 text-warning">
            <p className="text-center font-semibold">🚧 Under Maintenance 🚧</p>
            <p className="text-center text-xs">
              Registration is temporarily unavailable while improvements are being added.
            </p>
          </div>

          <AuthStepProgress steps={SIGNUP_STEPS} currentStep={step} />

          <AuthMessage message={error} />
          <AuthMessage message={success} type="success" />

          {step === 1 && (
            <AuthTextField
              isRequired
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              autoComplete="email"
              value={form.email}
              onChange={updateField}
              validate={validateEmail}
              isDisabled
            />
          )}

          {step === 2 && (
            <>
              <AuthTextField
                isRequired
                name="verificationCode"
                label="Verification Code"
                placeholder="Enter the code sent to your email"
                value={form.verificationCode}
                onChange={updateField}
                validate={(value) =>
                  validateRequired(value, "Verification code")
                }
              />

              <p className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive code?{" "}
                <Button
                  type="button"
                  variant="light"
                  className="text-primary"
                  onPress={handleResendCode}
                  isLoading={loadingAction === "resend"}
                  isDisabled={isBusy}
                >
                  Resend Code
                </Button>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <AuthTextField
                isRequired
                name="username"
                label="Username"
                placeholder="Enter your username"
                value={form.username}
                onChange={updateField}
                validate={(value) => validateRequired(value, "Username")}
              />

              <AuthPasswordField
                isRequired
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={form.password}
                onChange={updateField}
                validate={validatePassword}
              />

              <AuthPasswordField
                isRequired
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={updateField}
                validate={() =>
                  validatePasswordsMatch(form.password, form.confirmPassword)
                }
              />

              <div className="flex gap-3 rounded-lg bg-muted p-3">
                <Switch
                  name="agreementChecked"
                  isSelected={form.agreementChecked}
                  onChange={updateField}
                  className="shrink-0"
                />

                <p className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary">
                    terms and conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            </>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              className="flex-1 border border-primary text-primary"
              variant="bordered"
              onPress={goBack}
              isDisabled={step === 1 || isBusy}
            >
              Back
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-primary text-background hover:bg-primary-hover"
              isLoading={
                loadingAction === "email" ||
                loadingAction === "verify" ||
                loadingAction === "register"
              }
              isDisabled={!canContinue || isBusy || true}
            >
              {step === 1
                ? "Next"
                : step === 2
                  ? "Verify Code"
                  : "Register"}
            </Button>
          </div>
        </Form>
      </AuthCard>
    </main>
  );
}