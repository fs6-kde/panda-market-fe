const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 전역 accessToken 저장
let accessToken = null;

// accessToken getter 추가
export const getAccessToken = () => accessToken;

// accessToken 설정 함수 (최초 로그인 시 호출 필요)
export const setAccessToken = (token) => {
  accessToken = token;
  console.log("[setAccessToken] 토큰 설정됨:", token);
};

// 내부 공통 fetch 로직 (401 → refresh 재시도 포함)
const fetchWithAutoRefresh = async (url, options = {}) => {
  let headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  console.log("[fetch] 요청 헤더:", headers);
  console.log("[fetch] 요청 URL:", `${BASE_URL}${url}`);

  // accessToken 만료 → 자동 재발급
  if (response.status === 401) {
    try {
      const refreshRes = await fetch(`${BASE_URL}/token/refresh`, {
        method: "POST",
        credentials: "include", // 쿠키 기반으로 refreshToken 전송
      });

      if (!refreshRes.ok) {
        throw new Error("토큰 재발급 실패");
      }

      const { accessToken: newToken } = await refreshRes.json();
      if (!newToken) {
        throw new Error("새 accessToken 없음");
      }

      setAccessToken(newToken);

      // 원래 요청 재시도
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
        credentials: "include",
        cache: "no-store",
      });
    } catch (err) {
      throw new Error("자동 로그인 실패. 다시 로그인해주세요.");
    }
  }

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : {};

  if (!response.ok) {
    const message = data?.message || `API error: ${response.status}`;
    throw new Error(message);
  }

  return data;
};

// 일반 fetch (로그인 등)
export const defaultFetch = async (url, options = {}) => {
  return fetchWithAutoRefresh(url, options);
};

// 토큰 기반 fetch
export const tokenFetch = async (url, tokenOverride, options = {}) => {
  if (tokenOverride) {
    setAccessToken(tokenOverride);
  }

  // accessToken 없으면 refresh 시도
  if (!accessToken) {
    try {
      const res = await fetch(`${BASE_URL}/token/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("토큰 재발급 실패");
      }

      const { accessToken: newToken } = await res.json();
      if (!newToken) {
        throw new Error("새 accessToken 없음");
      }

      setAccessToken(newToken);
    } catch (err) {
      throw new Error("자동 로그인 실패. 다시 로그인해주세요.");
    }
  }

  return fetchWithAutoRefresh(url, options);
};
