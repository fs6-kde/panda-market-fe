"use client";

import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [placeholder, setPlaceholder] = useState("검색할 상품을 입력해주세요");

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setPlaceholder("")}
        onBlur={() => setPlaceholder("검색할 상품을 입력해주세요")}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
