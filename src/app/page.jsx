"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      router.replace("/market");
    }
  }, []);

  return <div className="flex justify-center mt-20">Homepage</div>;
}
