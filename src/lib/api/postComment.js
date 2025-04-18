export async function postComment(articleId, content) {
  const res = await fetch(
    `http://localhost:3000/articles/${articleId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!res.ok) throw new Error("댓글 등록 실패");

  return res.json();
}
