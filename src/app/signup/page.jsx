"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import OIDCGroup from "@/components/ui/OIDCGroup";
import Link from "next/link";
import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import ConfirmPasswordField from "@/components/ui/ConfirmPasswordField";
import Button from "@/components/ui/Button";
import Logo from "@/assests/logo.svg";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import ErrorModal from "@/components/ui/ErrorModal";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState(true);
  const [nicknameError, setNicknameError] = useState(true);
  const [passwordError, setPasswordError] = useState(true);
  const [confirmPasswordError, setConfirmPasswordError] = useState(true);

  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();
  const { register } = useAuth();

  // 버튼 활성화 조건: 모든 필드 값 존재 && 에러 없음
  const isButtonEnabled =
    email &&
    nickname &&
    password &&
    confirmPassword &&
    !emailError &&
    !nicknameError &&
    !passwordError &&
    !confirmPasswordError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalMessage("");
    setLoading(true);
    try {
      await register(nickname, email, password);
      router.push("/market");
    } catch (err) {
      if (err.message === "이미 사용중인 이메일입니다.") {
        setModalMessage("이미 사용중인 이메일입니다.");
      } else if (err.message === "이미 사용중인 닉네임입니다.") {
        setModalMessage("이미 사용중인 닉네임입니다.");
      } else {
        setModalMessage("회원가입에 실패했습니다.");
      }
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-4">
      <div className="w-full max-w-lg flex flex-col items-center">
        <div className="mb-6">
          <Image src={Logo} alt="판다마켓 로고" width={386} height={122} />
        </div>

        <form className="w-full" onSubmit={handleSubmit}>
          <InputField
            label="이메일"
            placeholder="이메일을 입력해주세요"
            type="email"
            value={email}
            setValue={setEmail}
            validate={(val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)}
            errorMessageIfInvalid="잘못된 이메일입니다."
            required
            setErrorState={setEmailError}
          />
          <InputField
            label="닉네임"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            setValue={setNickname}
            required
            setErrorState={setNicknameError}
          />
          <PasswordField
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            setValue={setPassword}
            setErrorState={setPasswordError}
          />
          <ConfirmPasswordField
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 한 번 입력해주세요"
            value={confirmPassword}
            setValue={setConfirmPassword}
            password={password}
            setErrorState={setConfirmPasswordError}
          />

          <Button disabled={loading || !isButtonEnabled} loading={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </Button>
          <OIDCGroup />

          <p className="text-center mt-6 text-sm text-gray-500">
            이미 회원이신가요?{" "}
            <Link href="/login">
              <span className="text-blue-500 font-medium cursor-pointer">
                로그인
              </span>
            </Link>
          </p>
        </form>
      </div>

      {showModal && (
        <ErrorModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
