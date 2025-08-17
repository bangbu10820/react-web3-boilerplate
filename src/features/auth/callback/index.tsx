import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { setTokens } from "@/stores/auth.store";

export default function AuthCallback() {
  const { provider } = useParams({ from: "/(auth)/$provider/callback" });
  // const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  const handleCallback = () => {
    if (typeof window !== "undefined") {
      const fragment = window.location.hash.substring(1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get("access_token");

      if (accessToken) {
        // const response = await authCallback({
        //   accessToken,
        //   provider: provider.toString(),
        // });
        // if (response.jwt && response.jwtRefresh) {
        //   setTokens({
        //     jwt: response.jwt,
        //     jwtRefresh: response.jwtRefresh,
        //   });
        //   router.push(ROUTES.HOME);
        // }
        // setAccessToken(accessToken);
        setTokens(accessToken, accessToken);
        navigate({ to: "/" });
      }
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <div>
      <h1>Auth Callback {provider}</h1>
      <div>
        <Loader2 className="animate-spin" />
      </div>
    </div>
  );
}
