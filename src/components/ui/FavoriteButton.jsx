// import { postFavorite } from "@/lib/api/postFavorite";
// import { deleteFavorite } from "@/lib/api/deleteFavorite";
import fullHeart from "@/assests/full-heart.svg";
import emptyHeart from "@/assests/empty-heart.svg";
import Image from "next/image";
import { useState } from "react";
import { toggleFavorite } from "@/lib/api/favorite";

export default function FavoriteButton({ product }) {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);
  const [favoriteCount, setFavoriteCount] = useState(product.favoriteCount);

  // const handleToggleFavorite = async () => {
  //   try {
  //     if (isFavorite) {
  //       const updated = await deleteFavorite(product.id);
  //       setIsFavorite(updated.isFavorite);
  //       setFavoriteCount(updated.favoriteCount);
  //     } else {
  //       const updated = await postFavorite(product.id);
  //       setIsFavorite(updated.isFavorite);
  //       setFavoriteCount(updated.favoriteCount);
  //     }
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

  const handleToggleFavorite = async () => {
    try {
      const updated = await toggleFavorite(product.id);
      setIsFavorite(updated.isFavorite);
      setFavoriteCount(updated.favoriteCount);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1"
    >
      <Image
        src={isFavorite ? fullHeart : emptyHeart}
        alt="좋아요"
        width={18}
        height={18}
      />
      <span className="text-sm text-gray-600">{favoriteCount}</span>
    </button>
  );
}

// TODO: 로그인이 필요하다는 커스텀 모달, 확인 누르면 바로 로그인 페이지 이동
