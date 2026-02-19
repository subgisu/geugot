import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Bed,
  Tag,
  Star,
  Settings,
  ChevronDown,
  CalendarIcon,
  Plus,
  DollarSign,
  CheckCircle,
  XCircle,
  User,
  Home,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

interface AdminDashboardProps {
  onSwitchToUserView?: () => void;
}

// Mock data for the dashboard
const MOCK_BOOKINGS = [
  {
    id: "1",
    date: "2026-01-28",
    room: "101호 - 럭셔리 스위트",
    guest: "김철수",
    contact: "010-1234-5678",
    status: "confirmed" as const,
  },
  {
    id: "2",
    date: "2026-01-29",
    room: "201호 - 오션뷰",
    guest: "이영희",
    contact: "010-2345-6789",
    status: "pending" as const,
  },
  {
    id: "3",
    date: "2026-01-30",
    room: "102호 - 패밀리룸",
    guest: "박민수",
    contact: "010-3456-7890",
    status: "confirmed" as const,
  },
  {
    id: "4",
    date: "2026-02-01",
    room: "202호 - 스탠다드",
    guest: "정수현",
    contact: "010-4567-8901",
    status: "pending" as const,
  },
];

const WEEKLY_CALENDAR = [
  {
    day: "일",
    date: 26,
    bookings: [
      { room: "101호", status: "confirmed" as const },
      { room: "201호", status: "confirmed" as const },
    ],
  },
  {
    day: "월",
    date: 27,
    bookings: [{ room: "102호", status: "pending" as const }],
  },
  {
    day: "화",
    date: 28,
    bookings: [
      { room: "101호", status: "confirmed" as const },
      { room: "201호", status: "confirmed" as const },
      { room: "102호", status: "pending" as const },
    ],
  },
  {
    day: "수",
    date: 29,
    bookings: [{ room: "201호", status: "confirmed" as const }],
  },
  {
    day: "목",
    date: 30,
    bookings: [
      { room: "102호", status: "confirmed" as const },
      { room: "202호", status: "pending" as const },
    ],
  },
  {
    day: "금",
    date: 31,
    bookings: [],
  },
  {
    day: "토",
    date: 1,
    bookings: [
      { room: "101호", status: "confirmed" as const },
      { room: "201호", status: "confirmed" as const },
    ],
  },
];

export function AdminDashboard({ onSwitchToUserView }: AdminDashboardProps) {
  const [activeMenu, setActiveMenu] = useState("대시보드");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-[240px] bg-[#0F172A] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Home className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold">그곳</h1>
          </div>

          {/* Pension Selector */}
          <button className="w-full bg-slate-800 hover:bg-slate-700 rounded-lg p-3 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Bed className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">늘바다랑 오션뷰펜션</span>
            </div>
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3">
          {[
            { icon: LayoutDashboard, label: "대시보드" },
            { icon: Calendar, label: "예약 관리" },
            { icon: Bed, label: "객실 관리" },
            { icon: Tag, label: "특가 등록" },
            { icon: Star, label: "후기 관리" },
            { icon: Settings, label: "설정" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeMenu === item.label
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info at Bottom */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-600 text-white">
                관
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">관리자</p>
              <p className="text-xs text-slate-400 truncate">admin@pension.com</p>
            </div>
          </div>
          {onSwitchToUserView && (
            <button
              onClick={onSwitchToUserView}
              className="w-full mt-3 text-xs text-slate-400 hover:text-white transition-colors text-left"
            >
              ← 사용자 뷰로 전환
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h2>
            <p className="text-gray-600">2026년 1월 30일 (금)</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  전체 객실
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">5</div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700">
                  운영 중
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">4</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-700">
                  오늘 예약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">2</div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-amber-700">
                  점유율
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-700">50%</div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Calendar Preview */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle>주간 캘린더 미리보기</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  전체 캘린더 보기
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-4">
                {WEEKLY_CALENDAR.map((day, index) => (
                  <div
                    key={index}
                    className="text-center"
                  >
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {day.day}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-3">
                      {day.date}
                    </div>
                    <div className="space-y-1">
                      {day.bookings.map((booking, idx) => (
                        <div
                          key={idx}
                          className={`h-6 rounded text-xs flex items-center justify-center font-medium ${
                            booking.status === "confirmed"
                              ? "bg-blue-500 text-white"
                              : "bg-amber-400 text-amber-900"
                          }`}
                        >
                          {booking.room.split("-")[0].trim()}
                        </div>
                      ))}
                      {day.bookings.length === 0 && (
                        <div className="h-6 rounded bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-400">-</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings Table */}
          <Card className="mb-8">
            <CardHeader className="border-b">
              <CardTitle>최근 예약</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>예약일</TableHead>
                    <TableHead>객실</TableHead>
                    <TableHead>예약자</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_BOOKINGS.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.date}
                      </TableCell>
                      <TableCell>{booking.room}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {booking.guest}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {booking.contact}
                      </TableCell>
                      <TableCell>
                        {booking.status === "confirmed" ? (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            예약확정
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                            대기중
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {booking.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-300 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              확정
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            취소
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">빠른 작업</h3>
            <div className="grid grid-cols-3 gap-4">
              <Button
                className="h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" />
                <span className="font-semibold">예약 추가</span>
              </Button>
              <Button
                className="h-24 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center gap-2"
              >
                <Bed className="w-6 h-6" />
                <span className="font-semibold">객실 추가</span>
              </Button>
              <Button
                className="h-24 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center justify-center gap-2"
              >
                <DollarSign className="w-6 h-6" />
                <span className="font-semibold">가격 수정</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
