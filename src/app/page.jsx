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

  return (
    <div className="flex justify-center mt-20">
      Homepage
      <img
        src="https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/Sprint_Mission/user/1014/1746080244939/image%2042.png"
        alt="맥북"
        width={300}
        height={300}
      />
    </div>
  );
}
