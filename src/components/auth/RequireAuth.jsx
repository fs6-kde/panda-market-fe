"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      const search = searchParams?.toString();
      const current = pathname + (search ? `?${search}` : "");
      // 현재 경로를 redirect로 붙여 로그인으로 이동
      router.replace(`/login?redirect=${encodeURIComponent(current)}`);
    }
  }, [isLoading, user, pathname, searchParams, router]);

  if (!user) return null; // or 스켈레톤

  return children;
}
