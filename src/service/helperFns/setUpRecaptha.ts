import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebase";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export const setupRecaptcha = () => {
  // Remove any existing reCAPTCHA container
  const existingContainer = document.getElementById("recaptcha-container");
  if (existingContainer) {
    existingContainer.innerHTML = "";
  }

  // Create new reCAPTCHA instance
  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber
      },
      "expired-callback": () => {
        // Reset reCAPTCHA when expired
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = undefined;
        }
      },
    }
  );

  return window.recaptchaVerifier;
};
