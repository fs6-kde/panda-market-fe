export const postProductComment = async (productId, content) => {
  const response = await fetch(
    `http://localhost:3000/products/${productId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키 기반 인증
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "댓글 등록 실패");
  }

  const data = await response.json();
  return data;
};
