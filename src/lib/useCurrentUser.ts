import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useAuthedFetch } from "./api";

/** Shape returned by GET /api/me. Mirrors the `users` row (minus timestamps). */
export interface CurrentUser {
  id: string;
  githubLogin: string | null;
  name: string | null;
  role: "contributor" | "admin";
}

/**
 * Loads the signed-in user's record from GET /api/me. The first call after
 * sign-in is also what creates the `users` row (lazy upsert server-side).
 * Must be used within `<ClerkProvider>`.
 */
export function useCurrentUser() {
  const { isLoaded, isSignedIn } = useAuth();
  const authedFetch = useAuthedFetch();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setUser(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    authedFetch("/api/me")
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (!cancelled) setUser(data.user as CurrentUser);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, authedFetch]);

  return { user, loading };
}
