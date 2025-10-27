import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createStore, del, get, set } from "idb-keyval";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { AxiosError } from "axios";
import { toast } from "sonner";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/query-persist-client-core";
import { rootRouter } from "@/main";
// import { resetAuthStore } from "@/stores/auth.store";

const customStore = createStore("BANGBU_V1_INDEXED_DB", "keyval");

const createIndexedDBPersister = (idbValidKey: IDBValidKey = "vite-app") => {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client, customStore);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey, customStore);
    },
    removeClient: async () => {
      await del(idbValidKey, customStore);
    },
  } as Persister;
};

const persister = createIndexedDBPersister("vite-app");

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (import.meta.env.DEV) console.log({ failureCount, error });

        if (failureCount >= 0 && import.meta.env.DEV) return false;
        if (failureCount > 3 && import.meta.env.PROD) return false;

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        );
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        // handleServerError(error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error("Content not modified!");
          }
        }
      },
    },
  },
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

export function Provider({ children }: { children: React.ReactNode }) {
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
