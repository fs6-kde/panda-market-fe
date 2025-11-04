"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import menuIcon from "@/assests/menu.svg";

export default function Menubar({
  canManage = false, // 내가 쓴 컨텐츠/댓글이면 true
  onEdit, // 수정 액션
  onDelete, // 삭제 액션
  onReport, // 신고 액션
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="disabled:opacity-50"
      >
        <Image src={menuIcon} alt="menu" width={3.5} height={3.5} />
      </button>

      {open && (
        <div className="absolute right-3 top-3 mt-2 w-25 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 z-10 overflow-hidden">
          {canManage ? (
            <>
              <button
                className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:rounded-t-lg"
                onClick={() => {
                  setOpen(false);
                  onEdit?.();
                }}
              >
                수정하기
              </button>
              <hr className="border-gray-200" />
              <button
                className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:rounded-b-lg"
                onClick={() => {
                  setOpen(false);
                  onDelete?.();
                }}
              >
                삭제하기
              </button>
            </>
          ) : (
            <button
              className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:rounded-lg"
              onClick={() => {
                setOpen(false);
                onReport?.();
              }}
            >
              신고하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
