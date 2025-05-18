"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/lib/api/authService";
import { userService } from "@/lib/api/userService";

const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  register: () => {},
  updateUser: () => {},
  user: null,
  accessToken: null,
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
  const [accessToken, setAccessToken] = useState(null);

  const login = async (email, password) => {
    const { accessToken, user } = await authService.login(email, password);
    setAccessToken(accessToken);
    setUser(user);
  };

  const register = async (nickName, email, password) => {
    await authService.register(nickName, email, password);
    await login(email, password); // 자동 로그인
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  const getUser = async (token) => {
    try {
      const userData = await userService.getMe(token);
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

  const updateUser = async (updated) => {
    try {
      const updatedUser = await userService.updateMe(accessToken, updated);
      setUser(updatedUser);
    } catch (error) {
      console.error("사용자 정보 업데이트 실패:", error);
    }
  };

  useEffect(() => {
    // 새로고침 시 accessToken 재발급 시도 → 유저 정보 fetch
    (async () => {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        await getUser(newAccessToken);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, register, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
