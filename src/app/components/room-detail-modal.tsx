import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Room } from './room-card';

interface RoomDetailModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoomDetailModal({ room, isOpen, onClose }: RoomDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  if (!room) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{room.name}</DialogTitle>
          <DialogDescription>객실 상세 정보</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative group">
            <img
              src={room.images[currentImageIndex]}
              alt={room.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            {/* Previous Image Button */}
            {room.images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
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
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
            
            {/* Image Indicator Dots */}
            {room.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {room.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">수용 인원</h4>
              <p className="text-gray-600">최대 {room.capacity}인</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">1박 요금</h4>
              <p className="text-gray-600">₩{room.price.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">편의시설</h4>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 예약하려면 객실 카드를 드래그하여 원하는 날짜에 놓아주세요.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}