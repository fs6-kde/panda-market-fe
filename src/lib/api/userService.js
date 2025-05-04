import { tokenFetch } from "./fetchClient";

export const userService = {
  // 현재 유저 정보 조회
  getMe: () => tokenFetch("/users/me"),

  // 유저 정보 업데이트
  updateMe: (userData) =>
    tokenFetch("/user/me", {
      method: "PATCH",
      body: JSON.stringify(userData),
    }),

  //   // 사용자 링크 삭제
  //   deleteLink: (linkId) =>
  //     tokenFetch(`/users/me/links/${linkId}`, {
  //       method: "DELETE",
  //     }),
};
