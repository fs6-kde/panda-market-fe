"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function SortDropdown({
  options = ["최신순", "댓글순"],
  selected,
  onChange,
  placeholder = "정렬",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);

  // 옵션을 {label, value}로 정규화
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  // 리스트 선택
  const selectedItem =
    normalized.find((o) => o.value === selected) ?? normalized[0];

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (value) => {
    onChange?.(value);
    setIsOpen(false);
  };

  return (
    <div ref={wrapRef} className={`relative text-sm ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center justify-between gap-6 px-4 py-2 rounded-lg border border-gray-200 text-gray-800 bg-white hover:bg-gray-50"
      >
        {selectedItem ? selectedItem.label : placeholder}
        <ChevronDown className="w-4 h-4 text-gray-700" />
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md z-10 overflow-hidden">
          {normalized.map((opt, idx) => {
            const isActive = opt.value === selectedItem?.value;
            return (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                  idx === 0 ? "rounded-t-lg" : ""
                } ${idx === normalized.length - 1 ? "rounded-b-lg" : ""}`}
              >
                <span>{opt.label}</span>
                {isActive && <Check className="w-4 h-4 text-gray-600" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
