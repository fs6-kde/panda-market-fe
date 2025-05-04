export async function getProducts({
  page = 1,
  pageSize = 10,
  orderBy = "recent",
} = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    orderBy,
  });

  const res = await fetch(
    `https://panda-market-api.vercel.app/products?${query.toString()}`
  );

  if (!res.ok) {
    throw new Error("상품 목록을 불러오지 못했습니다.");
  }

  return res.json();
}

export async function getProduct(id) {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Unauthorized");
  }
  const res = await fetch(
    `https://panda-market-api.vercel.app/products/${id}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("해당 상품을 불러오지 못했습니다.");
  }

  return res.json();
}
