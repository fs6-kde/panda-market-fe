import { tokenFetch } from "./fetchClient";

export async function patchArticle(id, { title, content }) {
  return await tokenFetch(`/articles/${id}`, undefined, {
    method: "PATCH",
    body: JSON.stringify({ title, content }),
    credentials: "include",
  });
}
