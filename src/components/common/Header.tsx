import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import white_logo from "@/assets/img/logo-white.svg";
import profile_img from "@/assets/img/profile-default.svg";

export default function Header() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // 서버 사이드 렌더링 시에는 아무것도 렌더링하지 않는다.
  }

  const accessToken = localStorage.getItem("accessToken");

  return (
    <header
      role="banner"
      className="flex justify-between items-center fixed top-0 inset-x-0 z-10 mx-16 md:mx-20 lg:mx-auto mt-16 md:mt-24 px-20 md:px-60 lg:max-w-[1140px] h-50 md:h-70 rounded-16 bg-black"
    >
      <Link href="/" className="flex">
        <button type="button" title="메인로고버튼" className="h-15">
          <Image src={white_logo} alt="메인로고이미지" width="52" height="15" />
        </button>
      </Link>
      {!accessToken ? (
        <div className="flex-center gap-20 md:gap-40 font-medium-16 text-white">
          <Link href="/login">로그인</Link>
          <Link href="/signup">회원가입</Link>
        </div>
      ) : (
        <Image
          src={profile_img}
          alt="프로필이미지"
          className="w-20 h-20 md:w-45 md:h-45 rounded-[50%] border-1 boder-solid border-grayscale-300 object-contain"
        />
      )}
    </header>
  );
}
