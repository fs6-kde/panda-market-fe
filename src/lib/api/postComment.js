import { tokenFetch } from "./fetchClient";

// 게시글 댓글 등록
export async function postComment(articleId, content) {
  return await tokenFetch(`/article/${articleId}/comments`, undefined, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
