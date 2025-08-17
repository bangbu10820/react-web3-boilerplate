import { createFileRoute, redirect } from "@tanstack/react-router";
import Dashboard from "@/features/dashboard";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
  beforeLoad: ({ context, location }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/sign-in",
        search: {
          // Save current location for redirect after login
          redirect: location.href,
        },
      });
    }
  },
});
