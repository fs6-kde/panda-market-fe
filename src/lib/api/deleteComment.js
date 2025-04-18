export async function deleteComment(commentId) {
  const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("댓글 삭제 실패");
  }

  return;
}
