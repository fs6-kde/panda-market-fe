export async function getProductComments(productId) {
  const res = await fetch(
    `https://panda-market-api.vercel.app/products/${productId}/comments?limit=5`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("댓글 조회 실패");
  }

  return res.json();
}
