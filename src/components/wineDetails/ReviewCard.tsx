import Image from "next/image";
import { balancedProfiles as initialBalancedProfiles } from "@/constants/review";
import ReviewTag from "./ReviewTag";
import defaultUserImg from "@/assets/img/profile-default.svg";

import menuImg from "@/assets/img/3dot-large.svg";
import moreImg from "@/assets/img/more.svg";
import { Review } from "@/types/wineTypes";
import { getElapsedTime } from "@/utils/wineDetailUtils";
import { AROMA_TO_KR } from "@/constants/aroma";
import { useEffect, useState } from "react";
import {
  deleteReview,
  getAccessToken,
  getReviewId,
  getWineId,
  patchReview,
} from "@/lib/reviewApi";
import { BalancedProfile, REVIEW_MODE, WineBalance } from "@/types/reviewTypes";
import ProfileSliders from "./ProfileSliders";
import Dropdown from "../common/Dropdown";
import { EDIT_MENU, MenuItem } from "@/constants/dropdown";
import {
  useFormType,
  useReviewRerenderStore,
  useReviewStore,
  useWineDataStore,
} from "@/store/reviewStore";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../common/Toast";
import useModalStore from "@/store/modalStore";
import { useRouter } from "next/router";
import FavoriteSelector from "./FavoriteSelector";
import { useAuthStore } from "@/store/authStore";
import ConfirmPopup from "../common/ConfirmPopup";

const initialReview: Review = {
  id: 0,
  rating: 0,
  aroma: [],
  content: "",
  createdAt: "",
  updatedAt: "",
  user: {
    id: 0,
    nickname: "",
    image: "",
  },
  lightBold: 0,
  smoothTannic: 0,
  drySweet: 0,
  softAcidic: 0,
  wineId: 0,
};

