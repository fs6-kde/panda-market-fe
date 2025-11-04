"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import arrowLeftIcon from "@/assests/arrow_back.svg";
import userIcon from "@/assests/user.svg";
import emptyCommentIcon from "@/assests/empty-comment.svg";
import { getArticle } from "@/lib/api/getArticles";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/lib/api/deleteArticle";
import { postComment } from "@/lib/api/postComment";
import { getComments } from "@/lib/api/getComments";
import { formatTimeAgo } from "@/lib/utils/timesAgo";
import { patchComment } from "@/lib/api/patchComment";
import { deleteComment } from "@/lib/api/deleteComment";
import { useAuth } from "@/providers/AuthProvider";
import Menubar from "@/components/ui/Menubar";

export default function ArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  // 댓글 등록 중
  const [isPostingComment, setIsPostingComment] = useState(false);

  // 댓글 입력 & 수정 상태
  const [comment, setComment] = useState("");
  const [placeholder, setPlaceholder] = useState("댓글을 입력해주세요.");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // 게시글 상세 조회
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await getArticle(id);
        setArticle(data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    })();
  }, [id]);

  // 댓글 불러오기 (id 기준)
  useEffect(() => {
    if (!id) return;
    (async () => {
      setIsLoadingComments(true);
      try {
        // 필요 시 limit 값 조정
        const res = await getComments(id, { limit: 50 });
        // 서버에서 최신순(desc)로 내려오므로 그대로 사용
        setComments(res.list ?? []);
      } catch (err) {
        console.error("댓글 조회 실패:", err);
      } finally {
        setIsLoadingComments(false);
      }
    })();
  }, [id]);

  // // 바깥 클릭 시 메뉴 닫기
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (
  //       articleMenuRef.current &&
  //       !articleMenuRef.current.contains(e.target)
  //     ) {
  //       setMenuOpen(false);
  //     }
  //     const isInsideAnyCommentMenu = Object.values(
  //       commentMenuRefs.current
  //     ).some((ref) => ref instanceof HTMLElement && ref.contains(e.target));
  //     if (!isInsideAnyCommentMenu) setOpenMenuId(null);
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // 댓글 등록 핸들러
  const handleCommentSubmit = async () => {
    if (!comment.trim() || isPostingComment) return;

    try {
      setIsPostingComment(true);
      const newComment = await postComment(id, comment.trim());
      // 최신순이므로 맨 앞에 추가
      setComments((prev) => [newComment, ...prev]);
      setComment(""); // 입력칸 초기화
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setIsPostingComment(false);
    }
  };

  // 상단: 게시글 수정/삭제 핸들러
  const handleEditArticle = () => {
    router.push(`/writes?id=${id}`);
  };

  const handleDeleteArticle = () => {
    // Menubar가 먼저 닫히도록 다음 태스크로 confirm 실행
    setTimeout(async () => {
      const ok = window.confirm("정말 삭제하시겠습니까?");
      if (!ok) return;
      try {
        const result = await deleteArticle(id);
        alert(result?.message ?? "삭제되었습니다.");
        router.push("/article");
      } catch (err) {
        console.error("삭제 실패:", err);
        alert("게시글 삭제에 실패했습니다.");
      }
    }, 0);
  };

  // 댓글: 수정 열기/취소/저장
  const startEdit = (c) => {
    setEditingCommentId(c.id);
    setEditedContent(c.content);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const saveEdit = async (commentId) => {
    if (!editedContent.trim()) return;
    try {
      setIsSavingEdit(true);
      const updated = await patchComment(commentId, editedContent.trim());
      setComments((prev) =>
        prev.map((item) =>
          item.id === commentId ? { ...item, content: updated.content } : item
        )
      );
      setEditingCommentId(null);
      setEditedContent("");
    } catch (err) {
      alert("댓글 수정 실패");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // 댓글 삭제
  const handleDeleteOneComment = (commentId) => {
    // Menubar가 먼저 닫히도록 다음 태스크로 confirm 실행
    setTimeout(async () => {
      const ok = window.confirm("정말 삭제하시겠습니까?");
      if (!ok) return;
      try {
        await deleteComment(commentId);
        alert("삭제되었습니다.");
        setComments((prev) => prev.filter((item) => item.id !== commentId));
      } catch (err) {
        alert("댓글 삭제 실패");
      }
    }, 0);
  };

  if (!article)
    return (
      <p className="flex justify-center items-center min-h-screen">
        로딩 중...
      </p>
    );

  // 권한 판별
  // 서버 스키마에 따라 article.authorId 또는 article.author?.id 둘 다 대응
  const articleAuthorId = article.authorId ?? article.author?.id;
  const isArticleOwner = !!user && articleAuthorId === user.id;

  // 좋아요 랜덤 임시값
  const likeCount = 0;
  const authorName = article?.author?.nickName ?? "총명한 판다";
  const createdAtText = article?.createdAt
    ? new Date(article.createdAt).toLocaleDateString("ko-KR")
    : "";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-3xl space-y-6 mt-10">
        {/* 게시글 헤더 */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-lg font-semibold max-w-[90%]">
              {article.title}
            </h1>

            <Menubar
              canManage={isArticleOwner}
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
              onReport={() => alert("신고 접수 화면으로 이동합니다.")}
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Image
                src={userIcon}
                alt="user"
                width={24}
                height={24}
                className="rounded-full"
              />
              {authorName}
            </div>
            <span>{createdAtText}</span>
            <span className="text-2xl text-gray-200">|</span>
            <div className="flex items-center gap-1">
              <Heart className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600">{likeCount}</span>
            </div>
          </div>
        </div>
        {/* 게시글 본문 */}
        <div className="text-sm text-gray-800">{article.content}</div>

        {/* 댓글 입력 */}
        <div className="mt-8">
          <label className="block font-semibold text-sm mb-2">댓글달기</label>
          <textarea
            rows="4"
            placeholder={placeholder}
            onFocus={() => setPlaceholder("")}
            onBlur={() => setPlaceholder("댓글을 입력해주세요.")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              disabled={comment.trim() === "" || isPostingComment}
              onClick={handleCommentSubmit}
              className={`px-3.5 py-1.5 rounded-md text-sm text-white ${
                comment.trim() === "" || isPostingComment
                  ? "bg-gray-600 opacity-50 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 cursor-pointer transition-all duration-200 ease-in-out"
              }`}
            >
              {isPostingComment ? "등록 중..." : "등록"}
            </button>
          </div>
        </div>

        {/* 댓글 출력 */}
        {isLoadingComments ? (
          <p className="text-sm text-gray-400 text-center mt-6">
            댓글 불러오는 중...
          </p>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-12 text-gray-400">
            <Image
              src={emptyCommentIcon}
              alt="댓글 없음"
              width={120}
              height={120}
            />
            <p className="mt-2 text-sm">
              아직 댓글이 없어요,
              <br />
              지금 댓글을 달아보세요!
            </p>
          </div>
        ) : (
          <ul className="space-y-4 mt-8">
            {comments.map((c) => {
              const isEditing = editingCommentId === c.id;

              // 내가 쓴 댓글 판별 (userId 우선, 없으면 writer.id)
              const commentAuthorId = c.userId ?? c.writer?.id;
              const isMyComment = !!user && commentAuthorId === user.id;

              return (
                <li
                  key={c.id}
                  className="p-4 rounded-xl bg-[#f9fafb] shadow-sm flex flex-col justify-between"
                >
                  {/* content + 메뉴바 */}
                  {isEditing ? (
                    <div className="mb-4">
                      <textarea
                        rows="3"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-between mb-4">
                      <div className="text-sm text-gray-800 ml-0.5">
                        {c.content}
                      </div>

                      <Menubar
                        canManage={isMyComment}
                        onEdit={() => startEdit(c)}
                        onDelete={() => handleDeleteOneComment(c.id)}
                        onReport={() => alert("신고 접수 화면으로 이동합니다.")}
                      />
                    </div>
                  )}

                  {/* 유저 정보 + 버튼 */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <Image
                        src={userIcon}
                        alt="user"
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-gray-800">
                          {c?.writer?.nickName ?? "똑똑한판다"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(c.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* 수정할 때 나타나는 버튼 */}
                    {isEditing && (
                      <div className="flex gap-2">
                        <button
                          className="text-sm text-gray-500 hover:underline"
                          onClick={cancelEdit}
                          disabled={isSavingEdit}
                        >
                          취소
                        </button>
                        <button
                          className={`text-sm px-3 py-1.5 rounded-md text-white ${
                            !editedContent.trim() || isSavingEdit
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                          disabled={!editedContent.trim() || isSavingEdit}
                          onClick={() => saveEdit(c.id)}
                        >
                          {isSavingEdit ? "수정 중..." : "수정"}
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* 목록으로 돌아가기 */}
        <div className="flex justify-center mt-8">
          <Link href="/article">
            <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-6 py-2 rounded-full">
              <Image src={arrowLeftIcon} alt="back" width={16} height={16} />
              목록으로 돌아가기
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
