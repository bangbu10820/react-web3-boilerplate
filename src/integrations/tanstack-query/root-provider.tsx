import { QueryCache, QueryClient } from "@tanstack/react-query";
import { del, get, set } from "idb-keyval";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/query-persist-client-core";
import { rootRouter } from "@/main";
// import { resetAuthStore } from "@/stores/auth.store";

const createIndexedDBPersister = (idbValidKey: IDBValidKey = "vite-app") => {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  } as Persister;
};

export function getContext() {
  const persister = createIndexedDBPersister("vite-app");
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            // toast.error("Session expired!");
            // resetAuthStore();
            // const redirect = `${rootRouter.history.location.href}`;
            // rootRouter.navigate({ to: "/sign-in", search: { redirect } });
          }
          if (error.response?.status === 500) {
            toast.error("Internal Server Error!");
            rootRouter.navigate({ to: "/500" });
          }
          if (error.response?.status === 403) {
            rootRouter.navigate({ to: "/403", replace: true });
          }
        }
      },
    }),
  });
  return {
    queryClient,
    persister,
  };
}

export function Provider({
  children,
  queryClient,
  persister,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
  persister: Persister;
}) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            return (
              query.meta?.persist === true && query.state.status === "success"
            );
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
