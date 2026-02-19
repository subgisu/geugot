import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, Clock } from "lucide-react";
import { toast } from "sonner";

interface SearchResult {
  id: string;
  name: string;
  location: string;
  type: "room" | "deal";
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
}

export function SearchBar({ onSearch, onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "강남 펜션",
    "제주도",
    "속초",
  ]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock autocomplete results - in real app, this would come from API
  const mockResults: SearchResult[] = [
    { id: "101", name: "럭셔리 스위트", location: "서울 강남구", type: "room" },
    { id: "102", name: "모던 딕스", location: "서울 마포구", type: "room" },
    { id: "d1", name: "그랜드 호텔 서울", location: "서울 강남구", type: "deal" },
    { id: "d2", name: "오션뷰 펜션", location: "강원도 속초시", type: "deal" },
    { id: "d5", name: "힐링 산장 펜션", location: "경기도 가평군", type: "deal" },
  ];

  const filteredResults = query
    ? mockResults.filter(
        (result) =>
          result.name.toLowerCase().includes(query.toLowerCase()) ||
          result.location.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const showDropdown = isFocused && (query || recentSearches.length > 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.name);
    setIsFocused(false);

    // Add to recent searches
    const newRecent = [
      result.name,
      ...recentSearches.filter((s) => s !== result.name),
    ].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));

    if (onResultClick) {
      onResultClick(result);
    } else {
      toast.success(`"${result.name}" 선택됨`, {
        description: result.location,
      });
    }
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
    if (onSearch) {
      onSearch(search);
    }
  };

  const handleDeleteRecent = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRecent = recentSearches.filter((s) => s !== search);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div
        className={`relative transition-all ${
          isFocused ? "ring-2 ring-[#0077B6]" : ""
        }`}
        style={{ borderRadius: "12px" }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="펜션명, 지역으로 검색"
          className="w-full h-11 pl-12 pr-4 bg-[#F1F5F9] border-2 border-transparent rounded-xl text-sm outline-none transition-all focus:border-[#0077B6]"
        />
        {query && (
          <button
            onClick={() => handleQueryChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
          style={{ borderRadius: "12px" }}
        >
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>최근 검색어</span>
                </div>
                <button
                  onClick={handleClearAll}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  전체 삭제
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentClick(search)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm whitespace-nowrap transition-colors"
                  >
                    <span>{search}</span>
                    <button
                      onClick={(e) => handleDeleteRecent(search, e)}
                      className="hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Autocomplete Results */}
          {query && (
            <div className="p-2">
              {filteredResults.length > 0 ? (
                <>
                  <div className="px-2 py-2 text-xs font-medium text-gray-500">
                    자동완성
                  </div>
                  {filteredResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-left transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-[#E0F2FE] rounded-full flex-shrink-0">
                        <MapPin className="w-4 h-4 text-[#0077B6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {result.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {result.location}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {result.type === "room" ? "객실" : "특가"}
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-3 py-8 text-center text-sm text-gray-500">
                  검색 결과가 없습니다
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Mobile Search Modal
interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
}

export function MobileSearchModal({
  isOpen,
  onClose,
  onSearch,
  onResultClick,
}: MobileSearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <SearchBar onSearch={onSearch} onResultClick={onResultClick} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-sm text-gray-500 text-center py-12">
          검색어를 입력해주세요
        </div>
      </div>
    </div>
  );
}

// Tab Search Bar - Simple search for tab section
interface TabSearchBarProps {
  onChange?: (value: string) => void;
}

export function TabSearchBar({ onChange }: TabSearchBarProps) {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock pension data
  const mockPensions = [
    { name: "늘바다랑 오션뷰펜션", location: "강원도 속초시" },
    { name: "힐링 산장", location: "경기도 가평군" },
    { name: "스카이라운지 호텔", location: "서울 중구" },
    { name: "코지 캐빈 펜션", location: "강원도 평창군" },
    { name: "그랜드 호텔 서울", location: "서울 강남구" },
  ];

  const filteredPensions = value
    ? mockPensions.filter(
        (pension) =>
          pension.name.toLowerCase().includes(value.toLowerCase()) ||
          pension.location.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setIsOpen(newValue.length > 0);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSelectPension = (pension: { name: string; location: string }) => {
    setValue(pension.name);
    setIsOpen(false);
    toast.success(`"${pension.name}" 선택됨`, {
      description: pension.location,
    });
  };

  return (
    <div ref={searchRef} className="relative w-80 hidden lg:block">
      <div
        className={`relative transition-all ${
          isOpen && value ? "bg-white border border-[#0077B6]" : "bg-[#F1F5F9] border border-transparent"
        }`}
        style={{ borderRadius: "10px" }}
      >
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          size={18}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => value && setIsOpen(true)}
          placeholder="펜션명, 지역 검색"
          className="w-full h-10 pl-10 pr-4 bg-transparent outline-none text-sm placeholder:text-[#94A3B8]"
          style={{ fontSize: "14px" }}
        />
      </div>

      {/* Dropdown */}
      {isOpen && filteredPensions.length > 0 && (
        <div
          className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-y-auto z-50"
          style={{ maxHeight: "320px", borderRadius: "12px" }}
        >
          {filteredPensions.map((pension, index) => (
            <button
              key={index}
              onClick={() => handleSelectPension(pension)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-semibold text-sm text-gray-900">
                {pension.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {pension.location}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}