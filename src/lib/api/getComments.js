export async function getComments(articleId) {
  const res = await fetch(
    `http://localhost:3000/articles/${articleId}/comments`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("댓글 불러오기 실패");

  const { data } = await res.json();

  return Array.isArray(data) ? data : [];
}
