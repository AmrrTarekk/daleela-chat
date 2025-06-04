import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebase";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export const setupRecaptcha = () => {
  if (typeof window === "undefined") return;

  // Check if the reCAPTCHA container element exists
  const recaptchaContainer = document.getElementById("recaptcha-container");
  if (!recaptchaContainer) {
    console.warn("reCAPTCHA container element not found. Delaying setup...");
    return;
  }

  // Clean up existing verifier if it exists
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible",
      callback: (response: string) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber
        console.log("reCAPTCHA solved:", response);
      },
      "expired-callback": () => {
        // Response expired, user needs to solve reCAPTCHA again
        console.warn("reCAPTCHA expired");
      },
      "error-callback": (error: Error) => {
        // Error occurred during reCAPTCHA verification
        console.error("reCAPTCHA error:", error);
      },
    }
  );
};
