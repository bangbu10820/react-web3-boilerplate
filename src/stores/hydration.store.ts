import { create } from "zustand";

interface HydrationProps {
  isAuthStoreHydrated: boolean;
}

interface HydrationState extends HydrationProps {}

const initialState: HydrationProps = {
  isAuthStoreHydrated: false,
};

const useHydrationStore = create<HydrationState>()(() => ({
  ...initialState,
}));

export const useIsAuthStoreHydrated = () =>
  useHydrationStore((state) => state.isAuthStoreHydrated);

export const setIsAuthStoreHydrated = (isAuthStoreHydrated: boolean) =>
  useHydrationStore.setState({ isAuthStoreHydrated });
