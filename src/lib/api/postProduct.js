import { tokenFetch } from "./fetchClient";

export async function postProduct(productData) {
  // 1: 이미지 업로드
  const uploadedUrls = await Promise.all(
    productData.images.map(async (file) => {
      const formData = new FormData();
      formData.append("images", file); // 'image' 필드명은 서버와 일치

      // 이 부분 서버쪽 보면서 알아보기
      const uploadRes = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!uploadRes.ok) {
        const error = await uploadRes.json().catch(() => ({}));
        throw new Error(error.message || "이미지 업로드 실패");
      }

      const { url } = await uploadRes.json();
      return url;
    })
  );

  // 2: 상품 등록
  const payload = {
    name: productData.name,
    description: productData.description,
    price: productData.price,
    tags: productData.tags,
    images: uploadedUrls,
  };

  return await tokenFetch("/products", undefined, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
