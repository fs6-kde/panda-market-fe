"use client";

import Image from "next/image";
import Logo from "@/assests/logo.svg";
import Profile from "@/assests/user.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
// 이동시 텍스트 색상 유지를 위해 usePathname 적용

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { name: "자유게시판", href: "/article" },
    { name: "중고마켓", href: "/market" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] flex items-center justify-between px-4 xl:px-[200px] bg-white border-b border-gray-200 z-[999]">
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
      </div>

      {/* 로그인 상태에 따라 구분 */}
      {user ? (
        <div className="flex items-center gap-2 md:gap-2">
          <Image
            src={Profile}
            alt="프로필 이미지"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div className="text-gray-700 font-medium text-sm md:text-base whitespace-nowrap">
            {user.nickname}
          </div>
        </div>
      ) : (
        <Link href="/login">
          <button
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 
              font-medium text-xs md:text-base 
              rounded-lg py-2.5 px-4 md:py-[10px] md:px-[20px] 
              cursor-pointer disabled:bg-gray-400 
              whitespace-nowrap"
          >
            로그인
          </button>
        </Link>
      )}
    </header>
  );
}
