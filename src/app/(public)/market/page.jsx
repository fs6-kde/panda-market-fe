"use client";

import Image from "next/image";
import Search from "@/components/ui/Search";
import SortDropdown from "@/components/ui/SortDropdown";
import Pagination from "@/components/ui/Pagination";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/getProducts";
import test from "../../../../public/test.svg";
import { Heart } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

const S3_ORIGIN = process.env.NEXT_PUBLIC_S3_ORIGIN ?? "";
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";

// 이미지 경로를 안전하게 절대 URL로 변환
function toImageUrl(key) {
  if (!key) return test.src;

  // 이미 절대 URL이면 그대로
  if (/^https?:\/\//i.test(key)) return key;

  // 백엔드 정적 경로라면
  if (key.startsWith("/")) return `${API_ORIGIN}${key}`;

  // 일반적인 S3 key라면
  return `${S3_ORIGIN}/${key}`;
}

export default function Market() {
  const [products, setProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("최신순");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProducts({
          page: currentPage,
          pageSize: ITEMS_PER_PAGE,
          orderBy: sortOption === "최신순" ? "recent" : "favorite",
        });

        setProducts(res.list);
        setTotalCount(res.totalCount);
      } catch (err) {
        console.error("상품 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [currentPage, sortOption]);

  useEffect(() => {
    const fetchBest = async () => {
      try {
        const res = await getProducts({ page: 1, pageSize: 1000 }); // 전체 가져오기
        const sorted = res.list
          .sort((a, b) => b.favoriteCount - a.favoriteCount)
          .slice(0, 4);
        setBestProducts(sorted);
      } catch (err) {
        console.error("베스트 상품 불러오기 실패:", err);
      }
    };
    fetchBest();
  }, []);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  return (
    <div className="flex flex-col min-h-screen px-4 xl:px-[200px] pb-16">
      {/* 베스트 상품 영역 */}
      <h2 className="text-xl font-bold mt-20 mb-4">베스트 상품</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {bestProducts.map((product) => {
          const src = toImageUrl(product.images?.[0]);
          const isFallback = src === test.src;

          return (
            <Link key={product.id} href={`/market/${product.id}`}>
              <div className="relative w-[200px] h-[150px] rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                {isFallback ? (
                  // 기본 이미지: 축소 + 중앙
                  <Image
                    src={test}
                    alt="기본 이미지"
                    width={70}
                    height={70}
                    className="object-contain opacity-90"
                    priority={false}
                  />
                ) : (
                  // 실제 이미지: 꽉 채우기
                  <Image
                    src={src}
                    alt={product.name}
                    fill
                    className="object-cover"
                    // sizes="(min-width:744px) 200px, 50vw"
                    priority={false}
                  />
                )}
              </div>

              <p className="mt-2 text-sm text-gray-700">{product.name}</p>
              <p className="text-base font-bold text-gray-900">
                {product.price.toLocaleString()}원
              </p>
              <span className="flex items-center text-xs text-gray-400 gap-1">
                <Heart className="w-4 h-4" />
                {product.favoriteCount}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 판매 중인 상품 영역 */}
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-bold whitespace-nowrap">판매 중인 상품</h2>

        <div className="flex flex-1 justify-end items-center gap-3 min-w-[300px]">
          {/* Search */}
          <div className="w-full max-w-[300px]">
            <Search placeholder="검색할 상품을 입력해주세요" />
          </div>

          {/* 상품 등록하기 버튼 */}
          <Link href="/market/posts">
            <button className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 ease-in-out text-white text-sm px-6 py-2 rounded-lg whitespace-nowrap">
              상품 등록하기
            </button>
          </Link>

          {/* 정렬 드롭다운 */}
          <SortDropdown
            options={["최신순", "좋아요순"]}
            selected={sortOption}
            onChange={setSortOption}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          const src = toImageUrl(product.images?.[0]);
          const isFallback = src === test.src;

          return (
            <Link key={product.id} href={`/market/${product.id}`}>
              <div>
                <div className="relative w-[200px] h-[150px] rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                  {isFallback ? (
                    <Image
                      src={test}
                      alt="기본 이미지"
                      width={70}
                      height={70}
                      className="object-contain opacity-90"
                      priority={false}
                    />
                  ) : (
                    <Image
                      src={src}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(min-width:744px) 220px, 50vw"
                      priority={false}
                    />
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-700">{product.name}</p>
                <p className="text-base font-bold text-gray-900">
                  {product.price.toLocaleString()}원
                </p>
                <span className="flex items-center text-xs text-gray-400 gap-1">
                  <Heart className="w-4 h-4" />
                  {product.favoriteCount}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
