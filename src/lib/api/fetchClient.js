/**
 * 기본 fetch 클라이언트 - 인증이 필요 없는 요청용
 */
export const defaultFetch = async (url, options = {}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "force-cache",
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${url}`, mergedOptions);

  const data = await response.json(); // 먼저 응답 본문 파싱

  if (!response.ok) {
    // 서버가 내려준 에러 메시지를 우선 사용
    const errorMessage = data?.message || `API error: ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
};

/**
 * 토큰 인증이 필요한 fetch 클라이언트
 */
export const tokenFetch = async (url, options = {}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const accessToken = localStorage.getItem("accessToken");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${url}`, mergedOptions);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return { status: response.status, ok: response.ok };
};
