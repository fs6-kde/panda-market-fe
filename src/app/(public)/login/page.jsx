"use client";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "@/assests/logo.svg";
import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import Button from "@/components/ui/Button";
import OIDCGroup from "@/components/ui/OIDCGroup";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import ErrorModal from "@/components/ui/ErrorModal";

// 절대 URL이라도 동일 사이트이면 pathname(+query+hash)만 뽑아 쓰는 보조함수
// 로그인 후 직전 페이지로 돌아갈 때 안전한 경로인지 검사 및 정제해주는 보안 필터 함수
function getSafeRedirect(raw) {
  if (!raw) return null;

  // 내부 상대경로면 바로 허용
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;

  try {
    // 절대 URL이라면 브라우저 기준으로 파싱
    const url = new URL(raw, window.location.origin);

    // 같은 사이트라면 안전, 경로만 추출
    if (url.origin === window.location.origin) {
      return url.pathname + url.search + url.hash;
    }
  } catch {
    // 파싱 실패 시 그냥 무시
  }

  // 외부 사이트만 null 반환 -> 그냥 마켓 페이지로 이동
  return null;
}
// => 이 redirect가 내부 페이지 이동만 가능하도록 제한, 아닐 시 마켓 페이지로 돌린다

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const isButtonEnabled = email && password && !emailError && !passwordError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);

      // RequireAuth에서 붙여준 redirect(or from) 복구
      const raw = searchParams.get("redirect") || searchParams.get("from");
      const safe = getSafeRedirect(raw);

      // 로그인/회원가입으로 되돌아가는 루프 방지
      const go =
        safe && !["/login", "/signup"].includes(safe) ? safe : "/market";
      router.replace(go);
    } catch (err) {
      const msg = err?.message || "";
      if (msg.includes("존재하지"))
        setModalMessage("존재하지 않는 이메일입니다.");
      else if (msg.includes("비밀번호"))
        setModalMessage("비밀번호가 일치하지 않습니다.");
      else setModalMessage("로그인에 실패했습니다.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-white">
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* 로고 */}
        <div className="mb-6">
          <Image src={Logo} alt="판다마켓 로고" width={386} height={122} />
        </div>

        {/* 로그인 폼 */}
        <form className="w-full" onSubmit={handleSubmit}>
          <InputField
            label="이메일"
            placeholder="이메일을 입력해주세요"
            type="email"
            value={email}
            setValue={setEmail}
            validate={(val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)}
            errorMessageIfInvalid="잘못된 이메일입니다."
            setErrorState={setEmailError}
            required
          />
          <PasswordField
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            setValue={setPassword}
            setErrorState={setPasswordError}
          />

          <Button disabled={loading || !isButtonEnabled} loading={loading}>
            {loading ? "가입 중..." : "로그인"}
          </Button>

          {/* 실패 시 모달창 */}
          {showModal && (
            <ErrorModal
              message={modalMessage}
              onClose={() => setShowModal(false)}
            />
          )}

          <OIDCGroup />

          {/* 회원가입 안내 */}
          <p className="text-center mt-6 text-sm text-gray-500">
            판다마켓이 처음이신가요?{" "}
            <Link href="/signup">
              <span className="text-blue-500 font-medium cursor-pointer">
                회원가입
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
