import { isSameDay, format } from "date-fns";
import { ko } from "date-fns/locale";
import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { MapPin, X, Search as SearchIcon } from "lucide-react";
import { RoomCard } from "@/app/components/room-card";
import { BookingCalendar } from "@/app/components/booking-calendar";
import { RoomDetailModal } from "@/app/components/room-detail-modal";
import { BookingFormModal } from "@/app/components/booking-form-modal";
import { BookingEditModal } from "@/app/components/booking-edit-modal";
import { DealsPage } from "@/app/components/deals-page";
import { LoginModal } from "@/app/components/login-modal";
import { UserProfile } from "@/app/components/user-profile";
import { SettingsModal } from "@/app/components/settings-modal";
import {
  SearchBar,
  MobileSearchModal,
  TabSearchBar,
} from "@/app/components/search-bar";
import {
  NotificationsModal,
  type Notification,
} from "@/app/components/notifications-modal";
import { DealDetailModal } from "@/app/components/deal-detail-modal";
import {
  RoomSearch,
  type RoomSearchFilters,
} from "@/app/components/room-search";
import { BookingConfirmation } from "@/app/components/booking-confirmation";
import { AdminDashboard } from "@/app/components/admin-dashboard";
import { MyPage } from "@/app/components/my-page";
import { ProfileEditModal } from "@/app/components/profile-edit-modal";
import { useDragEdgeCases } from "@/app/hooks/useDragEdgeCases";
import { useThrottle } from "@/app/hooks/useThrottle";
import { useIdempotency } from "@/app/hooks/useIdempotency";
import { Toaster, toast } from "sonner";
import type {
  Room,
  Booking,
  UserData,
  UserSettings,
  Deal,
} from "@/app/types";

