// 전체 게시글 조회
export async function getArticles() {
  const res = await fetch("http://localhost:3000/articles", {
    cache: "no-store", //SSG 렌더링할 시
  });

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  const data = await res.json();
  return data;
}

// 게시글 상세 조회
export async function getArticle(id) {
  const res = await fetch(`http://localhost:3000/articles/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
}
