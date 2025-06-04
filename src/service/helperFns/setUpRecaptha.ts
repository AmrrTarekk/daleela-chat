import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../firebase";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber
        },
      }
    );
  }
};
