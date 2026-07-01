import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import { CurrentUserProvider } from "./lib/currentUser";
import "./index.css";

// Auth is optional at runtime: without a publishable key (e.g. local dev before
// Clerk is configured) the app mounts without a provider and runs anonymously.
// Components read the user via useCurrentUserCtx, which is safe either way.
const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const app = clerkKey ? (
  <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">
    <CurrentUserProvider>
      <App />
    </CurrentUserProvider>
  </ClerkProvider>
) : (
  <App />
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>{app}</StrictMode>
);
