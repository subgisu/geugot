import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, Star, Clock } from 'lucide-react';
import type { Deal } from './deals-page';

interface DealDetailModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DealDetailModal({ deal, isOpen, onClose }: DealDetailModalProps) {
  if (!deal) return null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hotel':
        return '호텔';
      case 'pension':
        return '펜션';
      case 'motel':
        return '모텔';
      default:
        return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{deal.name}</DialogTitle>
          <DialogDescription>{deal.location}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative">
            <img
              src={deal.image}
              alt={deal.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white text-base px-3 py-1">
                {deal.discountRate}% 특가
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Badge>{getTypeLabel(deal.type)}</Badge>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{deal.distance.toFixed(1)}km 거리</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{deal.rating}</span>
              <span className="text-gray-500">({deal.reviewCount}개 리뷰)</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>
                {deal.checkInTime} ~ {deal.checkOutTime}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-gray-600 line-through mb-1">
                  정상가 {deal.originalPrice.toLocaleString()}원
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {deal.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-600">원</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">절약</p>
                <p className="text-xl font-bold text-red-500">
                  {(deal.originalPrice - deal.discountedPrice).toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h4 className="font-semibold mb-2">편의시설</h4>
            <div className="flex flex-wrap gap-2">
              {deal.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Booking Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 예약하려면 특가 카드를 드래그하여 달력의 원하는 날짜에 놓아주세요.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}