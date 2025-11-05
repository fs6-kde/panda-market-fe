// 로그인 하면 혹은 토큰 유효하면 자동으로 마켓 페이지

"use client";

import Image from "next/image";
import pandaTopImage from "@/assests/pandaTopImage.svg";
import pandaReview from "@/assests/pandaReview.svg";
import hotitem from "@/assests/Img_home_01.svg";
import search from "@/assests/Img_home_02.svg";
import register from "@/assests/Img_home_03.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // 인증자는 랜딩 접근 차단
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/market");
    }
  }, [user, isLoading, router]);

  // 로딩 중이거나 인증자 리다이렉트 중이면 렌더링하지 않음
  if (isLoading || user) return null;

  return (
    <div className="w-full">
      {/* 상단 Hero 영역 */}
      <section className="w-full bg-[#CFE5FF]">
        <div
          className="
            w-full
            flex flex-col items-center justify-center
            px-4 pt-25 pb-0 md:pt-35
            lg:flex-row lg:items-end lg:justify-start lg:px-[330px] lg:pt-15
          "
        >
          {/* 텍스트 */}
          <div className="flex-1 flex items-center justify-center lg:mb-15">
            <div className="text-center lg:text-left">
              <div
                className="
                  text-[32px] md:text-[40px] leading-snug font-semibold text-gray-800 mb-4
                  md:mb-6
                  lg:text-[30px] lg:leading-tight lg:mb-6
                "
              >
                일상의 모든 물건을
                <br className="block md:hidden lg:block" />
                거래해 보세요
              </div>
              <Link href="/market">
                <button
                  className="
                    bg-[#5B8DEF] text-white text-sm
                    px-18 py-3 rounded-full text-[18px]
                    transition-all duration-200 ease-in-out
                    hover:bg-[#437cd8] hover:scale-[1.03]
                    active:scale-95 focus:outline-none
                    shadow-md hover:shadow-lg
                    md:px-35
                    lg:px-23 lg:py-2.5
                    whitespace-nowrap
                  "
                >
                  구경하러 가기
                </button>
              </Link>
            </div>
          </div>

          {/* 이미지 */}
          <div className="flex-1 flex justify-center hidden lg:block items-center">
            <div
              className="
              relative    /* 모바일 전용 캔버스 */
              w-[500px] h-auto overflow-visible aspect-[4/3]
            "
            >
              <Image
                src={pandaTopImage}
                alt="Top Banner"
                fill
                priority
                className="
                object-contain object-bottom                         /* 데스크탑: 원래처럼 비율 유지 */
              "
              />
            </div>
          </div>
        </div>

        {/* 이미지 */}
        <div className="flex-1 flex justify-center lg:hidden shrink-0">
          <div
            className="
              relative w-full h-[195px] overflow-hidden    /* 모바일 전용 캔버스 */
              mt-25
              md:h-[330px]                                  /* 태블릿에서 높이 조금 여유 */
            "
          >
            <Image
              src={pandaTopImage}
              alt="Top Banner"
              fill
              priority
              sizes="(min-width:744px) 500px, 100vw"
              className="
                object-cover object-bottom                  /* 모바일: 채우면서 크롭 */
                scale-[1]                                /* 모바일 확대 */
                md:scale-100                                /* 태블릿부터 확대 해제 */
              "
            />
          </div>
        </div>
      </section>

      {/* 중간 콘텐츠: Hot Item, Search, Register */}
      <section
        className="
          bg-white w-full
          flex flex-col items-center
          gap-8 py-10 px-4
          md:px-6 md:gap-10 
          lg:gap-20 lg:py-20
        "
      >
        {/* ===== Hot item ===== */}
        {/* 모바일 버전(이미지 위, 텍스트 아래) */}
        <div className="w-full max-w-[340px] md:max-w-full lg:hidden">
          <div className="rounded-2xl p-4 md:p-6 shadow-[0_2px_3px_rgba(0,0,0,0.1)]">
            <Image
              src={hotitem}
              alt="Hot Item"
              className="w-full h-auto rounded-xl mb-4"
            />
            <p className="text-[#5B8DEF] text-[18px] md:text-[23px] font-semibold mb-1">
              Hot item
            </p>
            <h3 className="text-[20px] md:text-[27px] font-semibold text-gray-800 leading-snug mb-1">
              인기 상품을 확인해 보세요
            </h3>
            <p className="text-gray-700 text-sm md:text-[16px]">
              가장 HOT한 중고거래 물품을
              <br />
              판다 마켓에서 확인해보세요
            </p>
          </div>
        </div>

        {/* 데스크탑 버전(기존 이미지 그대로) */}
        <div className="hidden lg:block w-[850px]">
          <div className="flex flex-row items-center rounded-2xl shadow-[0_2px_3px_rgba(0,0,0,0.1)]">
            <Image
              src={hotitem}
              alt="Hot Item"
              className="max-w-[500px] max-h-[380px] rounded-xl"
            />
            <div className="pl-15 pr-5">
              <p className="text-[#5B8DEF] text-[23px] font-semibold mb-1">
                Hot item
              </p>
              <h3 className="text-[33px] font-semibold text-gray-800 leading-snug mb-1">
                인기 상품을
                <br />
                확인해 보세요
              </h3>
              <p className="text-gray-700 text-[20px]">
                가장 HOT한 중고거래 물품을
                <br />
                판다 마켓에서 확인해보세요
              </p>
            </div>
          </div>
        </div>

        {/* ===== Search ===== */}
        <div className="w-full max-w-[340px] md:max-w-full lg:hidden">
          <div className="rounded-2xl p-4 md:p-6 shadow-[0_2px_3px_rgba(0,0,0,0.1)] text-right">
            <Image
              src={search}
              alt="Search"
              className="w-full h-auto rounded-xl mb-4"
            />
            <p className="text-[#5B8DEF] text-[18px] md:text-[23px] font-semibold mb-1">
              Search
            </p>
            <h3 className="text-[20px] md:text-[27px] font-semibold text-gray-800 leading-snug mb-1">
              구매를 원하는 상품을 검색하세요
            </h3>
            <p className="text-gray-700 text-sm md:text-[16px]">
              구매하고 싶은 물품을 검색해서
              <br />
              쉽게 찾아보세요
            </p>
          </div>
        </div>

        <div className="hidden lg:block w-[850px]">
          <div className="flex flex-row items-center rounded-2xl shadow-[0_2px_3px_rgba(0,0,0,0.1)] text-right">
            <div className="pl-8.5 pr-15">
              <p className="text-[#5B8DEF] text-[23px] font-semibold mb-1">
                Search
              </p>
              <h3 className="text-[33px] font-semibold text-gray-800 leading-snug mb-1">
                구매를 원하는
                <br />
                상품을 검색하세요
              </h3>
              <p className="text-gray-700 text-[20px]">
                구매하고 싶은 물품을 검색해서
                <br />
                쉽게 찾아보세요
              </p>
            </div>

            <Image
              src={search}
              alt="Search"
              className="max-w-[500px] max-h-[380px] rounded-xl"
            />
          </div>
        </div>

        {/* ===== Register ===== */}
        <div className="w-full max-w-[340px] md:max-w-full lg:hidden">
          <div className="rounded-2xl p-4 md:p-6 shadow-[0_2px_3px_rgba(0,0,0,0.1)]">
            <Image
              src={register}
              alt="Register"
              className="w-full h-auto rounded-xl mb-4"
            />
            <p className="text-[#5B8DEF] text-[18px] md:text-[23px] font-semibold mb-1">
              Register
            </p>
            <h3 className="text-[20px] md:text-[27px] font-semibold text-gray-800 leading-snug mb-1">
              판매를 원하는 상품을 등록하세요
            </h3>
            <p className="text-gray-700 text-sm md:text-[16px]">
              어떤 물건이든 판매하고 싶은 상품을
              <br />
              쉽게 등록하세요
            </p>
          </div>
        </div>

        <div className="hidden lg:block w-[850px]">
          <div className="flex flex-row items-center rounded-2xl shadow-[0_2px_3px_rgba(0,0,0,0.1)]">
            <Image
              src={register}
              alt="Register"
              className="max-w-[500px] max-h-[380px] rounded-xl"
            />
            <div className="pl-14 pr-5">
              <p className="text-[#5B8DEF] text-[23px] font-semibold mb-1">
                Register
              </p>
              <h3 className="text-[33px] font-semibold text-gray-800 leading-snug mb-1">
                판매를 원하는
                <br />
                상품을 등록하세요
              </h3>
              <p className="text-gray-700 text-[20px]">
                판매하고 싶은 상품을
                <br />
                쉽게 등록하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 리뷰 영역 */}
      <section className="w-full bg-[#CFE5FF] mt-12 lg:mt-1">
        <div
          className="
            w-full
            flex flex-col items-center justify-center
            px-4 pb-0 gap-2 pt-10
            lg:flex-row lg:items-cennter lg:justify-start lg:px-[300px] lg:pt-0
          "
        >
          {/* 텍스트 */}
          <div className="flex items-center justify-center">
            <h2
              className="
                text-[32px] md:text-[40px] font-semibold text-gray-800 text-center mt-6 mb-4
                leading-snug
                lg:text-[30px] lg:text-left lg:mt-20 md:mb-0 lg:leading-tight
                whitespace-nowrap
              "
            >
              믿을 수 있는
              <br />
              판다마켓 중고 거래
            </h2>
          </div>

          {/* 이미지 모바일버전 */}
          <div className="relative aspect-[4/3] hidden lg:block mx-auto w-[600px]">
            <Image
              src={pandaReview}
              alt="Bottom Banner"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>

        {/* 이미지 데스크탑버전 */}
        <div className="relative w-full aspect-[4/3] lg:hidden mt-4 md:mt-0 mx-auto">
          <Image
            src={pandaReview}
            alt="Bottom Banner"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </section>
    </div>
  );
}
