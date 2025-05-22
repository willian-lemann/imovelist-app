import { createAuthClient } from "better-auth/react";

console.log(import.meta.env.VITE_BETTER_AUTH_URL);
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
});
