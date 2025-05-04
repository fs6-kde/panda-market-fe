export const postFavorite = async (productId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await fetch(
    `https://panda-market-api.vercel.app/products/${productId}/favorite`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "좋아요 등록 실패");
  }

  return res.json();
};
