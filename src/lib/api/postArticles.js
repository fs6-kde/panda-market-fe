import { tokenFetch } from "./fetchClient";

// 게시글 등록
export async function postArticle({ title, content }) {
  return await tokenFetch("/articles", undefined, {
    method: "POST",
    body: JSON.stringify({ title, content }),
  });
}
