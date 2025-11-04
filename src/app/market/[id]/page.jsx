"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "@/lib/api/getProducts";
import Image from "next/image";
import test from "../../../../public/test.svg";
import userIcon from "@/assests/user.svg";
import arrowLeftIcon from "@/assests/arrow_back.svg";
import pandaQuestionImg from "@/assests/panda-question.svg";
import { getProductComments } from "@/lib/api/getProductComments";
import { postProductComment } from "@/lib/api/postProductComment";
import Menubar from "@/components/ui/Menubar";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { deleteProduct } from "@/lib/api/deleteProduct";
import { patchProductComment } from "@/lib/api/patchProductComment";
import { deleteProductComment } from "@/lib/api/deleteProductComment";
import { useAuth } from "@/providers/AuthProvider";

const S3_ORIGIN = process.env.NEXT_PUBLIC_S3_ORIGIN ?? "";
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "";

// 이미지 경로를 안전하게 절대 URL로 변환
function toImageUrl(key) {
  if (!key) return test.src;
  if (/^https?:\/\//i.test(key)) return key;
  if (key.startsWith("/")) return `${API_ORIGIN}${key}`;

  return `${S3_ORIGIN}/${key}`;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [placeholder, setPlaceholder] = useState(
    "개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
  );
  const [loading, setLoading] = useState(true);
  const hasRedirectedRef = useRef(false);

  const [newComment, setNewComment] = useState("");
  // 댓글 등록 중
  const [isPostingComment, setIsPostingComment] = useState(false);

  // 댓글 수정
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // 댓글 삭제 진행 중 표시 (특정 댓글만)
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  // 댓글 등록 함수
  const handleSubmitComment = async () => {
    if (!newComment.trim() || isPostingComment) {
      if (!newComment.trim()) alert("댓글을 입력해주세요.");
      return;
    }

    try {
      setIsPostingComment(true);
      const createdComment = await postProductComment(id, newComment.trim());
      setComments((prev) => [createdComment, ...prev]);
      setNewComment("");
    } catch (err) {
      alert(err.message || "댓글 등록에 실패했습니다.");
    } finally {
      setIsPostingComment(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [productData, commentsData] = await Promise.all([
          getProduct(Number(id)),
          getProductComments(Number(id)),
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
  }, [id, router]);

  // 삭제 핸들러 함수
  const handleDeleteProduct = async () => {
    const confirmDelete = confirm("정말 이 상품을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(product.id);
      alert("상품이 삭제되었습니다");
      router.push("/market");
    } catch (err) {
      alert(err.message);
    }
  };

  // 수정페이지 이동
  const handleEdit = () => {
    router.push(`/market/${product.id}/edit`);
  };

  // 댓글 수정 열기
  const startEdit = (c) => {
    setEditingCommentId(c.id);
    setEditDraft(c.content);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditDraft("");
  };

  // 수정 완료
  const saveEdit = async (id) => {
    if (!editDraft.trim()) return;
    try {
      setIsSavingEdit(true);
      const updated = await patchProductComment(id, editDraft.trim());
      // 성공 시 목록 반영
      setComments((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                content: updated.content,
                updatedAt: updated.updatedAt,
              }
            : item
        )
      );
      setEditingCommentId(null);
      setEditDraft("");
    } catch (err) {
      alert(err.message || "댓글 수정에 실패했습니다.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // 댓글 삭제 (메뉴 먼저 닫히게 confirm을 다음 태스크로 미룸)
  const handleDeleteComment = (id) => {
    // 이미 삭제 진행 중이면 무시 (중복 클릭 방지)
    if (deletingCommentId) return;

    // Menubar가 먼저 닫힐 수 있도록 다음 이벤트 루프로 미룸
    setTimeout(async () => {
      const ok = window.confirm("정말 이 댓글을 삭제하시겠습니까?");
      if (!ok) return;

      try {
        setDeletingCommentId(id);
        await deleteProductComment(id);
        setComments((prev) => prev.filter((item) => item.id !== id));
        alert("댓글이 삭제되었습니다.");
      } catch (err) {
        alert(err?.message || "댓글 삭제에 실패했습니다.");
      } finally {
        setDeletingCommentId(null);
      }
    }, 0);
  };

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

  const src = toImageUrl(product.images?.[0]);

  // 본인이 등록한 건지 판단
  const isProductOwner = !!user && product?.ownerId === user.id;

  return (
    <main className="withHeader px-4 xl:px-[200px] pb-20 pt-20 flex flex-col min-h-screen">
      {/* 상단 상품 정보 */}
      <div className="flex flex-col lg:flex-row gap-10 mb-2">
        {/* 왼쪽 상품 이미지 */}
        <div className="flex-shrink-0 w-[436px] h-[436px] overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center">
          {src === test.src ? (
            // 기본 이미지일 경우: 가운데에 작게 표시
            <Image
              src={test}
              alt="기본 이미지"
              width={120}
              height={120}
              className="object-contain opacity-90"
            />
          ) : (
            // 실제 업로드 이미지일 경우: 꽉 채우기
            <Image
              src={src}
              alt={product.name}
              width={436}
              height={436}
              className="object-cover w-full h-full"
            />
          )}
        </div>

        {/* 오른쪽 상품 설명 */}
        <div className="flex flex-col flex-1 justify-between min-h-[386px]">
          {/* 상단: 메뉴 + 제목 + 설명 + 태그 */}
          <div className="relative">
            {/* 메뉴 아이콘 */}
            <div className="absolute top-2 right-0">
              <Menubar
                canManage={isProductOwner}
                onEdit={handleEdit}
                onDelete={handleDeleteProduct}
                onReport={() => alert("신고 접수 화면으로 이동")}
              />
            </div>

            <h1 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h1>
            <p className="text-4xl font-bold text-gray-800 mt-4">
              {product.price.toLocaleString()}원
            </p>

            <div className="border-t border-gray-300 my-6" />

            <h2 className="text-sm text-gray-600 font-semibold mb-3">
              상품 소개
            </h2>
            <p className="text-gray-600 whitespace-pre-line text-sm min-h-[90px]">
              {product.description}
            </p>

            <h2 className="text-sm text-gray-600 font-semibold mt-5 mb-2">
              상품 태그
            </h2>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                  # {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 하단: 작성자 + 좋아요 */}
          <div className="flex items-center justify-between mt-10">
            {/* 작성자 영역 */}
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <Image
                src={userIcon}
                alt="User"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col justify-center gap-2">
                <span className="text-xs text-gray-700 font-medium">
                  {product.ownerNickname}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(product.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </div>

            {/* 좋아요 영역 + 세로선 포함 */}
            <div className="flex items-center gap-4">
              <div className="w-px h-9 bg-gray-200" />
              <FavoriteButton product={product} />
            </div>
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
            placeholder={placeholder}
            onFocus={() => setPlaceholder("")}
            onBlur={() =>
              setPlaceholder(
                "개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
              )
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none "
          />
        </div>

        {/* 등록 버튼 (비활성화) */}
        <div className="flex justify-end mb-20">
          <button
            onClick={handleSubmitComment}
            className={`px-3.5 py-1.5 ${
              newComment.trim() && !isPostingComment
                ? "bg-blue-500 hover:bg-blue-600 cursor-pointer transition-all duration-200 ease-in-out"
                : "bg-gray-600 opacity-50 cursor-not-allowed"
            } text-white text-sm rounded-md`}
            disabled={!newComment.trim() || isPostingComment}
          >
            {isPostingComment ? "등록 중..." : "등록"}
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
            {comments.map((comment) => {
              const isEditing = editingCommentId === comment.id;
              const isDeleting = deletingCommentId === comment.id;

              // 내가 쓴 댓글인지 판단 (userId 우선, 없으면 writer.id)
              const commentAuthorId = comment.userId ?? comment.writer?.id;
              const isMyComment = !!user && commentAuthorId === user.id;

              return (
                <li key={comment.id} className="py-4">
                  {/* 첫 줄: content + 메뉴바 */}
                  <div className="flex items-start justify-between">
                    {/* 내용 or 수정 에디터 */}
                    {isEditing ? (
                      <div className="w-full">
                        <textarea
                          rows={3}
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="수정할 내용을 입력하세요"
                        />
                        <div className="mt-3 flex justify-end gap-3">
                          <button
                            onClick={cancelEdit}
                            disabled={isSavingEdit}
                            className="px-4 py-2 text-sm text-gray-600 hover:underline"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => saveEdit(comment.id)}
                            disabled={!editDraft.trim() || isSavingEdit}
                            className={`px-4 py-2 rounded-lg text-sm text-white ${
                              !editDraft.trim() || isSavingEdit
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                            }`}
                          >
                            {isSavingEdit ? "수정 중..." : "수정"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-800 text-sm break-words pr-3">
                        {comment.content}
                      </p>
                    )}

                    {/* 메뉴바 (수정/삭제 버튼) */}
                    {!isEditing && (
                      <Menubar
                        disabled={isEditing || isDeleting}
                        canManage={isMyComment}
                        onEdit={() => startEdit(comment)}
                        onDelete={() => handleDeleteComment(comment.id)}
                        onReport={() => alert("신고 접수 화면으로 이동")}
                      />
                    )}
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
                      {comment.writer.nickName}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>

                  <div className="border-b border-gray-300 mt-4" />
                </li>
              );
            })}
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
