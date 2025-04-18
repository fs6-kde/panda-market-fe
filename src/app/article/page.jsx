"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import sampleImg from "@/assests/macbook.svg";
import { Heart } from "lucide-react";
import Search from "@/components/ui/Search";
import SortDropdown from "@/components/ui/SortDropdown";
import Link from "next/link";
import { getArticles } from "@/lib/api/getArticles";
// import medal from "@/assests/medal.svg";

export default function Article() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getArticles();
        setArticles(data);
      } catch (e) {
        console.error("게시글 불러오기 실패:", e);
      }
    };
    fetch();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="withHeader px-4 xl:px-[200px] pb-16 flex-1">
        {/* 베스트 게시글 영역 */}
        <h2 className="text-xl font-bold mt-20 mb-4">베스트 게시글</h2>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {bestArticles.map((article, i) => (
            <div
              key={i}
              className="w-full aspect-[16/7] rounded-xl bg-[#f9fafb] p-4 flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold">
                <span className="text-xl">
                  <Image src={medal} alt="medal" />
                </span>{" "}
                Best
              </div>
              <div className="flex items-start justify-between mt-2 gap-2">
                <div className="font-bold text-gray-800 leading-snug text-base">
                  {article.title}
                </div>
                <Image
                  src={sampleImg}
                  alt="sample"
                  width={56}
                  height={56}
                  className="rounded-md border border-gray-200 shrink-0"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                <div className="flex items-center gap-1">
                  <span>{article.author}</span>
                  <span className="flex items-center gap-0.5">
                    <Heart className="w-4 h-4" />
                    {article.likes}
                  </span>
                </div>
                <div>{article.date}</div>
              </div>
            </div>
          ))}
        </div> */}

        {/* 게시글 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">게시글</h2>
          <Link href="/writes">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
              글쓰기
            </button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            <Search />
          </div>
          <SortDropdown />
        </div>

        <ul className="space-y-4">
          {articles
            .slice() // 기존 배열 훼손 방지
            .reverse() // 기존 배열을 프론트에서 역순 처리
            .map((article) => (
              <li key={article.id}>
                <Link href={`/article/${article.id}`}>
                  <div className="p-4 rounded-xl bg-[#f9fafb] shadow-sm cursor-pointer hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start gap-4">
                      <div className="font-bold text-gray-800 leading-snug text-base">
                        {article.title}
                      </div>
                      <Image
                        src={sampleImg}
                        alt="thumbnail"
                        width={56}
                        height={56}
                        className="rounded-md border border-gray-200 shrink-0"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mt-2">
                      <div className="flex items-center gap-1">
                        <span>총명한 판다</span>
                        <span className="flex items-center gap-0.5">
                          <Heart className="w-4 h-4" />0
                        </span>
                      </div>
                      <div>
                        {new Date(article.createdAt).toLocaleDateString(
                          "ko-KR"
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </main>
    </div>
  );
}
