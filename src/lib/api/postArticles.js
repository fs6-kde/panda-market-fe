export async function postArticle({ title, content }) {
  const res = await fetch("http://localhost:3000/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) {
    throw new Error("게시글 등록 실패");
  }

  return res.json(); // 등록된 게시글 반환 (id 포함)
}
