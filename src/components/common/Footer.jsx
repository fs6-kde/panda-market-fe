// "use client";
// Link로 변경

import FacebookIcon from "@/assests/facebook.svg";
import TwitterIcon from "@/assests/twitter.svg";
import YoutubeIcon from "@/assests/youtube.svg";
import InstagramIcon from "@/assests/instagram.svg";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-400 text-sm px-4 py-8 l:px-[200px] l:py-[100px] flex flex-wrap justify-center gap-80">
      {/* 왼쪽: 카피라이트 */}
      <div className="order-3 w-full text-center xl:order-1 xl:w-auto">
        ©codeit - 2024
      </div>

      {/* 가운데: 메뉴 */}
      <ul className="flex gap-6 justify-center w-full xl:order-2 xl:w-auto">
        <li>
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-white transition">
            FAQ
          </a>
        </li>
      </ul>

      {/* 오른쪽: 소셜 아이콘 */}
      <div className="flex gap-3 justify-center xl:order-3 xl:w-auto">
        <a href="#" className="hover:opacity-80 transition">
          <Image src={FacebookIcon} alt="Facebook" className="w-5 h-5" />
        </a>
        <a href="#" className="hover:opacity-80 transition">
          <Image src={TwitterIcon} alt="Twitter" className="w-5 h-5" />
        </a>
        <a href="#" className="hover:opacity-80 transition">
          <Image src={YoutubeIcon} alt="YouTube" className="w-5 h-5" />
        </a>
        <a href="#" className="hover:opacity-80 transition">
          <Image src={InstagramIcon} alt="Instagram" className="w-5 h-5" />
        </a>
      </div>
    </footer>
  );
}
