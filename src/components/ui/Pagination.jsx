// components/ui/Pagination.jsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex justify-center items-center gap-2">
      <button
        disabled={isFirst}
        className="p-2 disabled:opacity-30"
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`w-8 h-8 text-sm rounded-full transition ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        disabled={isLast}
        className="p-2 disabled:opacity-30"
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
