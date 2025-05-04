"use client";

import Image from "next/image";
import Search from "@/components/ui/Search";
import SortDropdown from "@/components/ui/SortDropdown";
import Pagination from "@/components/ui/Pagination";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/api/getProducts";
import test from "../../../public/image 42.png";
import { Heart } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

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
        {bestProducts.map((product) => (
          <div key={product.id}>
            <Image
              src={product.images?.[0] || test}
              alt={product.name}
              width={300}
              height={300}
              className="rounded-md object-cover w-full h-[150px]"
            />
            <p className="mt-2 text-sm text-gray-700">{product.name}</p>
            <p className="text-base font-bold text-gray-900">
              {product.price.toLocaleString()}원
            </p>
            <span className="flex items-center text-xs text-gray-400 gap-1">
              <Heart className="w-4 h-4" />
              {product.favoriteCount}
            </span>
          </div>
        ))}
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
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-6 py-2 rounded-lg whitespace-nowrap">
            상품 등록하기
          </button>

          {/* 정렬 드롭다운 */}
          <SortDropdown selected={sortOption} onChange={setSortOption} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <Link key={product.id} href={`/market/${product.id}`}>
            <div>
              <Image
                src={product.images?.[0] || test}
                alt={product.name}
                width={300}
                height={300}
                className="rounded-md object-cover w-full h-[150px]"
              />
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
        ))}
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
