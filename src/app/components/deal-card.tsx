import { useDrag } from 'react-dnd';
import { MapPin, Heart, Star } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import type { Deal } from '@/app/components/deals-page';

interface DealCardProps {
  deal: Deal;
  isFavorite: boolean;
  onToggleFavorite: (dealId: string) => void;
  onClick: (deal: Deal) => void;
}

export function DealCard({ deal, isFavorite, onToggleFavorite, onClick }: DealCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'deal',
    item: { deal },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hotel':
        return 'bg-blue-100 text-blue-700';
      case 'pension':
        return 'bg-green-100 text-green-700';
      case 'motel':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      ref={drag}
      className={`transition-all duration-300 ${
        isDragging ? 'opacity-50 scale-95 rotate-2 shadow-2xl' : 'opacity-100'
      }`}
    >
      <Card
        className="overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-200 cursor-move"
      >
        <div className="relative">
          <img
            src={deal.image}
            alt={deal.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(deal.id);
            }}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform z-10"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-400'
              }`}
            />
          </button>
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-500 text-white">
              {deal.discountRate}% 할인
            </Badge>
          </div>
        </div>

        <div 
          className="p-4 space-y-3 cursor-pointer"
          onClick={() => onClick(deal)}
        >
          {/* Type and Distance */}
          <div className="flex items-center justify-between">
            <Badge className={getTypeColor(deal.type)}>
              {getTypeLabel(deal.type)}
            </Badge>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {deal.distance.toFixed(1)}km
            </span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-lg line-clamp-1">{deal.name}</h3>

          {/* Location */}
          <p className="text-sm text-gray-600 line-clamp-1">{deal.location}</p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{deal.rating}</span>
            <span className="text-xs text-gray-500">({deal.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 line-through">
                {deal.originalPrice.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-600">
                {deal.discountedPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">원</span>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1">
            {deal.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {deal.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{deal.amenities.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}