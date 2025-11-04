import { tokenFetch } from "./fetchClient";

export const toggleFavorite = async (productId) => {
  try {
    const data = await tokenFetch(
      `/products/${productId}/favorite`,
      undefined,
      {
        method: "POST",
      }
    );
    return data;
  } catch (err) {
    throw new Error(err.message || "좋아요 처리 실패");
  }
};
