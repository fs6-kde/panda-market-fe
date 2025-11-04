import { defaultFetch, tokenFetch } from "./fetchClient";

// 상품 목록 조회
export async function getProducts({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
} = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    orderBy,
  });

  return await defaultFetch(`/products?${query.toString()}`, {
    method: "GET",
  });
}

// 상품 상세 조회
export async function getProduct(id) {
  return await tokenFetch(`/products/${id}`, {
    method: "GET",
  });
}
