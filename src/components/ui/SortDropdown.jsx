"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SortDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("최신순");

  const handleSelect = (value) => {
    setSelected(value);
    setIsOpen(false);
  };

  return (
    <div className="relative text-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-800 bg-white hover:bg-gray-50"
      >
        {selected}
        <ChevronDown className="w-4 h-4 text-gray-700" />
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10">
          <li
            onClick={() => handleSelect("최신순")}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-t-lg"
          >
            최신순
          </li>
          <li
            onClick={() => handleSelect("좋아요순")}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-b-lg"
          >
            좋아요순
          </li>
        </ul>
      )}
    </div>
  );
}
