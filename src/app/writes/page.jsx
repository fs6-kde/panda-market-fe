"use client";

import { getArticle } from "@/lib/api/getArticles";
import { patchArticle } from "@/lib/api/patchArticle";
import { postArticle } from "@/lib/api/postArticles";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titlePlaceholder, setTitlePlaceholder] =
    useState("제목을 입력해주세요");
  const [contentPlaceholder, setContentPlaceholder] =
    useState("내용을 입력해주세요");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // 수정할 게시글 id 찾기 (수정 모드 여부로 사용)

  // 기존 데이터 불러오기
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        const data = await getArticle(id);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        console.error("수정할 게시글 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // 수정하기
        await patchArticle(id, { title, content });
        alert("성공적으로 수정되었습니다.");
        router.push(`/article/${id}`);
      } else {
        // 등록하기
        const created = await postArticle({
          title,
          content,
        });
        alert("성공적으로 등록되었습니다.");
        router.push(`/article/${created.id}`);
      }
    } catch (error) {
      console.error("등록/수정 실패:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const isButtonDisabled = title.trim() === "" || content.trim() === "";

  return (
    <main className="flex flex-col items-center justify-start mt-20 min-h-screen px-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">
            게시글 {id ? "수정" : "쓰기"}
          </h1>
          <button
            className={`px-4 py-2 rounded-md text-sm font-semibold text-white ${
              isButtonDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={handleSubmit}
            disabled={isButtonDisabled}
          >
            {id ? "수정" : "등록"}
          </button>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">* 제목</label>
            <input
              type="text"
              placeholder={titlePlaceholder}
              onFocus={() => setTitlePlaceholder("")}
              onBlur={() => setTitlePlaceholder("제목을 입력해주세요")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none hover:bg-gray-200 transition cursor-pointer focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">* 내용</label>
            <textarea
              rows="10"
              placeholder={contentPlaceholder}
              onFocus={() => setContentPlaceholder("")}
              onBlur={() => setContentPlaceholder("내용을 입력해주세요")}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 resize-none focus:outline-none hover:bg-gray-200 transition cursor-pointer focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </form>
      </div>
    </main>
  );
}
