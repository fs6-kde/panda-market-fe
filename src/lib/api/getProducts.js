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

  const res = await fetch(`http://localhost:3000/products?${query.toString()}`);

  if (!res.ok) {
    throw new Error("상품 목록을 불러오지 못했습니다.");
  }

  return res.json();
}

export async function getProduct(id) {
  const res = await fetch(`http://localhost:3000/products/${id}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("해당 상품을 불러오지 못했습니다.");
  }

  return res.json();
}
