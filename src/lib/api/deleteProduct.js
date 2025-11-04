import { tokenFetch } from "./fetchClient";

export async function deleteProduct(productId) {
  return tokenFetch(`/products/${productId}`, undefined, {
    method: "DELETE",
    credentials: "include",
  });
}
