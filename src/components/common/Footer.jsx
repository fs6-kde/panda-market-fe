"use client";

import FacebookIcon from "@/assests/facebook.svg";
import TwitterIcon from "@/assests/twitter.svg";
import YoutubeIcon from "@/assests/youtube.svg";
import InstagramIcon from "@/assests/instagram.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <footer className="bg-[#111827] text-gray-400 text-[13px] px-4 md:px-6 pt-6 pb-15 lg:px-[180px]">
      <div
        className="
      grid items-center gap-y-4
      grid-cols-2               /* 기본: 2칸 (sm) */
      md:grid-cols-3          /* md 이상: 3칸 */
    "
      >
        {/* md/lg: 1열 = 메뉴 | sm: 2행 아래쪽 단독 */}
        <div
          className="
        whitespace-nowrap
        order-2 col-auto justify-self-start     /* sm: 1행 왼쪽 */
        md:order-none md:col-auto md:justify-self-start  /* md~: 2열 중앙 */
      "
        >
          ©codeit - 2024
        </div>

        {/* md/lg: 2열 = © | sm: 1행 왼쪽 */}
        <ul
          className="
          whitespace-nowrap
        flex gap-5
        col-span-1 order-1 justify-self-start   /* sm: 아래쪽 전체폭 */
        md:order-none md:col-auto md:justify-self-center  /* md~: 1열 */
      "
        >
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

        {/* md/lg: 3열 = 아이콘 | sm: 1행 오른쪽 */}
        <div
          className="
          whitespace-nowrap
        order-1 col-auto justify-self-end flex gap-3   /* sm: 1행 오른쪽 */
        md:order-none md:col-auto md:justify-self-end lg:gap-4  /* md~: 3열 */
      "
        >
          <a href="#" className="hover:opacity-80 transition">
            <Image
              className="w-5 h-5 lg:w-6 lg:h-6"
              src={FacebookIcon}
              alt="Facebook"
            />
          </a>
          <a href="#" className="hover:opacity-80 transition">
            <Image
              className="w-5 h-5 lg:w-6 lg:h-6"
              src={TwitterIcon}
              alt="Twitter"
            />
          </a>
          <a href="#" className="hover:opacity-80 transition">
            <Image
              className="w-5 h-5 lg:w-6 lg:h-6"
              src={YoutubeIcon}
              alt="YouTube"
            />
          </a>
          <a href="#" className="hover:opacity-80 transition">
            <Image
              className="w-5 h-5 lg:w-6 lg:h-6"
              src={InstagramIcon}
              alt="Instagram"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
