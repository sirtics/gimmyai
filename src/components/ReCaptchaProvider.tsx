import { useEffect } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface ReCaptchaProviderProps {
  children: React.ReactNode;
}

export default function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

  // Always render provider (even with empty key) so hook is always available
  // This prevents React hooks rule violations
  if (!recaptchaSiteKey) {
    console.warn("reCAPTCHA site key not found. Bot protection is disabled.");
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey || "dummy-key"} // Use dummy key if not configured
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
