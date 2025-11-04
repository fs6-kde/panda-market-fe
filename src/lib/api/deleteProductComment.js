import { tokenFetch } from "./fetchClient";

// 상품 댓글 삭제
export async function deleteProductComment(commentId) {
  return await tokenFetch(`/product/comments/${commentId}`, undefined, {
    method: "DELETE",
  });
}
