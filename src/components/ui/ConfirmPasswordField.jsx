"use client";
import React, { useState } from "react";
import Image from "next/image";
import Visible from "@/assests/eye-visible.svg";
import Invisible from "@/assests/eye-invisible.svg";

export default function ConfirmPasswordField({
  label,
  placeholder,
  password,
  value,
  setValue,
  setErrorState,
}) {
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const validate = (val) => {
    if (val.trim() === "" || val !== password) {
      setError("비밀번호가 일치하지 않습니다.");
      setErrorState?.(true);
    } else {
      setError("");
      setErrorState?.(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    validate(val);
  };

  const handleBlur = (e) => validate(e.target.value);

  return (
    <div className="mb-6 relative w-full">
      <label className="block mb-2 text-sm font-semibold text-gray-800">
        {label}
      </label>
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full px-4 py-3 pr-10 rounded-xl bg-gray-100 placeholder:text-gray-400 focus:outline-blue-400 ${
          error ? "border border-red-500" : ""
        }`}
      />
      <div
        className="absolute right-4 top-10 cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <Image
          src={show ? Visible : Invisible}
          alt="toggle visibility"
          width={20}
          height={20}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
