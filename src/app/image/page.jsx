import Image from "next/image";
import React from "react";
import test from "../../../public/example.png";

export default function ExampleImage() {
  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
      {/* 중앙 이미지 */}
      <div className="p-6 rounded-lg">
        <Image
          src={test}
          alt="기본 이미지"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>
    </div>
  );
}
