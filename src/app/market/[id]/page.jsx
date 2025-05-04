"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "@/lib/api/getProducts";
import Image from "next/image";
import test from "../../../../public/image 42.png";
import userIcon from "@/assests/user.svg";
import arrowLeftIcon from "@/assests/arrow_back.svg";
import pandaQuestionImg from "@/assests/panda-question.svg";
import { getProductComments } from "@/lib/api/getProductComments";
import { postProductComment } from "@/lib/api/postProductComment";
import Menubar from "@/components/ui/Menubar";
import FavoriteButton from "@/components/ui/FavoriteButton";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasRedirectedRef = useRef(false);

  const [newComment, setNewComment] = useState("");

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      const createdComment = await postProductComment(id, newComment);

      setComments((prev) => [createdComment, ...prev]);
      setNewComment("");
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [productData, commentsData] = await Promise.all([
          getProduct(id),
          getProductComments(id),
        ]);
        setProduct(productData);
        setComments(commentsData.list);
      } catch (err) {
        if (err.message === "Unauthorized" && !hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          alert("로그인이 필요합니다.");
          router.replace("/login");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        로딩 중...
      </div>
    );
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <main className="withHeader px-4 xl:px-[200px] pb-20 pt-20 flex flex-col min-h-screen">
      {/* 상단 상품 정보 */}
      <div className="flex flex-col lg:flex-row gap-10 mb-2">
        {/* 왼쪽 상품 이미지 */}
        <div className="flex-shrink-0 w-[386px] h-[386px] overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={product.images[0] || test}
            alt={product.name}
            width={286}
            height={386}
            className="object-cover w-full h-full"
          />
        </div>

        {/* 오른쪽 상품 설명 */}
        <div className="flex flex-col flex-1 relative">
          {/* 메뉴 아이콘 */}
          <div className="absolute top-2 right-0">
            <Menubar
              onEdit={() => console.log("상품 수정")}
              onDelete={() => console.log("상품 삭제")}
            />
          </div>
          {/* 상품 제목, 가격, 소개, 태그 쭉 나오는 부분 */}
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {product.price.toLocaleString()}원
          </p>

          <div className="border-t border-gray-300 my-6" />

          <h2 className="text-lg font-semibold mb-2">상품 소개</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {product.description}
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-2">상품 태그</h2>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 작성자 + 좋아요 영역 (항상 이미지 하단에 고정) */}
          <div className="absolute bottom-0 right-1.5 flex items-center justify-between w-full mt-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Image src={userIcon} alt="User" width={24} height={24} />
              <span>총명한 판다</span>
              <span className="text-xs">
                {new Date(product.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>

            <FavoriteButton product={product} />
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <hr className="my-9 border-gray-300" />

      {/* 문의하기 (댓글) 영역 */}
      <div className="w-full">
        {/* 제목 */}
        <h2 className="text-lg font-semibold mb-2">문의하기</h2>

        {/* 안내 문구 textarea */}
        <div className="relative mb-2">
          <textarea
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm focus:outline-none resize-none "
            placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 삭제될 수 있으며,
          이에 대한 민형사상 책임은 게시자에게 있습니다."
          />
        </div>

        {/* 등록 버튼 (비활성화) */}
        <div className="flex justify-end mb-20">
          <button
            onClick={handleSubmitComment}
            className={`px-4 py-2 ${
              newComment.trim()
                ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                : "bg-gray-600 opacity-50 cursor-not-allowed"
            } text-white text-sm rounded-lg`}
            disabled={!newComment.trim()}
          >
            등록
          </button>
        </div>

        {/* 댓글 리스트 */}
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Image
              src={pandaQuestionImg}
              alt="문의 없음"
              width={120}
              height={120}
              className="mb-6"
            />
            <p className="text-sm text-gray-400">아직 문의가 없어요</p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {comments.map((comment) => (
              <li key={comment.id} className="py-4">
                {/* 첫 줄: content + 메뉴바 */}
                <div className="flex items-start justify-between">
                  <p className="text-gray-800 text-sm break-words">
                    {comment.content}
                  </p>
                  <Menubar
                    onEdit={() => console.log("댓글 수정")}
                    onDelete={() => console.log("댓글 삭제")}
                  />
                </div>

                {/* 두 번째 줄: 프로필, 닉네임, 시간 */}
                <div className="flex items-center gap-3 mt-5">
                  <Image
                    src={userIcon}
                    alt="프로필"
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-600">
                    {comment.writer.nickname}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>

                <div className="border-b border-gray-300 mt-4" />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 목록으로 돌아가기 버튼 */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => router.push("/market")}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-6 py-2 rounded-full"
        >
          목록으로 돌아가기
          <Image src={arrowLeftIcon} alt="back" width={16} height={16} />
        </button>
      </div>
    </main>
  );
}
