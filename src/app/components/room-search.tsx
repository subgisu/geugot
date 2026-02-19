import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

export interface RoomSearchFilters {
  keyword: string;
  minCapacity: number;
  maxPrice: number;
  amenities: string[];
}

interface RoomSearchProps {
  onSearch: (filters: RoomSearchFilters) => void;
}

export function RoomSearch({ onSearch }: RoomSearchProps) {
  const [keyword, setKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minCapacity, setMinCapacity] = useState(1);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const availableAmenities = [
    "킹사이즈 침대",
    "퀸사이즈 침대",
    "개별 욕조",
    "샤워부스",
    "발코니",
    "WiFi",
    "미니바",
    "업무용 책상",
  ];

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    onSearch({
      keyword: value,
      minCapacity,
      maxPrice,
      amenities: selectedAmenities,
    });
  };

  const handleFilterChange = () => {
    onSearch({
      keyword,
      minCapacity,
      maxPrice,
      amenities: selectedAmenities,
    });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(newAmenities);
    onSearch({
      keyword,
      minCapacity,
      maxPrice,
      amenities: newAmenities,
    });
  };

  const handleClearFilters = () => {
    setKeyword("");
    setMinCapacity(1);
    setMaxPrice(500000);
    setSelectedAmenities([]);
    onSearch({
      keyword: "",
      minCapacity: 1,
      maxPrice: 500000,
      amenities: [],
    });
  };

  const activeFilterCount =
    (keyword !== "" ? 1 : 0) +
    (minCapacity > 1 ? 1 : 0) +
    (maxPrice < 500000 ? 1 : 0) +
    (selectedAmenities.length > 0 ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="객실명, 편의시설로 검색"
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
            showFilters || activeFilterCount > 0
              ? "bg-blue-50 border-blue-500 text-blue-700"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">필터</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-gray-200 mt-4">
          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최소 수용 인원: {minCapacity}명
            </label>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={minCapacity}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMinCapacity(value);
                onSearch({
                  keyword,
                  minCapacity: value,
                  maxPrice,
                  amenities: selectedAmenities,
                });
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1명</span>
              <span>6명</span>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최대 가격: {maxPrice.toLocaleString()}원
            </label>
            <input
              type="range"
              min="50000"
              max="500000"
              step="10000"
              value={maxPrice}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMaxPrice(value);
                onSearch({
                  keyword,
                  minCapacity,
                  maxPrice: value,
                  amenities: selectedAmenities,
                });
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50,000원</span>
              <span>500,000원</span>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              편의시설
            </label>
            <div className="flex flex-wrap gap-2">
              {availableAmenities.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    selectedAmenities.includes(amenity)
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              필터 초기화
            </button>
          )}
        </div>
      )}
    </div>
  );
}
