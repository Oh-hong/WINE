import { ChangeEvent, useState } from "react";
import React from "react";
import searchIcon from "@/assets/img/search.svg";
import Image from "next/image";
import { useWineStore } from "@/store/filteringStore";

type FilterValue =
  | "latest"
  | "recommended"
  | "mostReviews"
  | "priceHigh"
  | "priceLow";

interface FilterOption {
  value: FilterValue;
  label: string;
}

const TopFiltering = () => {
  const { setSearchTerm, sortBy, setSortBy } = useWineStore();
  const [inputValue, setInputValue] = useState("");

  const filterList: FilterOption[] = [
    { value: "recommended", label: "추천순" },
    { value: "mostReviews", label: "많은리뷰" },
    { value: "priceHigh", label: "높은가격순" },
    { value: "priceLow", label: "낮은가격순" },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    // 검색어의 앞뒤 공백을 제거하고 연속된 공백을 하나의 공백으로 변환
    const trimmedInput = inputValue.trim().replace(/\s+/g, " ");
    setSearchTerm(trimmedInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectFiltering = (selected: FilterValue) => {
    setSortBy(selected);
  };

  return (
    <div className="mt-40 w-1140 h-48 flex justify-end">
      <div className="relative">
        <Image
          className="absolute inset-y-11 left-21"
          src={searchIcon}
          alt="SearchIcon"
          onClick={handleSearch}
        />
        <input
          className="w-400 h-48 border border-grayscale-300 focus:outline-main rounded-50 pl-51 mr-102"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="검색어를 입력해주세요"
        />
      </div>
      <div className="w-298 h-48 flex justify-between">
        {filterList.map((filterName) => (
          <span
            className={`cursor-pointer h-48 text-16 font-medium flex items-center ${
              sortBy === filterName.value ? "text-main" : "text-grayscale-500"
            }`}
            key={filterName.value}
            onClick={() => handleSelectFiltering(filterName.value)}
          >
            {filterName.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopFiltering;
