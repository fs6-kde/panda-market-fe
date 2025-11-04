import { tokenFetch } from "./fetchClient";

export const userService = {
  getMe: () => tokenFetch("/users/me"),

  updateMe: (userData) =>
    tokenFetch("/users/me", undefined, {
      method: "PATCH",
      body: JSON.stringify(userData),
    }),
};

//   // 사용자 링크 삭제
//   deleteLink: (linkId) =>
//     tokenFetch(`/users/me/links/${linkId}`, {
//       method: "DELETE",
//     }),
