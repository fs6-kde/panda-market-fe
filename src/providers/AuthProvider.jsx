"use client";

import { authService } from "@/lib/api/authService";
import { userService } from "@/lib/api/userService";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  register: () => {},
  updateUser: () => {},
  user: null,
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

  const getUser = async () => {
    try {
      const userData = await userService.getMe();
      setUser(userData);
    } catch (error) {
      console.error("사용자 정보를 가져오는데 실패했습니다:", error);
      setUser(null);
    }
  };

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUser(userData);
  };

  const register = async (nickname, email, password) => {
    await authService.register(nickname, email, password);
    await login(email, password); // 회원가입 후 자동 로그인
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async (updated) => {
    try {
      const updatedUser = await userService.updateMe(updated);
      setUser(updatedUser);
    } catch (error) {
      console.error("사용자 정보 업데이트 실패:", error);
    }
  };

  useEffect(() => {
    getUser(); // 페이지 새로고침 시 사용자 정보 재확인
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
