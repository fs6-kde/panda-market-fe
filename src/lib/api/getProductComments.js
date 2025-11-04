import { tokenFetch } from "./fetchClient";

// 리밋, 커서 쿼리 스트링 있으나 프론트엔 설정 안해놓음
export async function getProductComments(productId) {
  return await tokenFetch(`/product/${productId}/comments`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
}
