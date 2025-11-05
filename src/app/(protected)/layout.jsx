"use client";

import RequireAuth from "@/components/auth/RequireAuth";

export default function ProtectedLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
