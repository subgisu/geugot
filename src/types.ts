// ============================================
// 그곳 (Geugot) — 중앙 타입 정의
// ============================================
// 모든 도메인 타입을 한 곳에서 관리합니다.
// 각 컴포넌트에서 export하던 타입들을 여기로 통합했습니다.
// ============================================

// --- Auth & User ---

export interface UserData {
  name: string;
  email: string;
  phone: string;
  provider: "google" | "naver" | "kakao" | "apple";
  profileImage?: string;
}

export interface UserSettings {
  searchRadius: number; // km
  notificationsEnabled: boolean;
  preferredTypes: {
    hotel: boolean;
    pension: boolean;
    motel: boolean;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

// --- Room & Booking ---

export interface Room {
  id: string;
  name: string;
  images: string[];
  capacity: number;
  amenities: string[];
  price: number;
  color: string;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  contact: string;
  color?: string;
}

export interface RoomSearchFilters {
  keyword: string;
  minCapacity: number;
  maxPrice: number;
  amenities: string[];
}

// --- Deals ---

export interface Deal {
  id: string;
  name: string;
  type: "hotel" | "pension" | "motel";
  distance: number; // km
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  rating: number;
  reviewCount: number;
  image: string;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  location: string;
}

// --- Notifications ---

export interface Notification {
  id: string;
  type: "new_deal" | "price_drop" | "last_minute";
  title: string;
  message: string;
  dealName: string;
  price: number;
  discount: number;
  distance: number;
  timestamp: Date;
  read: boolean;
}

// --- Booking Confirmation ---

export interface BookingConfirmationData {
  bookingNumber: string;
  pensionName: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  guests: string;
  totalPrice: number;
}
