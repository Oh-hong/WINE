import { useEffect, useState, useRef, useCallback } from "react";
import { getRecommendedWines } from "@/lib/wineApi";
import StarRating from "./StarRating";
import { GetWinesParams, Wine } from "@/types/wineTypes";
import Image from "next/image";
import wine2 from "@/assets/img/wine2.png";
import Link from "next/link";

const BestWineList = () => {
  const [wineList, setWineList] = useState<Wine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const params: GetWinesParams = {
    limit: 10,
  };

  const fetchBestWineList = async () => {
    setLoading(true);
    try {
      const recommendedWines = await getRecommendedWines(params);
      setWineList(recommendedWines);
    } catch (error) {
      setErrorMessage("추천 와인 목록을 불러오지 못했어요..");
      console.log("getRecommenedWines fetch 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestWineList();
  }, []);

  const moveSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === wineList.length - 1 ? 0 : prevIndex + 1
    );
  }, [wineList.length]);

  useEffect(() => {
    slideIntervalRef.current = setInterval(moveSlide, 3000);

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [moveSlide]);

  return (
    <div className="relative w-full h-190 perspective-500 overflow-hidden">
      {loading ? (
        <p className="text-center">로딩중...</p>
      ) : (
        <>
          {wineList.length > 0 ? (
            <div className="flex items-center justify-center h-185">
              {wineList.map((wine, index) => {
                const offset =
                  (index - currentIndex + wineList.length) % wineList.length;
                const isVisible =
                  Math.abs(offset) <= 2 ||
                  Math.abs(offset - wineList.length) <= 2;
                return (
                  isVisible && (
                    <Link
                      key={wine.id}
                      href={`/wines/${wine.id}`}
                      className={`absolute w-232 h-185 pt-10 rounded-16 bg-white shadow-lg transition-all duration-300 ease-out ${
                        offset === 0
                          ? "z-5 scale-100 opacity-100"
                          : "scale-75 opacity-50"
                      }`}
                      style={{
                        transform: `
                          translateX(${(offset === wineList.length - 1 ? -1 : offset) * 130}%)
                          translateZ(${Math.abs(offset) === 0 ? 0 : -100 - Math.abs(offset) * 50}px)
                          rotateY(${-offset * 5}deg)
                        `,
                      }}
                    >
                      <div className="flex justify-between p-10">
                        <div className="w-44 h-161 ml-10">
                          <Image
                            className="w-44 h-161 object-cover"
                            src={wine.image === "string" ? wine2 : wine.image}
                            alt="와인 이미지"
                            width={44}
                            height={161}
                            unoptimized
                          />
                        </div>
                        <div className="w-100 h-125">
                          <p className="text-3xl font-extrabold mb-10">
                            {wine.avgRating.toFixed(1)}
                          </p>
                          <StarRating rating={wine.avgRating} />
                          <p className="text-xs text-gray-500 font-normal line-clamp-2 mt-10">
                            {wine.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                );
              })}
            </div>
          ) : (
            <p className="flex-center">No wines available</p>
          )}
        </>
      )}
    </div>
  );
};

export default BestWineList;
