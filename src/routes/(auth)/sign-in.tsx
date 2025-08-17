import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import SignIn from "@/features/auth/sign-in";

const signInSchema = z.object({
  redirect: fallback(z.enum(["/"]), "/").default("/"),
});

export const Route = createFileRoute("/(auth)/sign-in")({
  component: SignIn,
  validateSearch: zodValidator(signInSchema),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.isAuthenticated) {
      throw redirect({ to: search.redirect });
    }
  },
});
