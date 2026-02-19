// ============================================
// 그곳 (Geugot) — Mock 데이터
// ============================================
// App.tsx에서 분리한 더미 데이터입니다.
// Supabase 연동 시 이 파일을 API 호출로 교체합니다.
// ============================================

import type { Room, Deal, Notification } from "@/app/types";

export const ROOMS: Room[] = [
  {
    id: "101",
    name: "101호 - 럭셔리 스위트",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY4OTg4MTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJlZHJvb20lMjBsdXh1cnl8ZW58MXx8fHwxNzY4OTAyOTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJhdGhyb29tfGVufDF8fHx8MTc2ODk4NjY0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    capacity: 4,
    amenities: ["킹사이즈 침대", "개별 욕조", "발코니", "WiFi", "TV", "미니바"],
    price: 350000,
    color: "#3b82f6",
  },
  {
    id: "102",
    name: "102호 - 패밀리룸",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjByb29tfGVufDF8fHx8MTc2ODk4ODEyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGZhbWlseSUyMHJvb218ZW58MXx8fHwxNzY4OTAzMDE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    capacity: 6,
    amenities: ["2개 침대", "샤워실", "주방", "WiFi", "TV", "세탁기"],
    price: 280000,
    color: "#10b981",
  },
  {
    id: "201",
    name: "201호 - 오션뷰",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHZpZXclMjByb29tfGVufDF8fHx8MTc2ODk4ODE0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3Njg5MDMwMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    capacity: 2,
    amenities: ["퀸사이즈 침대", "바다 전망", "발코니", "WiFi", "TV"],
    price: 420000,
    color: "#f59e0b",
  },
  {
    id: "202",
    name: "202호 - 스탠다드",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3Njg5ODgxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    capacity: 2,
    amenities: ["더블 침대", "샤워실", "WiFi", "TV"],
    price: 180000,
    color: "#ef4444",
  },
];

export const MOCK_DEALS: Deal[] = [
  {
    id: "deal-1",
    name: "힐링 산장 펜션",
    type: "pension",
    distance: 2.5,
    originalPrice: 280000,
    discountedPrice: 196000,
    discountRate: 30,
    rating: 4.8,
    reviewCount: 234,
    image:
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBlbnNpb258ZW58MXx8fHwxNzY4OTg4MTc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["BBQ 시설", "산 전망", "주차장", "WiFi"],
    checkInTime: "15:00",
    checkOutTime: "11:00",
    location: "강원도 평창군",
  },
  {
    id: "deal-2",
    name: "오션뷰 리조트",
    type: "hotel",
    distance: 4.2,
    originalPrice: 450000,
    discountedPrice: 315000,
    discountRate: 30,
    rating: 4.9,
    reviewCount: 567,
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHJlc29ydHxlbnwxfHx8fDE3Njg5ODgxODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["수영장", "스파", "레스토랑", "주차장"],
    checkInTime: "14:00",
    checkOutTime: "12:00",
    location: "부산 해운대구",
  },
  {
    id: "deal-3",
    name: "시티 모텔",
    type: "motel",
    distance: 1.8,
    originalPrice: 120000,
    discountedPrice: 84000,
    discountRate: 30,
    rating: 4.5,
    reviewCount: 123,
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RlbCUyMHJvb218ZW58MXx8fHwxNzY4OTg4MTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["무료 주차", "WiFi", "조식 포함"],
    checkInTime: "15:00",
    checkOutTime: "11:00",
    location: "서울 강남구",
  },
  {
    id: "deal-4",
    name: "코지 캐빈 펜션",
    type: "pension",
    distance: 3.5,
    originalPrice: 320000,
    discountedPrice: 224000,
    discountRate: 30,
    rating: 4.7,
    reviewCount: 189,
    image:
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWJpbiUyMHBlbnNpb258ZW58MXx8fHwxNzY4OTg4MjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["벽난로", "정원", "BBQ", "주차장"],
    checkInTime: "16:00",
    checkOutTime: "10:00",
    location: "경기도 가평군",
  },
  {
    id: "deal-5",
    name: "그랜드 호텔 서울",
    type: "hotel",
    distance: 5.0,
    originalPrice: 580000,
    discountedPrice: 406000,
    discountRate: 30,
    rating: 4.9,
    reviewCount: 892,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFuZCUyMGhvdGVsfGVufDF8fHx8MTc2ODk4ODIxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    amenities: ["피트니스", "라운지", "레스토랑", "컨시어지"],
    checkInTime: "15:00",
    checkOutTime: "12:00",
    location: "서울 중구",
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "new_deal",
    title: "신규 특가 알림",
    message: "힐링 산장 펜션에서 새로운 특가를 시작했습니다.",
    dealName: "힐링 산장 펜션",
    price: 196000,
    discount: 30,
    distance: 2.5,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: "2",
    type: "price_drop",
    title: "가격 인하 알림",
    message: "오션뷰 리조트 가격이 인하되었습니다.",
    dealName: "오션뷰 리조트",
    price: 315000,
    discount: 30,
    distance: 4.2,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: "3",
    type: "last_minute",
    title: "오늘 특가",
    message: "시티 모텔 오늘 특가가 시작되었습니다.",
    dealName: "시티 모텔",
    price: 84000,
    discount: 30,
    distance: 1.8,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
];
