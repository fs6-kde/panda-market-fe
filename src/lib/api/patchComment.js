export async function patchComment(commentId, content) {
  const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error("댓글 수정 실패");
  }

  const data = await res.json();
  return data;
}
