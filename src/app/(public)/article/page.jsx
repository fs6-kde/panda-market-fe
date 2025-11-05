"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import sampleImg from "@/assests/macbook.svg";
import { Heart } from "lucide-react";
import Search from "@/components/ui/Search";
import SortDropdown from "@/components/ui/SortDropdown";
import Link from "next/link";
import { getArticles } from "@/lib/api/getArticles";
import medal from "@/assests/medal.svg";

export default function Article() {
  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortOption, setSortOption] = useState("최신순");

  // 서버 정렬 파라미터 매핑
  const orderParam = sortOption === "댓글순" ? "comment" : "recent";

  // 데이터 불러오기
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { list } = await getArticles({ orderBy: orderParam });
        // 임시 좋아요 수(데모용), 작성자 닉네임 fallback
        const withLikes = list.map((article) => ({
          ...article,
          likes: Math.floor(Math.random() * 1000) + 1,
          author: article.author ?? { id: 0, nickName: "총명한 판다" },
        }));

        // 베스트 섹션은 최신순 기준으로 잡기 위해 최신순 배열 별도 생성
        const latestSorted = [...withLikes].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // 본문 리스트는 서버 정렬 그대로 사용 (orderParam에 따름)
        setArticles(orderParam === "recent" ? latestSorted : withLikes);
      } catch (e) {
        console.error("게시글 불러오기 실패:", e);
      }
    };

    fetchArticles();
  }, [orderParam]);

  // 베스트 게시글: 최신순 기준 상위 3개
  const bestArticles = [...articles]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  // 본문 정렬: 드롭다운이 만약 "좋아요순"을 넘겨주는 컴포넌트라면 아래 매핑만 바꾸면 됩니다.
  // 현재는 서버 정렬을 따르되, 혹시 "좋아요순" 옵션이 들어오면 클라이언트에서 likes로 정렬하는 것도 가능:
  // const sortedArticles = sortOption === "좋아요순"
  //   ? [...articles].sort((a,b)=> b.likes - a.likes)
  //   : articles;
  const sortedArticles = articles;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="withHeader px-4 xl:px-[200px] pb-16 flex-1">
        {/* 베스트 게시글 영역 */}
        <h2 className="text-xl font-bold mt-20 mb-4">베스트 게시글</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {bestArticles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <div className="relative w-full aspect-[13/5] rounded-xl bg-[#f9fafb] p-4 flex flex-col justify-between shadow-sm hover:bg-gray-200 transition cursor-pointer">
                {/* 베스트 라벨 */}
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-[15px] font-medium w-full px-4 py-0.5 rounded-t-xl shadow-sm flex items-center gap-1">
                  <Image src={medal} width={13} height={13} alt="medal" />
                  Best
                </div>

                <div className="flex justify-between mt-7 gap-15">
                  <div className="font-bold text-gray-800">{article.title}</div>
                  <Image
                    src={sampleImg}
                    alt="sample"
                    width={56}
                    height={56}
                    className="rounded-md border border-gray-200 object-cover"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      {article.author?.nickName ?? "총명한 판다"}
                    </span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Heart className="w-4 h-4" />
                      {article.likes}
                    </span>
                  </div>
                  <div className="text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 게시글 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">게시글</h2>
          <Link href="/writes">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">
              글쓰기
            </button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <div className="flex-1 min-w-[240px]">
            {/* 아직 미구현 ui만 유지 */}
            <Search onSearch={setKeyword} />
          </div>
          {/* 현 드롭다운 : 최신순 / 댓글순 */}
          <SortDropdown
            options={["최신순", "댓글순"]}
            selected={sortOption}
            onChange={setSortOption}
          />
        </div>

        <ul className="space-y-4">
          {sortedArticles.map((article) => (
            <li key={article.id}>
              <Link href={`/article/${article.id}`}>
                <div className="p-4 rounded-xl bg-[#f9fafb] shadow-sm hover:bg-gray-200 transition cursor-pointer">
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
                    <div className="flex items-center gap-2">
                      <span>{article.author?.nickName ?? "총명한 판다"}</span>
                      <span>
                        {new Date(article.createdAt).toLocaleDateString(
                          "ko-KR"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Heart className="w-4 h-4" />
                      {article.likes}
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
