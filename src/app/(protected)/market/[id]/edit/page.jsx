"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import plusIcon from "@/assests/plus.svg";
import closeIcon from "@/assests/close.svg";
import InputField from "@/components/ui/InputField";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "@/lib/api/getProducts";
import { patchProduct } from "@/lib/api/patchProduct";

const S3_ORIGIN = process.env.NEXT_PUBLIC_S3_ORIGIN ?? "";
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";

// 키/절대URL/백엔드 정적경로 모두 커버하는 URL 변환
const toImageUrl = (key) => {
  if (!key) return "";
  if (/^https?:\/\//i.test(key)) return key; // 절대 URL
  if (key.startsWith("/")) return `${API_ORIGIN}${key}`; // /uploads/.. 등
  return `${S3_ORIGIN}/${key}`; // S3 key
};

export default function ProductEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [tagError, setTagError] = useState(false);

  const [existingImages, setExistingImages] = useState([]);
  const [newImageKeys, setNewImageKeys] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기존 상품 정보 불러오기
  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const data = await getProduct(Number(id));
        setProduct(data);
        setName(data.name || "");
        setPrice(data.price?.toString() || "");
        setDescription(data.description || "");
        setTags(data.tags || []);

        // 기존 이미지: 서버에는 받은 값 그대로 보내고,
        // 미리보기는 절대 URL로 변환해서 렌더
        const exist = data.images ?? [];
        setExistingImages(exist);
        setPreviews(exist.map(toImageUrl).filter(Boolean));
      } catch (err) {
        alert("상품 정보를 불러오지 못했습니다.");
        router.push("/market");
      }
    }

    fetchProduct();
  }, [id, router]);

  // 태그 입력 핸들러
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
      setTagError(false);
    }
  };

  const handleRemoveTag = (i) => {
    setTags(tags.filter((_, index) => index !== i));
  };

  // 이미지 등록 삭제 핸들러
  const handleDeleteImage = (index) => {
    setPreviews((arr) => arr.filter((_, i) => i !== index));

    // existingImages 먼저 소진
    if (index < existingImages.length) {
      setExistingImages((arr) => arr.filter((_, i) => i !== index));
    } else {
      const newIdx = index - existingImages.length;
      setNewImageKeys((arr) => arr.filter((_, i) => i !== newIdx));
    }
  };

  // 이미지 업로드 핸들러
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const fd = new FormData();
          // 서버 미들웨어: upload.single("images") 이므로 "images" 사용
          fd.append("images", file);

          const res = await fetch(`${API_ORIGIN}/api/upload`, {
            method: "POST",
            body: fd,
            credentials: "include",
          });
          if (!res.ok) throw new Error("이미지 업로드 실패");

          // 서버 응답
          return res.json();
        })
      );

      // 서버 저장용은 key, 미리보기는 url
      setNewImageKeys((prev) => [...prev, ...results.map((r) => r.key)]);
      setPreviews((prev) => [...prev, ...results.map((r) => r.url)]);
    } catch (err) {
      alert(err?.message ?? "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      // 같은 파일을 다시 올릴 수 있도록 초기화
      e.target.value = "";
    }
  };

  // 수정 등록
  const handleSubmit = async () => {
    if (!name.trim() || !String(price).trim()) {
      alert("상품명과 가격은 필수입니다.");
      return;
    }

    if (!confirm("정말 수정하시겠습니까?")) return;

    try {
      setIsSubmitting(true);

      await patchProduct(id, {
        name: name.trim(),
        price: Number(price),
        description: description ?? "",
        tags,
        // 서버에서 키/절대URL 둘 다 수용 가능하도록 설계한 것을 그대로 전달
        existingImages, // 남겨둘 기존 이미지들
        images: newImageKeys, // 새로 추가된 이미지들(key)
      });

      alert("상품이 수정되었습니다.");
      router.push(`/market/${id}`);
    } catch (err) {
      alert("수정에 실패했습니다: " + err.message ?? "");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return <div className="p-10">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-lg font-bold">상품 수정하기</h1>
        <button
          className={`${
            isSubmitting
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white text-xs px-5 py-2 rounded-md`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          수정
        </button>
      </div>

      {/* 상품 이미지 */}
      <div className="mb-8">
        <label className="block text-base font-semibold text-gray-800 mb-2">
          상품 이미지
        </label>
        <div className="flex gap-4 flex-wrap">
          <label className="w-[240px] h-[240px] bg-gray-100 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-300 cursor-pointer">
            <Image src={plusIcon} alt="이미지 등록" width={35} height={35} />
            <p className="text-xs text-gray-400 mt-2">이미지 등록</p>
            <input
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
              <Image
                src={src}
                alt={`preview-${i}`}
                fill
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(i)}
                className="absolute top-1 right-1 rounded-full transition duration-300 hover:brightness-75"
              >
                <Image src={closeIcon} alt="삭제" width={19} height={19} />
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
      <div className="mb-5">
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
        <label className="block font-semibold text-gray-800 mb-2">태그</label>
        <input
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
            setTagError(false);
          }}
          onKeyDown={handleTagKeyDown}
          placeholder="태그를 입력해주세요"
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
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center bg-gray-200 text-sm text-gray-700 rounded-full px-3 py-1"
            >
              # {tag}
              <button onClick={() => handleRemoveTag(i)} className="ml-2">
                <Image src={closeIcon} alt="태그 삭제" width={12} height={12} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
