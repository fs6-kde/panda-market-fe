import { defaultFetch, setAccessToken } from "./fetchClient";
import { userService } from "./userService";

export const authService = {
  login: async (email, password) => {
    const data = await defaultFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!data.accessToken) {
      throw new Error("로그인 응답에 accessToken이 없습니다.");
    }

    // 전역 accessToken 설정
    setAccessToken(data.accessToken);

    // 로그인 후 유저 정보 다시 fetch (서버에서 최신 상태 보장)
    const user = await userService.getMe();

    return {
      user,
    };
  },

  register: async (nickName, email, password) => {
    return await defaultFetch("/users", {
      method: "POST",
      body: JSON.stringify({ email, nickName, password }),
    });
  },

  // 로그아웃: 서버 세션(리프레시 쿠키 & DB 토큰) + 클라이언트 accessToken 모두 정리
  logout: async () => {
    try {
      await defaultFetch("/logout", {
        method: "POST",
        // refreshToken 쿠키를 서버로 보내기 위해 반드시 include
      });
    } catch (err) {
      // 토큰 만료 등으로 401이어도 클라이언트 쪽 토큰은 지워줌
      console.warn("logout request failed (ignored):", err);
    } finally {
      // 클라이언트의 전역 accessToken 제거
      setAccessToken(null);
    }
  },
};
