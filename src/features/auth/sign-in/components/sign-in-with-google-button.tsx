"use client";

import { FormattedMessage } from "react-intl";
import { Button } from "@/components/ui/button";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  throw new Error("VITE_GOOGLE_CLIENT_ID is not set");
}

export const SignInWithGoogleButton = () => {
  const handleSignWithGoogle = () => {
    const redirectUri = `${window.location.origin}/google/callback`;
    const scope = "profile email openid";
    const responseType = "token";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    window.location.href = authUrl;
  };

  return (
    <Button onClick={handleSignWithGoogle}>
      <FormattedMessage id="app_auth_sign_in_with_google_button" />
    </Button>
  );
};
