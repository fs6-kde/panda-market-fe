import { tokenFetch } from "./fetchClient";

export async function deleteArticle(id) {
  return await tokenFetch(`/articles/${id}`, undefined, {
    method: "DELETE",
    credentials: "include",
  });
}
