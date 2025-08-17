import { create as actualCreate } from "zustand";
import type { StateCreator } from "zustand";

const storeResetFns = new Set<() => void>();

export const resetAllControlledStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn();
  });
};

export const createControlledStore = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator);
    const initialState = store.getInitialState();
    storeResetFns.add(() => {
      store.setState(initialState, true);
    });
    return store;
  };
}) as typeof actualCreate;
