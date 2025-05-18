import { defaultFetch } from "./fetchClient";

export const authService = {
  login: async (email, password) => {
    const data = await defaultFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return {
      accessToken: data.accessToken,
      user: {
        id: data.id,
        email: data.email,
        nickName: data.nickName,
      },
    };
  },

  register: async (nickName, email, password) => {
    return await defaultFetch("/users", {
      method: "POST",
      body: JSON.stringify({ email, nickName, password }),
    });
  },

  logout: () => {
    // 추후 구현 예정
  },
};
