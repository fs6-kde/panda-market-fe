export async function postProduct(productData) {
  const formData = new FormData();

  // 문자열 필드 추가
  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("tags", JSON.stringify(productData.tags)); // 배열은 문자열로 변환

  // 이미지 파일들 추가
  productData.images.forEach((file) => {
    formData.append("images", file);
  });

  const res = await fetch("http://localhost:3000/products", {
    method: "POST",
    body: formData,
    credentials: "include", // 쿠키 기반 인증을 위해
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "상품 등록 실패");
  }

  return res.json(); // 등록된 상품 객체 반환
}
