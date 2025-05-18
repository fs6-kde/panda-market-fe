export async function deleteProduct(productId) {
  const res = await fetch(`http://localhost:3000/products/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "상품 삭제에 실패했습니다.");
  }

  return res.json();
}
