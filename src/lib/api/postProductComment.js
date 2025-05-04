export const postProductComment = async (productId, content) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("권한이 없습니다. 로그인 해주세요.");
  }

  const response = await fetch(
    `https://panda-market-api.vercel.app/products/${productId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "댓글 등록 실패");
  }

  const data = await response.json();
  return data;
};
