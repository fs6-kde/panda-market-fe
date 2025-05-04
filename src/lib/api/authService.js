import { defaultFetch } from "./fetchClient";

export const authService = {
  login: async (email, password) => {
    const data = await defaultFetch("/auth/signIn", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("accessToken", data.accessToken);
    return data.user;
  },

  register: async (nickname, email, password) => {
    return await defaultFetch("/auth/signUp", {
      method: "POST",
      body: JSON.stringify({
        nickname,
        email,
        password,
        passwordConfirmation: password,
      }),
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
  },
};
