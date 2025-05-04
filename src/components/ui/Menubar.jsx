"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import menuIcon from "@/assests/menu.svg";

export default function Menubar({ onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen((prev) => !prev)}>
        <Image src={menuIcon} alt="menu" width={3.5} height={3.5} />
      </button>

      {isOpen && (
        <div className="absolute left-2 top-0 mt-2 w-28 bg-white border border-gray-200 rounded-xl">
          <button
            onClick={() => {
              onEdit?.();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            수정하기
          </button>
          <hr className="border-gray-200" />
          <button
            onClick={() => {
              onDelete?.();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
}
