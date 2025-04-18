export async function patchArticle(id, { title, content }) {
  const res = await fetch(`http://localhost:3000/articles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) {
    throw new Error("게시글 수정 실패");
  }

  return res.json();
}
