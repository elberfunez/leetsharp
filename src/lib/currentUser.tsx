import { createContext, useContext, type ReactNode } from "react";
import { useCurrentUser, type CurrentUser } from "./useCurrentUser";

interface CurrentUserContextValue {
  user: CurrentUser | null;
  loading: boolean;
}

/** Default (no provider / auth disabled): anonymous. `useContext` never throws,
 *  so components can read this anywhere, including when Clerk isn't configured. */
const CurrentUserContext = createContext<CurrentUserContextValue>({ user: null, loading: false });

/** Mounted inside `<ClerkProvider>` only. Calls GET /api/me once and shares the
 *  result, so the nav, route guards, and pages don't each re-fetch it. */
export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const value = useCurrentUser();
  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUserCtx() {
  return useContext(CurrentUserContext);
}
