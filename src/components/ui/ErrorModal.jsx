"use client";

import React from "react";

export default function ErrorModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl px-8 py-6 max-w-sm w-full text-center">
        <p className="text-gray-800 text-base font-medium mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          확인
        </button>
      </div>
    </div>
  );
}
