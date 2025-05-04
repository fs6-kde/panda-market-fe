// lib/api/uploadImage.js

export const uploadImage = async (file) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    "https://panda-market-api.vercel.app/images/upload",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "이미지 업로드 실패");
  }

  return data.url; // 업로드된 이미지 URL 반환
};
