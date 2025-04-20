"use client";

import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";

export default function Search({ onSearch }) {
  const [placeholder, setPlaceholder] = useState("검색할 상품을 입력해주세요");
  const [keyword, setKeyword] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // 빈 입력값을 Enter 시 전체 목록 불러옴
      onSearch(keyword.trim());
    }
  };

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onFocus={() => setPlaceholder("")}
        onBlur={() => setPlaceholder("검색할 상품을 입력해주세요")}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-sm text-gray-700 placeholder-gray-400 outline-none hover:bg-gray-200 transition cursor-pointer focus:ring-1 focus:ring-blue-500 focus:bg-gray-100"
      />
    </div>
  );
}
