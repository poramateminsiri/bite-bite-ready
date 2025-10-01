/**
 * BetterAuth Client Configuration
 * Handles authentication on the frontend
 */

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001", // Your Express server URL
});

// Export commonly used hooks and methods for convenience
export const {
  useSession,
  signIn,
  signOut,
  signUp,
} = authClient;
