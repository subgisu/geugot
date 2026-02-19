import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Badge } from '@/app/components/ui/badge';
import { Bell, Tag, MapPin, Trash2 } from 'lucide-react';
import type { Notification } from '@/app/types';

export type { Notification };

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onDelete,
  onClearAll,
}: NotificationsModalProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_deal':
        return <Tag className="w-5 h-5 text-blue-500" />;
      case 'price_drop':
        return <Tag className="w-5 h-5 text-red-500" />;
      case 'last_minute':
        return <Bell className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'new_deal':
        return { label: '신규 특가', className: 'bg-blue-100 text-blue-700' };
      case 'price_drop':
        return { label: '가격 인하', className: 'bg-red-100 text-red-700' };
      case 'last_minute':
        return { label: '오늘 특가', className: 'bg-orange-100 text-orange-700' };
      default:
        return { label: '알림', className: 'bg-gray-100 text-gray-700' };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>알림</DialogTitle>
              <DialogDescription>
                {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림` : '모든 알림을 확인했습니다'}
              </DialogDescription>
            </div>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearAll}>
                모두 삭제
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-3 py-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  알림이 없습니다
                </h3>
                <p className="text-gray-500">
                  새로운 특가가 있으면 알려드릴게요!
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const typeBadge = getTypeBadge(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      notification.read
                        ? 'bg-white border-gray-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => !notification.read && onMarkAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge className={typeBadge.className}>
                            {typeBadge.label}
                          </Badge>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(notification.id);
                            }}
                            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="font-medium">{notification.dealName}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {notification.distance}km
                          </span>
                          <span className="font-semibold text-blue-600">
                            {notification.price.toLocaleString()}원
                          </span>
                          <span className="text-red-500">
                            {notification.discount}% 할인
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
