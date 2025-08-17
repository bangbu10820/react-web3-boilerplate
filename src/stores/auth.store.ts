import { persist } from "zustand/middleware";
import { createControlledStore } from "./utils/controlled-store";
import { setIsAuthStoreHydrated } from "./hydration.store";
import { rootRouter } from "@/main";

const AUTH_STORE_KEY = "auth-storage";

interface AuthProps {
  accessToken?: string;
  refreshToken?: string;
}

interface AuthState extends AuthProps {}
// define the initial state
const initialState: AuthProps = {
  accessToken: undefined,
  refreshToken: undefined,
};

// create store
const useAuthStore = createControlledStore<AuthState>()(
  persist(
    () => ({
      ...initialState,
    }),
    {
      name: AUTH_STORE_KEY, // unique name for localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }), // only persist tokens
      onRehydrateStorage: () => {
        // optional
        return (_, error) => {
          if (error) {
            console.error("an error happened during hydration", error);
          } else {
            setIsAuthStoreHydrated(true);
          }
        };
      },
    }
  )
);

export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () =>
  useAuthStore((state) => state.refreshToken);

export const resetAuthStore = () => useAuthStore.setState(initialState);

export const signOut = () => {
  resetAuthStore();
  rootRouter.invalidate().finally(() => {
    rootRouter.navigate({
      to: "/sign-in",
      search: { redirect: window.location.href },
    });
  });
};

export const setAccessToken = (accessToken: string) =>
  useAuthStore.setState({
    accessToken,
  });

export const setRefreshToken = (refreshToken: string) =>
  useAuthStore.setState({
    refreshToken,
  });

export const setTokens = (accessToken: string, refreshToken: string) =>
  useAuthStore.setState({
    accessToken,
    refreshToken,
  });

export const getAccessToken = () => useAuthStore.getState().accessToken;
export const getRefreshToken = () => useAuthStore.getState().refreshToken;