// Mock room data
const ROOMS: Room[] = [
  {
    id: "101",
    name: "101호 - 럭셔리 스위트",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY4OTg4MTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJlZHJvb20lMjBsdXh1cnl8ZW58MXx8fHwxNzY4OTAyOTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJhdGhyb29tfGVufDF8fHx8MTc2ODk4NjY0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    capacity: 4,
    amenities: [
      "킹사이즈 침대",
      "개별 욕조",
      "발코니",
      "WiFi",
      "TV",
      "미니바",
    ],
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
    amenities: [
      "2개 침대",
      "샤워실",
      "주방",
      "WiFi",
      "TV",
      "세탁기",
    ],
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
    amenities: [
      "퀸사이즈 침대",
      "바다 전망",
      "발코니",
      "WiFi",
      "TV",
    ],
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

// Mock deals data
const MOCK_DEALS: Deal[] = [
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

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
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

export default function App() {
  // Auth state
  const [user, setUser] = useState<UserData | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileSearch, setShowMobileSearch] =
    useState(false);
  const [isAdminView, setIsAdminView] = useState(false); // Changed back to false to show user view by default

  // Settings state
  const [settings, setSettings] = useState<UserSettings>({
    searchRadius: 5,
    notificationsEnabled: true,
    preferredTypes: {
      hotel: true,
      pension: true,
      motel: true,
    },
    priceRange: {
      min: 0,
      max: 500000,
    },
  });

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<
    string | null
  >(null);
  const [mobileCalendarOpen, setMobileCalendarOpen] =
    useState(false);

  // Room search filters
  const [roomFilters, setRoomFilters] =
    useState<RoomSearchFilters>({
      keyword: "",
      minCapacity: 1,
      maxPrice: 500000,
      amenities: [],
    });

  // Deals state
  const [deals] = useState<Deal[]>(MOCK_DEALS);
  const [notifications, setNotifications] = useState<
    Notification[]
  >(MOCK_NOTIFICATIONS);

  // Modal states
  const [roomDetailModal, setRoomDetailModal] = useState<{
    isOpen: boolean;
    room: Room | null;
  }>({
    isOpen: false,
    room: null,
  });
  const [bookingFormModal, setBookingFormModal] = useState<{
    isOpen: boolean;
    room: Room | null;
    date: Date | null;
  }>({
    isOpen: false,
    room: null,
    date: null,
  });
  const [bookingEditModal, setBookingEditModal] = useState<{
    isOpen: boolean;
    booking: Booking | null;
  }>({
    isOpen: false,
    booking: null,
  });
  const [showSettingsModal, setShowSettingsModal] =
    useState(false);
  const [showNotificationsModal, setShowNotificationsModal] =
    useState(false);
  const [dealDetailModal, setDealDetailModal] = useState<{
    isOpen: boolean;
    deal: Deal | null;
  }>({
    isOpen: false,
    deal: null,
  });

  // Booking confirmation state
  const [showBookingConfirmation, setShowBookingConfirmation] =
    useState(false);
  const [confirmedBookingData, setConfirmedBookingData] =
    useState<{
      bookingNumber: string;
      pensionName: string;
      roomName: string;
      checkIn: Date;
      checkOut: Date;
      guests: string;
      totalPrice: number;
    } | null>(null);

  // Profile edit modal state
  const [showProfileEditModal, setShowProfileEditModal] =
    useState(false);

  // Edge Case Hooks
  const { throttleAsync } = useThrottle({
    interval: 1000,
    showWarning: true,
    warningMessage: "너무 빠릅니다. 잠시 후 다시 시도해주세요",
  });

  const { executeOnce, generateKey } = useIdempotency();

  const { isDragging, setIsDragging } = useDragEdgeCases({
    onCancel: () => {
      toast.info("드래그가 취소되었습니다", { icon: "↩️" });
    },
    enabled: true,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Auth handlers
  const handleLogin = (
    provider: "google" | "naver" | "kakao",
  ) => {
    // Mock login - in real app, this would integrate with actual OAuth
    const mockUser: UserData = {
      name:
        provider === "google"
          ? "김철수"
          : provider === "naver"
            ? "이영희"
            : "박민수",
      email: `user@${provider}.com`,
      phone: "010-1234-5678",
      provider,
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    setShowLoginModal(false);
    toast.success(
      `${provider === "google" ? "구글" : provider === "naver" ? "네이버" : "카카오"}로 로그했습니다`,
    );
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("로그아웃했습니다");
  };

  const handleGuestBooking = () => {
    setShowLoginModal(false);
    toast.info("비회원 예약 모드", {
      description: "이메일과 전화번호를 입력해주세요",
    });
    // In a real app, this would show a guest booking form
  };

  const handleSaveProfile = (name: string, phone: string) => {
    if (user) {
      const updatedUser = { ...user, name, phone };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("프로필이 저장되었습니다");
    }
  };

  const handleDeleteAccount = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("회원 탈퇴가 완료되었습니다");
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem(
      "settings",
      JSON.stringify(newSettings),
    );
    toast.success("설정이 저장되었습니다");
  };

  // Notification handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast.success("알림을 삭제했습니다");
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    toast.success("모든 알림을 삭제했습니다");
  };

  // Check if a date already has a booking for the room
  const hasBooking = (roomId: string, date: Date) => {
    return bookings.some((booking) => {
      if (booking.roomId !== roomId) return false;

      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);

      return (
        currentDate >= checkInDate && currentDate < checkOutDate
      );
    });
  };

  // Handle room card click for filtering
  const handleRoomSelect = (roomId: string) => {
    if (selectedRoomId === roomId) {
      setSelectedRoomId(null);
      setMobileCalendarOpen(false);
    } else {
      setSelectedRoomId(roomId);
      setMobileCalendarOpen(true);
    }
  };

  // Handle info icon click
  const handleInfoClick = (room: Room) => {
    setRoomDetailModal({ isOpen: true, room });
  };

  // Handle room drop on calendar
  const handleRoomDrop = (
    roomOrDeal: Room | Deal,
    date: Date,
  ) => {
    // Check if it's a Deal (has 'type' property with 'hotel' | 'pension' | 'motel')
    const isDeal =
      "type" in roomOrDeal &&
      ["hotel", "pension", "motel"].includes(roomOrDeal.type);

    if (isDeal) {
      // Handle deal drop
      const deal = roomOrDeal as Deal;
      setBookingFormModal({
        isOpen: true,
        room: {
          id: deal.id,
          name: deal.name,
          images: [deal.image],
          capacity: 2,
          amenities: deal.amenities,
          price: deal.discountedPrice,
          color: "#3b82f6",
        },
        date,
      });
    } else {
      // Handle room drop
      const room = roomOrDeal as Room;

      // Edge Case 1: 필터링 모드에서는 드래그가 비활성화되어야 함
      if (selectedRoomId && room.id !== selectedRoomId) {
        toast.error(
          "필터링 모드에서는 선택한 객실만 예약할 수 있습니다",
        );
        return;
      }

      // Edge Case 2: 과거 날짜 체크
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dropDate = new Date(date);
      dropDate.setHours(0, 0, 0, 0);

      if (dropDate < today) {
        toast.error("과거 날짜는 예약할 수 없습니다", {
          description: "오늘 이후의 날짜를 선택해주세요",
        });
        return;
      }

      // Edge Case 3: 중복 예약 체크
      if (hasBooking(room.id, date)) {
        toast.error("이미 예약 날짜입니다", {
          description: "다른 날짜를 선택해주세요",
          action: {
            label: "예약 가능한 날짜 보기",
            onClick: () => {
              // 스크롤을 캘린더로 이동
              const calendarEl = document.querySelector(
                ".booking-calendar",
              );
              calendarEl?.scrollIntoView({
                behavior: "smooth",
              });
            },
          },
        });
        return;
      }

      setBookingFormModal({ isOpen: true, room, date });
    }
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    // Edge Case 4: 필터 없이 날짜 클릭 시 안내
    if (!selectedRoomId) {
      toast.info("먼저 객실을 선택해주세요", {
        description:
          "좌���에서 원하는 객실을 클릭한 후 날짜를 선택하세요",
      });
      return;
    }

    const room = ROOMS.find((r) => r.id === selectedRoomId);
    if (!room) return;

    // Edge Case 5: 과거 날짜 클릭
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickDate = new Date(date);
    clickDate.setHours(0, 0, 0, 0);

    if (clickDate < today) {
      toast.warning("과거 날짜는 예약할 수 없습니다");
      return;
    }

    // Edge Case 6: 중복 예약 체크
    if (hasBooking(room.id, date)) {
      toast.error("이미 예약된 날짜입니다", {
        description: `${room.name}은(는) 이미 예약되어 있습니다`,
      });
      return;
    }

    setBookingFormModal({ isOpen: true, room, date });
  };

  // Handle booking form submission
  const handleBookingSubmit = (
    guestName: string,
    contact: string,
    checkIn: Date,
    checkOut: Date,
  ) => {
    if (!bookingFormModal.room) return;

    // Edge Case 7: 체크인/체크아웃 날짜 검증
    if (checkIn >= checkOut) {
      toast.error(
        "체크아웃 날짜는 체크인 날짜보다 이후여야 합니다",
      );
      return;
    }

    // Edge Case 8: 예약 기간 중 다른 예약과 겹치는지 확인
    const hasConflict = bookings.some((booking) => {
      if (booking.roomId !== bookingFormModal.room!.id)
        return false;

      const existingCheckIn = new Date(booking.checkIn);
      const existingCheckOut = new Date(booking.checkOut);
      existingCheckIn.setHours(0, 0, 0, 0);
      existingCheckOut.setHours(0, 0, 0, 0);

      const newCheckIn = new Date(checkIn);
      const newCheckOut = new Date(checkOut);
      newCheckIn.setHours(0, 0, 0, 0);
      newCheckOut.setHours(0, 0, 0, 0);

      // 겹치는 구간 확인
      return (
        (newCheckIn >= existingCheckIn &&
          newCheckIn < existingCheckOut) ||
        (newCheckOut > existingCheckIn &&
          newCheckOut <= existingCheckOut) ||
        (newCheckIn <= existingCheckIn &&
          newCheckOut >= existingCheckOut)
      );
    });

    if (hasConflict) {
      toast.error("예약 기간 중 다른 예약과 겹칩니다", {
        description: "다른 날짜를 선택해주세요",
      });
      return;
    }

    const newBooking: Booking = {
      id: Date.now().toString(),
      roomId: bookingFormModal.room.id,
      roomName: bookingFormModal.room.name,
      checkIn,
      checkOut,
      guestName,
      contact,
      color: bookingFormModal.room.color,
    };

    // Generate a user-friendly booking number
    const date = new Date();
    const dateStr = format(date, "yyyyMMdd");
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const bookingNumber = `GG-${dateStr}-${randomNum}`;

    setBookings([...bookings, newBooking]);
    setBookingFormModal({
      isOpen: false,
      room: null,
      date: null,
    });
    toast.success("예약이 완료되었습니다", {
      description: `${guestName}님의 예약이 확정되었습니다`,
    });
    // Booking confirmation data setting
    setConfirmedBookingData({
      bookingNumber: bookingNumber,
      pensionName: bookingFormModal.room.name,
      roomName: bookingFormModal.room.name,
      checkIn: newBooking.checkIn,
      checkOut: newBooking.checkOut,
      guests: guestName,
      totalPrice:
        (bookingFormModal.room.price *
          (newBooking.checkOut.getTime() -
            newBooking.checkIn.getTime())) /
        (1000 * 60 * 60 * 24),
    });
    setShowBookingConfirmation(true);
  };

  // Handle booking click for editing
  const handleBookingClick = (booking: Booking) => {
    setBookingEditModal({ isOpen: true, booking });
  };

  // Handle booking update
  const handleBookingUpdate = (
    guestName: string,
    contact: string,
    checkIn: Date,
    checkOut: Date,
  ) => {
    if (!bookingEditModal.booking) return;

    setBookings(
      bookings.map((b) =>
        b.id === bookingEditModal.booking!.id
          ? { ...b, guestName, contact, checkIn, checkOut }
          : b,
      ),
    );
    setBookingEditModal({ isOpen: false, booking: null });
    toast.success("예약 정보가 수정되었습니다");
  };

  // Handle booking cancellation
  const handleBookingCancel = () => {
    if (!bookingEditModal.booking) return;

    setBookings(
      bookings.filter(
        (b) => b.id !== bookingEditModal.booking!.id,
      ),
    );
    setBookingEditModal({ isOpen: false, booking: null });
    toast.success("예약이 취소되었습니다");
  };

  // Handle booking drag to new date
  const handleBookingDrag = (
    booking: Booking,
    newDate: Date,
  ) => {
    if (isSameDay(booking.checkIn, newDate)) return;

    if (hasBooking(booking.roomId, newDate)) {
      toast.error("이미 예약된 날짜입니다");
      return;
    }

    if (confirm(`예약 날짜를 변경하시겠습니까?`)) {
      const daysDiff = Math.ceil(
        (booking.checkOut.getTime() -
          booking.checkIn.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const newCheckOut = new Date(newDate);
      newCheckOut.setDate(newCheckOut.getDate() + daysDiff);

      setBookings(
        bookings.map((b) =>
          b.id === booking.id
            ? { ...b, checkIn: newDate, checkOut: newCheckOut }
            : b,
        ),
      );
      toast.success("예약 날짜가 변경되었습니다");
    }
  };

  const unreadNotificationCount = notifications.filter(
    (n) => !n.read,
  ).length;

  // Filter rooms based on search filters
  const filteredRooms = ROOMS.filter((room) => {
    // Keyword filter
    const matchesKeyword =
      roomFilters.keyword === "" ||
      room.name
        .toLowerCase()
        .includes(roomFilters.keyword.toLowerCase()) ||
      room.amenities.some((amenity) =>
        amenity
          .toLowerCase()
          .includes(roomFilters.keyword.toLowerCase()),
      );

    // Capacity filter
    const matchesCapacity =
      room.capacity >= roomFilters.minCapacity;

    // Price filter
    const matchesPrice = room.price <= roomFilters.maxPrice;

    // Amenities filter
    const matchesAmenities =
      roomFilters.amenities.length === 0 ||
      roomFilters.amenities.every((amenity) =>
        room.amenities.includes(amenity),
      );

    return (
      matchesKeyword &&
      matchesCapacity &&
      matchesPrice &&
      matchesAmenities
    );
  });

  // Handle room search
  const handleRoomSearch = (filters: RoomSearchFilters) => {
    setRoomFilters(filters);
  };

  // Show login modal if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              숙소 예약 시스템
            </h1>
            <p className="text-gray-600">
              주변 특가 숙소를 찾고 간편하게 예약하세요
            </p>
          </div>
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            로그인하고 시작하기
          </button>
        </div>
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onGuestBooking={handleGuestBooking}
        />
      </div>
    );
  }

  // Show admin dashboard if in admin view
  if (isAdminView) {
    return (
      <>
        <AdminDashboard
          onSwitchToUserView={() => setIsAdminView(false)}
        />
        <Toaster />
      </>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
            {/* LEFT: Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <MapPin
                className="w-6 h-6"
                style={{ color: "#0077B6" }}
              />
              <h1
                className="text-2xl font-bold"
                style={{ color: "#0077B6" }}
              >
                그곳
              </h1>
            </div>

            {/* CENTER: Search Bar - Desktop */}
            <div className="hidden lg:block flex-1 max-w-[480px]">
              <SearchBar />
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <SearchIcon className="w-5 h-5 text-gray-700" />
            </button>

            {/* RIGHT: Notifications & User Profile */}
            <div className="ml-auto">
              <UserProfile
                user={user}
                notificationCount={unreadNotificationCount}
                onSettingsClick={() =>
                  setShowSettingsModal(true)
                }
                onNotificationsClick={() =>
                  setShowNotificationsModal(true)
                }
                onLogout={handleLogout}
                onAdminClick={() => setIsAdminView(true)}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          <Tabs defaultValue="booking" className="w-full">
            {/* Tabs Header with Search */}
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid grid-cols-3 w-full max-w-[480px]">
                <TabsTrigger value="booking">
                  예약 관리
                </TabsTrigger>
                <TabsTrigger value="deals">
                  주변 특가
                </TabsTrigger>
                <TabsTrigger value="mypage">마이</TabsTrigger>
              </TabsList>

              <TabSearchBar />
            </div>

            {/* Booking Management Tab */}
            <TabsContent value="booking">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Room Cards */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    객실 목록
                    {filteredRooms.length < ROOMS.length && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({filteredRooms.length}/{ROOMS.length}
                        개)
                      </span>
                    )}
                  </h2>
                  <div className="space-y-4">
                    {filteredRooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        isSelected={selectedRoomId === room.id}
                        isDimmed={
                          selectedRoomId !== null &&
                          selectedRoomId !== room.id
                        }
                        onSelect={() =>
                          handleRoomSelect(room.id)
                        }
                        onInfoClick={() =>
                          handleInfoClick(room)
                        }
                      />
                    ))}
                    {filteredRooms.length === 0 && (
                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-sm">
                          검색 조건에 맞는 객실이 없습니다
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Calendar - Desktop only */}
                <div className="hidden lg:block">
                  <h2 className="text-xl font-semibold mb-4">
                    예약 현황
                  </h2>
                  <BookingCalendar
                    bookings={bookings}
                    selectedRoomId={selectedRoomId}
                    onDrop={handleRoomDrop}
                    onBookingClick={handleBookingClick}
                    onBookingDrag={handleBookingDrag}
                    onDateClick={handleDateClick}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Deals Tab */}
            <TabsContent value="deals">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Deals List */}
                <div>
                  <DealsPage
                    deals={deals}
                    onDealClick={(deal) =>
                      setDealDetailModal({ isOpen: true, deal })
                    }
                    searchRadius={settings.searchRadius}
                  />
                </div>

                {/* Right: Calendar - Desktop only */}
                <div className="hidden lg:block">
                  <h2 className="text-xl font-semibold mb-4">
                    예약 현황
                  </h2>
                  <BookingCalendar
                    bookings={bookings}
                    selectedRoomId={null}
                    onDrop={handleRoomDrop}
                    onBookingClick={handleBookingClick}
                    onBookingDrag={handleBookingDrag}
                    onDateClick={handleDateClick}
                  />
                </div>
              </div>
            </TabsContent>

            {/* My Page Tab */}
            <TabsContent value="mypage">
              <MyPage
                user={user}
                bookingCount={bookings.length}
                wishlistCount={0}
                onEditProfile={() =>
                  setShowProfileEditModal(true)
                }
                onNotificationSettings={() =>
                  setShowNotificationsModal(true)
                }
                onViewBookings={() =>
                  toast.info("예약 내역 페이지로 이동합니다")
                }
                onViewWishlist={() =>
                  toast.info("찜 목록 페이지로 이동합니다")
                }
                onCustomerSupport={() =>
                  toast.info("고객센터로 연결합니다")
                }
                onLogout={handleLogout}
                onDeleteAccount={handleDeleteAccount}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Mobile Calendar Modal */}
      {mobileCalendarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                예약 현황
              </h2>
              <button
                onClick={() => {
                  setMobileCalendarOpen(false);
                  setSelectedRoomId(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <BookingCalendar
                bookings={bookings}
                selectedRoomId={selectedRoomId}
                onDrop={handleRoomDrop}
                onBookingClick={handleBookingClick}
                onBookingDrag={handleBookingDrag}
                onDateClick={handleDateClick}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <MobileSearchModal
        isOpen={showMobileSearch}
        onClose={() => setShowMobileSearch(false)}
      />
      <RoomDetailModal
        room={roomDetailModal.room}
        isOpen={roomDetailModal.isOpen}
        onClose={() =>
          setRoomDetailModal({ isOpen: false, room: null })
        }
      />
      <BookingFormModal
        room={bookingFormModal.room}
        date={bookingFormModal.date}
        isOpen={bookingFormModal.isOpen}
        onClose={() =>
          setBookingFormModal({
            isOpen: false,
            room: null,
            date: null,
          })
        }
        onSubmit={handleBookingSubmit}
      />
      <BookingEditModal
        booking={bookingEditModal.booking}
        isOpen={bookingEditModal.isOpen}
        onClose={() =>
          setBookingEditModal({ isOpen: false, booking: null })
        }
        onUpdate={handleBookingUpdate}
        onCancel={handleBookingCancel}
      />
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
      <NotificationsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
      />
      <DealDetailModal
        deal={dealDetailModal.deal}
        isOpen={dealDetailModal.isOpen}
        onClose={() =>
          setDealDetailModal({ isOpen: false, deal: null })
        }
      />
      <BookingConfirmation
        isOpen={showBookingConfirmation}
        onClose={() => setShowBookingConfirmation(false)}
        data={confirmedBookingData}
      />
      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        user={user}
        onSave={handleSaveProfile}
      />
      <Toaster />
    </DndProvider>
  );
}