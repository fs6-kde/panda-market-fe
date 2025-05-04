"use client";

import React from "react";
import Image from "next/image";
import Google from "@/assests/google.svg";
import Kakao from "@/assests/kakao.svg";

export default function OIDCGroup() {
  return (
    <div className="bg-blue-50 mt-6 py-4 px-6 rounded-lg w-full">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">간편 로그인하기</p>
        <div className="flex gap-3">
          <a href="https://www.google.com">
            <Image
              src={Google}
              alt="Google"
              width={36}
              height={36}
              className="cursor-pointer"
            />
          </a>
          <a href="https://www.kakaocorp.com/page">
            <Image
              src={Kakao}
              alt="Kakao"
              width={36}
              height={36}
              className="cursor-pointer"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
