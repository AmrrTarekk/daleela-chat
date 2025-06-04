"use client";
import { auth } from "@/service/firebase";
import { setupRecaptcha } from "@/service/helperFns/setUpRecaptha";
import { createOrUpdateUserProfile } from "@/service/userService";
import { ConfirmationResult, signInWithPhoneNumber } from "firebase/auth";
import { MessageSquare } from "lucide-react";
import React, { useState } from "react";
import Step0 from "./Step0";
import Step1 from "./Step1";

function Login() {
  const [step, setStep] = useState<0 | 1>(0); // 0 for phone input, 1 for code input
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const handleLogin = async (values: { phoneNumber: string }) => {
    setError("");
    setLoading(true);
    setPhoneNumber(values.phoneNumber);

    try {
      // Setup new reCAPTCHA
      const recaptchaVerifier = setupRecaptcha();

      const validPhoneNumber = values.phoneNumber.startsWith("+2")
        ? values.phoneNumber
        : `+2${values.phoneNumber}`;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        validPhoneNumber,
        recaptchaVerifier
      );
      setConfirmationResult(confirmationResult);
      setStep(1);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/invalid-phone-number") {
        setError("Invalid phone number format. Please check and try again.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (firebaseError.code === "auth/captcha-check-failed") {
        setError(
          "reCAPTCHA verification failed. Please refresh and try again."
        );
      } else {
        console.log(error);
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (values: { verificationCode: string }) => {
    setError("");
    setLoading(true);
    try {
      if (!confirmationResult) {
        setError("No verification code received. Please try again.");
        return;
      }

      const result = await confirmationResult.confirm(values.verificationCode);
      const user = result.user;

      await createOrUpdateUserProfile(user, {
        phoneNumber: phoneNumber.startsWith("+2")
          ? phoneNumber
          : `+2${phoneNumber}`,
      });

      console.log("User signed in and profile created successfully");
    } catch (error) {
      console.error(error);
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPhoneNumber("");
    setConfirmationResult(null);
    setStep(0);
    setError("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Daleela
          </h1>
          <p className="text-gray-600">Join the group chat</p>
        </div>

        <Step0
          step={step}
          handleLogin={handleLogin}
          error={error}
          loading={loading}
        />

        <Step1
          step={step}
          handleVerification={handleVerification}
          phoneNumber={phoneNumber}
          error={error}
          loading={loading}
          resetForm={resetForm}
        />
        <div id="recaptcha-container" className="invisible"></div>
      </div>
    </div>
  );
}

export default Login;
