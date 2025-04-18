"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import arrowLeftIcon from "@/assests/arrow_back.svg";
import userIcon from "@/assests/user.svg";
import emptyCommentIcon from "@/assests/empty-comment.svg";
import menuIcon from "@/assests/menu.svg";
import { getArticle } from "@/lib/api/getArticles";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/lib/api/deleteArticle";
import { postComment } from "@/lib/api/postComment";
import { getComments } from "@/lib/api/getComments";
import { formatTimeAgo } from "@/lib/utils/timesAgo";
import { patchComment } from "@/lib/api/patchComment";
import { deleteComment } from "@/lib/api/deleteComment";

export default function ArticlePage({ articleId }) {
  const [comment, setComment] = useState("");
  const [placeholder, setPlaceholder] = useState("댓글을 입력해주세요.");
  const [menuOpen, setMenuOpen] = useState(false);
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const menuRef = useRef({}); // 바깥 클릭해도 닫히게
  const [openMenuId, setOpenMenuId] = useState(null);

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // 수정 중인 댓글, 입력값 관리
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(id);
        setArticle(data);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(id);
        setComments(data);
      } catch (err) {
        console.error("댓글 조회 실패:", err);
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [articleId]);

  // 댓글 등록 핸들러
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    try {
      const newComment = await postComment(id, comment);
      setComments((prev) => [...prev, newComment]); // 목록에 추가
      setComment(""); // 입력칸 초기화
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      for (const ref of Object.values(menuRef.current)) {
        if (ref instanceof HTMLElement && ref.contains(e.target)) {
          return;
        }
      }

      // 외부 클릭: 메뉴 닫기
      // 이 부분 변수 중복이므로 하나로 통일
      setOpenMenuId(null);
      setMenuOpen(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!article) return <p className="mt-20 text-center">로딩 중...</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-3xl space-y-6 mt-10">
        {/* 게시글 헤더 */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-lg font-semibold max-w-[90%]">
              {article.title}
            </h1>
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen((prev) => !prev)}>
                <Image src={menuIcon} alt="menu" width={3} height={3} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 z-10">
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-50 text-left"
                    onClick={() => {
                      router.push(`/writes?id=${id}`);
                    }}
                  >
                    수정하기
                  </button>
                  <div className="border-t border-gray-200" />
                  <button
                    className="w-full px-4 py-2 hover:bg-gray-50 text-left"
                    onClick={async () => {
                      const confirmDelete = confirm("정말 삭제하시겠습니까?");
                      if (!confirmDelete) return;

                      try {
                        await deleteArticle(id);
                        alert("해당 게시글이 삭제되었습니다.");
                        router.push("/article");
                      } catch (err) {
                        console.error("삭제 실패:", err);
                        alert("게시글 삭제에 실패했습니다.");
                      } finally {
                        setMenuOpen(null);
                      }
                    }}
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
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
              총명한 판다
            </div>
            <span>
              {new Date(article.createdAt).toLocaleDateString("ko-KR")}
            </span>
            <span className="text-2xl text-gray-200">|</span>
            <div className="flex items-center gap-1">
              <Heart className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600">0</span>
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
              disabled={comment.trim() === ""}
              onClick={handleCommentSubmit}
              className={`px-4 py-1.5 rounded-md text-sm text-white ${
                comment.trim() === ""
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              등록
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
            {comments
              .slice()
              .reverse()
              .map((c) => {
                const isEditing = editingCommentId === c.id;
                const isMenuOpen = openMenuId === c.id;

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
                          className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-sm text-gray-800">{c.content}</div>
                        <div
                          className="relative"
                          ref={(el) => {
                            if (el) menuRef.current[c.id] = el;
                          }}
                        >
                          <button onClick={() => setOpenMenuId(c.id)}>
                            <Image
                              src={menuIcon}
                              alt="menu"
                              width={3}
                              height={3}
                            />
                          </button>
                          {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 z-10">
                              <button
                                className="w-full px-4 py-2 hover:bg-gray-50 text-left"
                                onClick={() => {
                                  setEditingCommentId(c.id);
                                  setEditedContent(c.content);
                                  setOpenMenuId(null);
                                }}
                              >
                                수정하기
                              </button>
                              <div className="border-t border-gray-200" />
                              {/* 삭제하기 */}
                              <button
                                className="w-full px-4 py-2 hover:bg-gray-50 text-left"
                                onClick={async () => {
                                  const confirmDelete =
                                    confirm("정말 삭제하시겠습니까?");
                                  if (!confirmDelete) return;

                                  try {
                                    await deleteComment(c.id);
                                    alert("삭제되었습니다.");
                                    setComments((prev) =>
                                      prev.filter((item) => item.id !== c.id)
                                    );
                                  } catch (err) {
                                    alert("댓글 삭제 실패");
                                  } finally {
                                    setOpenMenuId(null); // 메뉴 닫기
                                  }
                                }}
                              >
                                삭제하기
                              </button>
                            </div>
                          )}
                        </div>
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
                          <span className="font-light text-xs text-gray-800">
                            똑똑한판다
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {formatTimeAgo(c.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* 수정하기 */}
                      {isEditing && (
                        <div className="flex gap-2">
                          <button
                            className="text-sm text-gray-500 hover:underline"
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditedContent("");
                            }}
                          >
                            취소
                          </button>
                          <button
                            className={`text-sm px-3 py-1.5 rounded-md text-white ${
                              editedContent.trim()
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-300 cursor-not-allowed"
                            }`}
                            disabled={!editedContent.trim()}
                            onClick={async () => {
                              try {
                                const updated = await patchComment(
                                  c.id,
                                  editedContent.trim()
                                );
                                setComments((prev) =>
                                  prev.map((item) =>
                                    item.id === c.id
                                      ? { ...item, content: updated.content }
                                      : item
                                  )
                                );
                                setEditingCommentId(null);
                                setEditedContent("");
                              } catch (err) {
                                alert("댓글 수정 실패");
                              }
                            }}
                          >
                            수정완료
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
