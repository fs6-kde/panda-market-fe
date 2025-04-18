// "use client";

import Image from "next/image";
import Logo from "@/assests/logo.svg";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-[60px] flex items-center justify-between px-4 xl:px-[200px] bg-white border-b border-gray-200 z-[999]">
      <div className="flex items-center max-w-[1200px] w-full mx-auto">
        <Link href="/">
          <Image
            src={Logo}
            alt="판다마켓 로고"
            width="153"
            className="mr-4 md:mr-[35px] xl:mr-[47px]"
          />
        </Link>
        <nav>
          <ul className="flex list-none gap-2 md:gap-9 text-gray-600 font-bold text-base md:text-lg">
            <Link href="/article">
              <li>자유게시판</li>
            </Link>
            <Link href="/market">
              <li>중고마켓</li>
            </Link>
            {/* 데스크탑 전용 요소 예시 */}
            {/* <li className="hidden xl:inline text-gray-400">|</li> */}
          </ul>
        </nav>
      </div>

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
    </header>
  );
}