const ReviewCard = ({ review: { id } }: { review: Review }) => {
  const router = useRouter();
  const { wineid } = router.query;

  const [review, setReview] = useState<Review>(initialReview);
  const [profilesArray, setProfilesArray] = useState<BalancedProfile[]>([]);
  const setReviewRerendered = useReviewRerenderStore(
    (state) => state.setReviewRerendered
  );
  const { isReviewCardRerendered, setReviewCardRerendered } =
    useReviewRerenderStore((state) => ({
      isReviewCardRerendered: state.isReviewCardRerendered,
      setReviewCardRerendered: state.setReviewCardRerendered,
    }));

  const { openModal } = useModalStore();
  const { setReviewId } = useReviewStore((state) => ({
    setReviewId: state.setReviewId,
  }));
  const {
    user: { nickname, image },
    createdAt,
    content,
    aroma,
    rating,
  } = review;
  const userImage = image || defaultUserImg;
  const { setFormType } = useFormType((state) => ({
    setFormType: state.setFormType,
  }));
  const { setWineData } = useWineDataStore((state) => ({
    setWineData: state.setWineData,
  }));
  const [isExpanded, setIsExpanded] = useState(true);
  const userId = useAuthStore((state) => state.user.id);
  const isReviewer = review.user.id === userId;
  const isLogin = getAccessToken();
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const fetchWineData = async (id: number) => {
    try {
      const data = await getReviewId(id);
      setReview(data);
    } catch (error) {
      console.error("Error fetching review data:", error);
    }
  };

  useEffect(() => {
    if (isReviewCardRerendered) {
      setReviewCardRerendered(false);
    }
    fetchWineData(id);
  }, [id, isReviewCardRerendered, setReviewCardRerendered]);

  useEffect(() => {
    if (review && review.id !== initialReview.id) {
      const updatedBalancedProfiles: Record<string, BalancedProfile> = {
        ...initialBalancedProfiles,
      };

      Object.keys(updatedBalancedProfiles).forEach((key) => {
        const profileKey = key as keyof WineBalance;
        updatedBalancedProfiles[profileKey] = {
          ...updatedBalancedProfiles[profileKey],
          scale: review[profileKey],
        };
      });

      const profilesArray = Object.values(updatedBalancedProfiles);
      setProfilesArray(profilesArray);
    }
  }, [review]);

  const handleSelect = async (item: MenuItem) => {
    const token = getAccessToken();

    if (!token) {
      showToast("권한이 없습니다. <br /> 로그인을 해주세요.", "error");
      return;
    }

    if (item === EDIT_MENU.EDIT) {
      setReviewId(id);
      setFormType(REVIEW_MODE.EDIT);
      try {
        if (isReviewer) {
          openModal();
        } else {
          showToast("유효한 로그인이 아니거나 수정 권한이 없습니다.", "error");
        }
      } catch (error) {
        console.error("Failed to delete review:", error);
        showToast("유효한 로그인이 아니거나 수정 권한이 없습니다.", "error");
      }
    } else if (item === EDIT_MENU.DELETE) {
      setIsConfirmVisible(true);
    }
  };

  const handleToggle = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(id);
      const res = await getWineId(String(wineid));
      setWineData(res);
      setReviewRerendered(true);
      showToast("삭제되었습니다!", "success");
      setIsConfirmVisible(false);
    } catch (error) {
      console.error("Failed to delete review:", error);
      showToast("유효한 로그인이 아니거나 삭제 권한이 없습니다.", "error");
    }
  };

  const handleCancel = () => {
    setIsConfirmVisible(false);
  };

  return (
    <section
      className="max-lg:w-full w-800 p-[16px_20px] md:p-[32px_40px_24px] 
    lg:p-[16.5px_40px_20px] rounded-16 border border-grayscale-300 border-solid 
    transition duration-300 ease-in-out transform hover:shadow-lg hover:brightness-10 hover:border-main "
    >
      <div className="flex justify-between mb-16 md:mb-20">
        <div className="flex gap-16 items-center">
          <Image
            src={userImage}
            alt="유저 프로필"
            width={64}
            height={64}
            className="w-42 h-42 md:w-64 md:h-64 rounded-50 border border-grayscale-100 object-contain"
          />
          <div className="flex flex-col gap-0 md:gap-4">
            <span className="font-semibold-16 md:font-semibold-18 text-grayscale-800">
              {nickname}
            </span>
            <span className="font-regular-14 md:font-regular-16 text-grayscale-500">
              {getElapsedTime(createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-18 md:gap-24">
          {isLogin && !isReviewer && <FavoriteSelector id={id} />}
          {isReviewer && (
            <Dropdown
              trigger={
                <Image
                  src={menuImg}
                  alt="메뉴"
                  width={38}
                  height={38}
                  className="w-32 h-32 md:w-38 md:h-38 hover:bg-main-10 rounded-12"
                />
              }
              items={[EDIT_MENU.EDIT, EDIT_MENU.DELETE]}
              onSelect={handleSelect}
            />
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-4 md:gap-10">
          {aroma.map((tag, index) => (
            <ReviewTag key={index} tag={AROMA_TO_KR[tag]} />
          ))}
        </div>
        <div className="w-60 h-36 flex-shrink-0 md:w-80 md:h-42 flex flex-center gap-3 bg-main-10 rounded-12">
          <div className="fas fa-star text-main w-16 h-16 md:w-20 md:h-20 flex flex-center"></div>
          <div className="font-bold-14 md:font-bold-18 text-main flex-center">
            {rating.toFixed(1)}
          </div>
        </div>
      </div>
      <div
        className={`mt-16 md:mt-24 mb-16 md:mb-20 font-regular-14 md:font-regular-16 
          transition-all duration-300 overflow-hidden ${
            isExpanded ? "max-h-[800px]" : "max-h-0"
          }`}
      >
        {content}
        <div className="flex flex-col gap-15 md:gap-18 mt-20">
          <ProfileSliders profilesArray={profilesArray} />
        </div>
      </div>
      <div className="flex flex-center mt-16 md:mt-24 lg:mt-[6.5px]">
        <button onClick={handleToggle}>
          <Image
            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            src={moreImg}
            alt="확장/축소"
            width={30}
            height={30}
          />
        </button>
      </div>
      {isConfirmVisible && (
        <ConfirmPopup
          message="정말로 삭제하시겠습니까?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleCancel}
          confirmButtonText="삭제"
          cancelButtonText="취소"
        />
      )}
    </section>
  );
};

export default ReviewCard;
