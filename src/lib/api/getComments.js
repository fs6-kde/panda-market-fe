import { defaultFetch } from "./fetchClient";

// 게시글 댓글 조회
export async function getComments(
  articleId,
  { limit = 5, cursor = null } = {}
) {
  const query = new URLSearchParams();
  query.append("limit", String(limit));
  if (cursor) query.append("cursor", String(cursor));

  return await defaultFetch(
    `/article/${articleId}/comments?${query.toString()}`,
    {
      method: "GET",
    }
  );
}
