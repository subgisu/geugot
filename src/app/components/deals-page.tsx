import { useState } from 'react';
import { MapPin, Search, SlidersHorizontal, Heart, Star } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { DealCard } from '@/app/components/deal-card';

export interface Deal {
  id: string;
  name: string;
  type: 'hotel' | 'pension' | 'motel';
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

interface DealsPageProps {
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
  searchRadius: number;
}

export function DealsPage({ deals, onDealClick, searchRadius }: DealsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'hotel' | 'pension' | 'motel'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || deal.type === selectedType;
    const withinRadius = deal.distance <= searchRadius;
    return matchesSearch && matchesType && withinRadius;
  });

  const toggleFavorite = (dealId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dealId)) {
      newFavorites.delete(dealId);
    } else {
      newFavorites.add(dealId);
    }
    setFavorites(newFavorites);
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">주변 특가</h2>
            <p className="text-sm text-gray-500 mt-1">
              <MapPin className="inline w-4 h-4 mr-1" />
              반경 {searchRadius}km 내 {filteredDeals.length}개 특가
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <input
            type="text"
            placeholder="숙소명 또는 지역 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            전체
          </Button>
          <Button
            variant={selectedType === 'hotel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('hotel')}
          >
            호텔
          </Button>
          <Button
            variant={selectedType === 'pension' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('pension')}
          >
            펜션
          </Button>
          <Button
            variant={selectedType === 'motel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('motel')}
          >
            모텔
          </Button>
        </div>
      </div>

      {/* Deals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {filteredDeals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            isFavorite={favorites.has(deal.id)}
            onToggleFavorite={toggleFavorite}
            onClick={onDealClick}
          />
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-500">
            검색 조건을 변경하거나 검색 반경을 넓혀보세요
          </p>
        </div>
      )}
    </div>
  );
}