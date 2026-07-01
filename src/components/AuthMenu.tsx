import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

/** Whether Clerk is configured. When false (no publishable key), `main.tsx`
 *  doesn't mount `<ClerkProvider>`, so this component must render nothing —
 *  Clerk's components would otherwise throw without a provider. The /api/me
 *  fetch lives in CurrentUserProvider, also mounted only when Clerk is on. */
const clerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

/** Topbar auth control: sign-in button when signed out, the Clerk user menu when
 *  signed in. Renders nothing when auth isn't configured. */
export function AuthMenu() {
  if (!clerkEnabled) return null;
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="auth-signin-btn">Sign in</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
