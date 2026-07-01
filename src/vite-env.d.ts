/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Clerk publishable key. Absent → auth UI is hidden and the app runs anonymously. */
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
