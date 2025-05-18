export async function getProductComments(productId) {
  const res = await fetch(
    `http://localhost:3000/products/${productId}/comments?limit=5`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("댓글 조회 실패");
  }

  return res.json();
}
