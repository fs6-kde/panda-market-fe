"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { usePathname, useRouter } from "next/navigation";

export default function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // 로딩 중엔 대기
    if (!user) {
      // 로그인 후 원래 위치로 돌아가도록 next 파라미터 포함
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="w-full py-16 flex items-center justify-center text-gray-500">
        인증 확인 중...
      </div>
    );
  }

  if (!user) return null; // 리다이렉트 직전 빈 화면

  return <>{children}</>;
}
