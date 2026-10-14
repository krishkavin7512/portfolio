"use client";

import { useSyncExternalStore } from "react";

type State = { loaded: boolean; menuOpen: boolean };

let state: State = { loaded: false, menuOpen: false };
const listeners = new Set<() => void>();

export const appState = {
  get: () => state,
  set(patch: Partial<State>) {
    state = { ...state, ...patch };
    // notify outside the caller's stack so GSAP contexts (and their scoped selectors) don't leak in
    queueMicrotask(() => listeners.forEach((l) => l()));
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useAppState<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    appState.subscribe,
    () => select(appState.get()),
    () => select({ loaded: false, menuOpen: false }),
  );
}

/** Resolves once the preloader has finished (immediately if it already has). */
export function whenLoaded(cb: () => void) {
  if (state.loaded) {
    cb();
    return () => {};
  }
  const unsub = appState.subscribe(() => {
    if (state.loaded) {
      unsub();
      cb();
    }
  });
  return unsub;
}
