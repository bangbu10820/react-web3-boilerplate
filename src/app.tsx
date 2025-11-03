import { RouterProvider } from "@tanstack/react-router";
import { useIsAuthenticated } from "./stores/auth.store";
import type { AnyRouter } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

interface AppProps {
  rootRouter: AnyRouter;
  queryClient: QueryClient;
}

export default function App({ rootRouter, queryClient }: AppProps) {
  const isAuthenticated = useIsAuthenticated();

  return (
    <RouterProvider
      router={rootRouter}
      context={{
        queryClient: queryClient,
        isAuthenticated: isAuthenticated,
      }}
    />
  );
}
