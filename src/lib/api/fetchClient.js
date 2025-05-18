const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const defaultFetch = async (url, options = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
    credentials: "include", // refreshToken 쿠키가 필요한 요청에 필요
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.message || `API error: ${response.status}`;
    throw new Error(message);
  }

  return data;
};

export const tokenFetch = async (url, accessToken, options = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const contentType = response.headers.get("content-type");

  return contentType?.includes("application/json")
    ? response.json()
    : { ok: response.ok, status: response.status };
};
