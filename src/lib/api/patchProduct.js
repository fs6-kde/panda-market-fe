export async function patchProduct(productId, productData) {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description);
  formData.append("price", productData.price);
  formData.append("tags", JSON.stringify(productData.tags));

  // 새 이미지가 있는 경우만 추가
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  // 기존 이미지 경로들 추가
  if (productData.existingImages?.length > 0) {
    productData.existingImages.forEach((url) => {
      formData.append("existingImages", url); // 같은 이름으로 여러 개 append 가능
    });
  }

  const res = await fetch(`http://localhost:3000/products/${productId}`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "상품 수정에 실패했습니다.");
  }

  return res.json();
}
