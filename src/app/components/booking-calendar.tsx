import { useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isPast, isToday as isTodayFn } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import type { Room } from './room-card';
import type { Deal } from './deals-page';

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

interface BookingCalendarProps {
  bookings: Booking[];
  selectedRoomId: string | null;
  onDrop: (roomOrDeal: Room | Deal, date: Date) => void;
  onBookingClick: (booking: Booking) => void;
  onBookingDrag: (booking: Booking, newDate: Date) => void;
  onDateClick?: (date: Date) => void;
}

export function BookingCalendar({
  bookings,
  selectedRoomId,
  onDrop,
  onBookingClick,
  onBookingDrag,
  onDateClick,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [draggedItem, setDraggedItem] = useState<{ type: string; roomId?: string } | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      // Check if date falls within check-in and check-out range
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);
      
      const matchesDate = currentDate >= checkInDate && currentDate < checkOutDate;
      const matchesRoom = !selectedRoomId || booking.roomId === selectedRoomId;
      return matchesDate && matchesRoom;
    });
  };

  const hasBooking = (date: Date, roomId?: string) => {
    return bookings.some((booking) => {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);

      const matchesDate = currentDate >= checkInDate && currentDate < checkOutDate;
      const matchesRoom = !roomId || booking.roomId === roomId;
      return matchesDate && matchesRoom;
    });
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedRoomId && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 border border-blue-200">
          <div className="font-medium mb-1">📌 필터 모드 활성화</div>
          <div>선택한 객실의 예약만 표시됩니다. 날짜를 클릭하여 예약하세요.</div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
          <div
            key={day}
            className={`text-center font-medium py-2 ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}

        {days.map((day) => (
          <DayCell
            key={day.toISOString()}
            date={day}
            bookings={getBookingsForDate(day)}
            selectedRoomId={selectedRoomId}
            draggedItem={draggedItem}
            hasBooking={hasBooking(day, draggedItem?.roomId)}
            onDrop={onDrop}
            onBookingClick={onBookingClick}
            onBookingDrag={onBookingDrag}
            onDateClick={onDateClick}
            onDragStart={setDraggedItem}
            onDragEnd={() => setDraggedItem(null)}
          />
        ))}
      </div>
    </Card>
  );
}

interface DayCellProps {
  date: Date;
  bookings: Booking[];
  selectedRoomId: string | null;
  draggedItem: { type: string; roomId?: string } | null;
  hasBooking: boolean;
  onDrop: (roomOrDeal: Room | Deal, date: Date) => void;
  onBookingClick: (booking: Booking) => void;
  onBookingDrag: (booking: Booking, newDate: Date) => void;
  onDateClick?: (date: Date) => void;
  onDragStart: (item: { type: string; roomId?: string }) => void;
  onDragEnd: () => void;
}

function DayCell({ 
  date, 
  bookings, 
  selectedRoomId, 
  draggedItem,
  hasBooking,
  onDrop, 
  onBookingClick, 
  onBookingDrag, 
  onDateClick,
  onDragStart,
  onDragEnd
}: DayCellProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['ROOM', 'BOOKING', 'deal'],
    drop: (item: { room?: Room; booking?: Booking; deal?: Deal }) => {
      if (item.room) {
        onDrop(item.room, date);
      } else if (item.deal) {
        onDrop(item.deal, date);
      } else if (item.booking) {
        onBookingDrag(item.booking, date);
      }
      onDragEnd();
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isToday = isSameDay(date, new Date());
  const isPastDate = isPast(date) && !isTodayFn(date);
  const dayOfWeek = date.getDay(); // 0 = 일요일, 6 = 토요일
  
  // 날짜 색상 결정
  const getDateColor = () => {
    if (isToday) return 'text-blue-600 font-bold';
    if (dayOfWeek === 0) return 'text-red-600'; // 일요일
    if (dayOfWeek === 6) return 'text-blue-600'; // 토요일
    return 'text-gray-700';
  };

  // 드래그 중 실시간 피드백
  const getDragFeedbackClass = () => {
    if (!isOver || !draggedItem) return '';
    
    // 과거 날짜 체크
    if (isPastDate) {
      return 'drop-target-invalid';
    }
    
    // 이미 예약된 날짜 체크
    if (hasBooking) {
      return 'drop-target-invalid';
    }
    
    return 'drop-target-valid';
  };

  // 주말/공휴일 배경
  const getBackgroundClass = () => {
    if (dayOfWeek === 0) return 'sunday';
    if (dayOfWeek === 6) return 'saturday';
    return '';
  };

  return (
    <div
      ref={drop}
      className={`calendar-cell min-h-16 p-1.5 border rounded-lg transition-colors ${
        isOver && canDrop ? 'bg-blue-100 border-blue-300' : 'bg-white'
      } ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'} ${
        isPastDate ? 'opacity-50' : ''
      } ${getBackgroundClass()} ${getDragFeedbackClass()}`}
      onClick={() => onDateClick && onDateClick(date)}
    >
      <div className={`text-xs font-medium mb-0.5 ${getDateColor()}`}>
        {format(date, 'd')}
      </div>
      <div className="space-y-0.5">
        {bookings.map((booking) => (
          <BookingEvent
            key={booking.id}
            booking={booking}
            onClick={() => onBookingClick(booking)}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}

interface BookingEventProps {
  booking: Booking;
  onClick: () => void;
  onDragStart: (item: { type: string; roomId?: string }) => void;
}

function BookingEvent({ booking, onClick, onDragStart }: BookingEventProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'BOOKING',
    item: { booking },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onClick={onClick}
      onDragStart={() => onDragStart({ type: 'BOOKING', roomId: booking.roomId })}
      className={`text-[10px] p-1 text-white rounded cursor-move transition-all hover:scale-105 hover:brightness-110 ${
        isDragging ? 'opacity-50 scale-95 rotate-1 shadow-lg' : 'opacity-100'
      }`}
      style={{ 
        backgroundColor: booking.color || '#3b82f6',
        filter: 'brightness(1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = 'brightness(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = 'brightness(1)';
      }}
    >
      <div className="font-medium truncate leading-tight">{booking.roomName}</div>
      <div className="truncate leading-tight">{booking.guestName}</div>
    </div>
  );
}