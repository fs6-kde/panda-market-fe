"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/lib/api/authService";
import { userService } from "@/lib/api/userService";
import { setAccessToken as setGlobalAccessToken } from "@/lib/api/fetchClient";

const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  register: () => {},
  updateUser: () => {},
  user: null,
  isLoading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    const { user } = await authService.login(email, password);
    setUser(user);
  };

  const register = async (nickName, email, password) => {
    await authService.register(nickName, email, password);
    await login(email, password); // 자동 로그인
  };

  const logout = async () => {
    try {
      const res = await authService.logout(); // /logout POST + refresh 쿠키 삭제 + DB refreshToken null
      return res?.message;
    } catch (e) {
      // 실패해도 클라이언트 상태는 반드시 정리
      console.warn("logout request failed (ignored):", e);
      return undefined;
    } finally {
      setUser(null);
      setGlobalAccessToken(null);
    }
  };

  const getUser = async () => {
    try {
      const userData = await userService.getMe();
      setUser(userData);
    } catch (error) {
      console.error("사용자 정보를 가져오는데 실패했습니다:", error);
      setUser(null);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/token/refresh`,
        {
          method: "POST",
          credentials: "include", // 쿠키 전송
        }
      );
      if (!res.ok) throw new Error("토큰 갱신 실패");

      const data = await res.json();
      return data.accessToken;
    } catch (err) {
      console.warn("자동 토큰 갱신 실패:", err);
      return null;
    }
  };

  useEffect(() => {
    // 새로고침 시 accessToken 재발급 시도 → 유저 정보 fetch
    (async () => {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        setGlobalAccessToken(newAccessToken);
        await getUser();
      } else {
        console.warn(" [Auth] No token received from refresh.");
      }
      setIsLoading(false);
    })();
  }, []);

  const updateUser = async (updated) => {
    try {
      const updatedUser = await userService.updateMe(updated);
      setUser(updatedUser);
    } catch (error) {
      console.error("사용자 정보 업데이트 실패:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
