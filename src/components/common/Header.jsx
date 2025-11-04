"use client";

import Image from "next/image";
import Logo from "@/assests/logo.svg";
import Profile from "@/assests/user.svg";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useRef, useState } from "react";
// 이동시 텍스트 색상 유지를 위해 usePathname 적용

export default function Header() {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // 로그인/회원가입 페이지에서는 Header 숨김
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  // 자유게시판/중고마켓 메뉴 항목
  const navItems = [
    { name: "자유게시판", href: "/article" },
    { name: "중고마켓", href: "/market" },
  ];

  // 랜딩 페이지인지 여부
  const isLandingPage = pathname === "/";

  // ▼ 프로필 드롭다운 상태/제어
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogoutClick = async () => {
    // confirm 먼저
    const ok = window.confirm("정말 로그아웃 하시겠습니까?");
    if (!ok) return;

    try {
      const msg = await logout(); // AuthProvider.logout이 message를 반환
      alert(msg || "로그아웃되었습니다.");
      router.push("/");
    } catch (e) {
      alert(e?.message || "로그아웃 처리 중 오류가 발생했습니다.");
    } finally {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] flex items-center justify-between px-4 xl:px-[200px] bg-white border-b border-gray-200 z-[999] shadow-sm">
      <div className="flex items-center max-w-[1200px] w-full mx-auto">
        <Link href="/">
          <Image
            src={Logo}
            alt="판다마켓 로고"
            width={153}
            height={40}
            className="mr-4 md:mr-[35px] xl:mr-[47px]"
          />
        </Link>

        {!isLandingPage && (
          <nav>
            <ul className="flex gap-2 md:gap-9 font-bold text-base md:text-lg">
              {navItems.map((item) => {
                const isClick = pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`transition ${
                        isClick ? "text-blue-500" : "text-gray-600"
                      } hover:text-blue-500`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      {/* 로그인 상태에 따라 구분 */}
      <div>
        {isLoading ? (
          <div className="w-[36px] h-[36px] rounded-full bg-gray-200 animate-pulse" />
        ) : user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="flex items-center gap-2 md:gap-2"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              <Image
                src={Profile}
                alt="프로필 이미지"
                width={36}
                height={36}
                className="rounded-full"
              />
              <div className="text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">
                {user.nickName}
              </div>
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute left-0 top-8 mt-2 w-25 bg-white border border-gray-200 rounded-lg shadow-md z-10"
              >
                <button
                  role="menuitem"
                  className="w-full py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  onClick={handleLogoutClick}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <button
              type="button"
              className="text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 
              font-medium text-[16px]
              rounded-lg py-[10px] px-[35px] 
              cursor-pointer transition-all duration-200 ease-in-out
              whitespace-nowrap"
            >
              로그인
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
