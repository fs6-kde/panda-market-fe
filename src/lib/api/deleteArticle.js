export async function deleteArticle(id) {
  const res = await fetch(`http://localhost:3000/articles/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("게시글 삭제 실패");
  }

  return res.json(); // 삭제 성공 시 응답 객체
}
