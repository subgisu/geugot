import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Card, CardContent } from '@/app/components/ui/card';
import { Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import type { Room } from '@/app/types';

export type { Room };

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: () => void;
  onInfoClick: () => void;
}

export function RoomCard({ room, isSelected, isDimmed, onSelect, onInfoClick }: RoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Adaptive Booking Mode: 필터 활성화 시 드래그 비활성화
  const isDragEnabled = !isSelected;
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ROOM',
    item: { room },
    canDrag: isDragEnabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <div
      ref={isDragEnabled ? drag : null}
      className={`room-card transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-95 rotate-2 shadow-2xl' : 'opacity-100'
      } ${isDimmed ? 'filtered-out' : isSelected ? 'filtered-in' : ''} ${
        isSelected && !isDragEnabled ? 'drag-disabled' : ''
      }`}
    >
      <Card
        className={`${
          isDragEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
        } hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border-l-4 ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        }`}
        style={{ borderLeftColor: room.color }}
      >
        <CardContent className="p-0">
          <div className="relative group" onClick={onSelect}>
            <img
              src={room.images[currentImageIndex]}
              alt={room.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            
            {/* Drag Indicator - 필터 모드에서는 숨김 */}
            {isDragEnabled && (
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                드래그하여 예약
              </div>
            )}
            
            {/* Click Indicator - 필터 모드에서만 표시 */}
            {isSelected && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <span>✓</span> 선택됨 - 날짜 클릭 예약
              </div>
            )}
            
            {/* Previous Image Button */}
            {room.images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            
            {/* Next Image Button */}
            {room.images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
            
            {/* Info Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick();
              }}
            >
              <Info className="h-4 w-4" />
            </Button>
            
            {/* Image Indicator Dots */}
            {room.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {room.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">{room.name}</h3>
            <p className="text-sm text-gray-600">최대 {room.capacity}인</p>
            <p className="text-sm font-medium mt-2">₩{room.price.toLocaleString()}/박</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}