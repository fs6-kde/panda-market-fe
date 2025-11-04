import { tokenFetch } from "./fetchClient";

// 상품 댓글 수정
export async function patchProductComment(commentId, content) {
  return await tokenFetch(`/product/comments/${commentId}`, undefined, {
    method: "PATCH",
    body: JSON.stringify({ content }),
  });
}
