"use client";

import React from "react";
import { Loader } from "lucide-react";

export default function Button({ disabled, children, loading }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full h-12 rounded-3xl text-white text-base font-medium transition-colors duration-200 flex justify-center items-center gap-2 ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {loading && <Loader className="w-4 h-4 animate-spin" />}
      <span className="inline-block min-w-[70px] text-center">{children}</span>
    </button>
  );
}
