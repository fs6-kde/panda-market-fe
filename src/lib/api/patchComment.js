import { tokenFetch } from "./fetchClient";

// 게시글 댓글 수정
export async function patchComment(commentId, content) {
  return await tokenFetch(`/article/comments/${commentId}`, undefined, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });
}
