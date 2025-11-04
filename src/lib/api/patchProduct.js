import { getAccessToken, setAccessToken } from "./fetchClient";

export async function patchProduct(productId, productData) {
  const formData = new FormData();

  formData.append("name", productData.name ?? "");
  formData.append("description", productData.description ?? "");
  formData.append("price", String(productData.price ?? ""));

  formData.append("tags", JSON.stringify(productData.tags ?? []));

  // 새 이미지
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((url) => {
      formData.append("newImagePaths", url);
    });
  }

  // 기존 이미지
  if (productData.existingImages?.length > 0) {
    productData.existingImages.forEach((url) => {
      formData.append("existingImages", url);
    });
  }

  // 현재 accessToken 가져오기
  let token = getAccessToken();

  // accessToken이 없으면 refresh 시도
  if (!token) {
    const refreshRes = await fetch("http://localhost:3000/token/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      token = data.accessToken;
      setAccessToken(token);
    } else {
      throw new Error("자동 로그인 실패. 다시 로그인해주세요.");
    }
  }

  const res = await fetch(`http://localhost:3000/products/${productId}`, {
    method: "PATCH",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "상품 수정에 실패했습니다.");
  }

  return res.json();
}
