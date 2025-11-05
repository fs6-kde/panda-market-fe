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

      // redirect 또는 from 쿼리로 이전 위치 복구
      const qpRedirect =
        searchParams.get("redirect") || searchParams.get("from");
      // 안전한 내부 경로만 허용 (외부 URL 차단)
      const safeRedirect =
        qpRedirect && qpRedirect.startsWith("/") && !qpRedirect.startsWith("//")
          ? qpRedirect
          : null;

      // 로그인 페이지/회원가입 페이지로 돌아가려는 경우는 /market로 보정
      const go =
        safeRedirect && !["/login", "/signup"].includes(safeRedirect)
          ? safeRedirect
          : "/market";

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
