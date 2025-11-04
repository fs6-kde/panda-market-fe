import { defaultFetch } from "./fetchClient";

/**
 * 게시글 전체 조회
 */
export async function getArticles({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
} = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    orderBy,
  });

  return await defaultFetch(`/articles?${query.toString()}`, {
    method: "GET",
  });
}

// 게시글 상세 조회
export async function getArticle(id) {
  return await defaultFetch(`/articles/${id}`, {
    method: "GET",
  });
}
