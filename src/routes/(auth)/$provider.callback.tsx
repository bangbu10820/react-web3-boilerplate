import { createFileRoute, redirect } from "@tanstack/react-router";
import AuthCallback from "@/features/auth/callback";

export const Route = createFileRoute("/(auth)/$provider/callback")({
  component: AuthCallback,
  beforeLoad: ({ params }) => {
    if (params.provider !== "google") {
      throw redirect({ to: "/404" });
    }
  },
});
