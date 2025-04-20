// 전체 게시글 조회
export async function getArticles({ orderBy = "recent", word } = {}) {
  const query = new URLSearchParams({});

  // 최신순 정렬
  query.append("orderBy", orderBy);

  // word 추출
  if (word) query.append("word", word);

  const res = await fetch(
    `http://localhost:3000/articles?${query.toString()}`,
    {
      cache: "no-store", //SSG 렌더링할 시
    }
  );

  if (!res.ok) {
    throw new Error("게시글 목록 조회 실패");
  }

  return res.json();
}

// 게시글 상세 조회
export async function getArticle(id) {
  const res = await fetch(`http://localhost:3000/articles/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("게시글 조회 실패");
  return res.json();
}
