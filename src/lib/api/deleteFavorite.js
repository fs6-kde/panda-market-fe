// export const deleteFavorite = async (productId) => {
//   const token = localStorage.getItem("accessToken");
//   if (!token) throw new Error("로그인이 필요합니다.");

//   const res = await fetch(
//     `https://panda-market-api.vercel.app/products/${productId}/favorite`,
//     {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!res.ok) {
//     const error = await res.json();
//     throw new Error(error.message || "좋아요 취소 실패");
//   }

//   return res.json();
// };

// 내 로컬 주소로 대신 연결함
