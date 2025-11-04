"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import plusIcon from "@/assests/plus.svg";
import closeIcon from "@/assests/close.svg";
import InputField from "@/components/ui/InputField";
import { postProduct } from "@/lib/api/postProduct";
import { useRouter } from "next/navigation";

export default function ProductRegisterPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // 같은 이미지 삭제 후 재등록 시, 파일 인풋을 초기화하기 위한 ref
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const urls = files.map((f) => URL.createObjectURL(f));

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...urls]);

    // 같은 파일을 다시 선택해도 change가 발생하도록 값을 비워준다
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index) => {
    // 미리보기 URL 메모리 해제
    const url = previews[index];
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));

    // 삭제 후에도 동일 파일을 다시 선택할 수 있도록 인풋 초기화
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (!trimmed) return;
      if (trimmed.length > 5) {
        setTagError("5글자 이내로 입력해주세요");
        return;
      }
      if (tags.includes(trimmed)) {
        setTagError("이미 등록된 태그입니다");
        return;
      }
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
      setTagError("");
    }
  };

  const handleTagDelete = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price.trim()) {
      alert("상품명과 가격은 필수입니다.");
      return;
    }

    try {
      setIsSubmitting(true);

      await postProduct({
        name,
        price: Number(price.replace(/,/g, "")),
        description,
        tags,
        images,
      });

      // 미리보기 blob URL들 메모리 해제
      previews.forEach((u) => u.startsWith("blob:") && URL.revokeObjectURL(u));

      alert("상품이 등록되었습니다.");
      router.push("/market");
    } catch (err) {
      alert("상품 등록에 실패했습니다: " + err?.message ?? "");
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = !name.trim() || !price.trim() || isSubmitting;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      {/* 상단: 제목 & 버튼 */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-lg font-bold">상품 등록하기</h1>
        <button
          className={`${
            disabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 transition-all duration-200 ease-in-out"
          } text-white text-xs px-5 py-2 rounded-md`}
          onClick={handleSubmit}
          disabled={disabled}
        >
          등록
        </button>
      </div>

      {/* 이미지 업로드 */}
      <div className="mb-8">
        <label className="block text-base font-semibold text-gray-800 mb-2">
          상품 이미지
        </label>
        <div className="flex gap-4 flex-wrap">
          {/* 추가 버튼 */}
          <label className="w-[240px] h-[240px] bg-gray-100 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-300 cursor-pointer hover:bg-gray-200 transition">
            <Image src={plusIcon} alt="이미지 등록" width={35} height={35} />
            <p className="text-xs text-gray-400 mt-2">이미지 등록</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* 이미지 미리보기 */}
          {previews.map((src, i) => (
            <div
              key={i}
              className="relative w-[230px] h-[240px] rounded-lg overflow-hidden group"
            >
              <img
                src={src}
                alt={`preview-${i}`}
                className="w-full h-full object-cover"
              />

              {/* 삭제 버튼 (hover 시 어두워짐) */}
              <button
                onClick={() => handleRemoveImage(i)}
                className="absolute top-1 right-1 rounded-full transition duration-300 hover:brightness-75"
              >
                <Image
                  src={closeIcon}
                  alt="삭제"
                  width={19}
                  height={19}
                  className="transition duration-300"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 상품명 */}
      <div className="mb-6">
        <InputField
          label="상품명"
          placeholder="상품명을 입력해주세요"
          value={name}
          setValue={setName}
          required={true}
        />
      </div>

      {/* 상품 소개 */}
      <div className="mb-6">
        <label className="block mb-2 text-base font-semibold text-gray-800">
          상품 소개
        </label>
        <textarea
          placeholder="상품 소개를 입력해주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-5 py-4 rounded-xl focus:outline-blue-400 bg-gray-100 resize-none placeholder:text-gray-400 placeholder:text-sm min-h-[150px]"
        />
      </div>

      {/* 판매가격 */}
      <div className="mb-6">
        <InputField
          label="판매가격"
          placeholder="판매 가격을 입력해주세요"
          value={price}
          setValue={setPrice}
          required={true}
        />
      </div>

      {/* 태그 */}
      <div className="mb-6">
        <label className="block mb-2 text-base font-semibold text-gray-800">
          태그
        </label>
        <input
          type="text"
          placeholder="태그를 입력해주세요"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          className={`w-full px-5 py-3 rounded-xl bg-gray-100 focus:outline-blue-400 placeholder:text-gray-400 placeholder:text-sm ${
            tagError ? "border border-red-500" : ""
          }`}
        />
        {tagError && (
          <p className="text-xs font-semibold text-red-500 mt-2 px-4">
            {tagError}
          </p>
        )}

        {/* 태그 미리보기 */}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((t, i) => (
            <div
              key={i}
              className="flex items-center bg-gray-200 text-sm text-gray-700 px-3 py-1 rounded-full"
            >
              # {t}
              <button onClick={() => handleTagDelete(i)} className="ml-2">
                <Image src={closeIcon} alt="삭제" width={12} height={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
