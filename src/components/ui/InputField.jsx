"use client";

import React, { useState } from "react";

export default function InputField({
  label,
  placeholder,
  type = "text",
  value,
  setValue,
  validate,
  errorMessageIfInvalid,
  setErrorState,
  required = false,
}) {
  const [error, setError] = useState("");

  const validateValue = (val) => {
    if (required && val.trim() === "") {
      setError("필수 입력사항입니다");
      setErrorState?.(true);
    } else if (validate && !validate(val)) {
      setError(errorMessageIfInvalid);
      setErrorState?.(true);
    } else {
      setError("");
      setErrorState?.(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    validateValue(val);
  };

  const handleBlur = (e) => validateValue(e.target.value);

  return (
    <div className="mb-4 w-full">
      <label className="block mb-2 text-base font-semibold text-gray-800">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full px-5 py-3 rounded-xl focus:outline-blue-400 bg-gray-100 placeholder:text-gray-400 placeholder:text-sm ${
          error ? "border border-red-500" : ""
        }`}
      />
      {error && (
        <p className="text-xs text-red-500 font-semibold mt-2 px-3.5">
          {error}
        </p>
      )}
    </div>
  );
}
