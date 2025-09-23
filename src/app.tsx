import { RouterProvider } from "@tanstack/react-router";
import { useAuth } from "./context/auth-context";
import type { AnyRouter } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

interface AppProps {
  rootRouter: AnyRouter;
  queryClient: QueryClient;
}

export default function App({ rootRouter, queryClient }: AppProps) {
  const auth = useAuth();
  return (
    <RouterProvider
      router={rootRouter}
      context={{
        queryClient: queryClient,
        isAuthenticated: auth.isAuthenticated,
      }}
    />
  );
}
