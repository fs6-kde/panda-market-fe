import { tokenFetch } from "./fetchClient";

// 게시글 댓글 삭제
export async function deleteComment(commentId) {
  return await tokenFetch(`/article/comments/${commentId}`, undefined, {
    method: "DELETE",
  });
}
