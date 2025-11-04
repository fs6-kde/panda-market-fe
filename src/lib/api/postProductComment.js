import { tokenFetch } from "./fetchClient";

export const postProductComment = async (productId, content) => {
  return await tokenFetch(`/product/${productId}/comments`, undefined, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ content }),
  });
};
