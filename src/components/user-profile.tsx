import { useState } from 'react';
import { User, Settings, LogOut, Bell, Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import type { UserData } from '@/app/types';

export type { UserData };

interface UserProfileProps {
  user: UserData;
  notificationCount?: number;
  onSettingsClick: () => void;
  onNotificationsClick: () => void;
  onLogout: () => void;
  onAdminClick?: () => void;
}

export function UserProfile({
  user,
  notificationCount = 0,
  onSettingsClick,
  onNotificationsClick,
  onLogout,
  onAdminClick,
}: UserProfileProps) {
  const getProviderColor = () => {
    switch (user.provider) {
      case 'google':
        return 'bg-blue-500';
      case 'naver':
        return 'bg-green-500';
      case 'kakao':
        return 'bg-yellow-500';
      case 'apple':
        return 'bg-black';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Notification Button */}
      <button
        onClick={onNotificationsClick}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notificationCount > 9 ? '9+' : notificationCount}
          </span>
        )}
      </button>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-9 h-9 rounded-full"
              />
            ) : (
              <div className={`w-9 h-9 rounded-full ${getProviderColor()} flex items-center justify-center text-white font-semibold text-sm`}>
                {user.name.charAt(0)}
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-500">{user.phone}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            환경설정
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onNotificationsClick}>
            <Bell className="mr-2 h-4 w-4" />
            알림 ({notificationCount})
          </DropdownMenuItem>
          {onAdminClick && (
            <DropdownMenuItem onClick={onAdminClick}>
              <Shield className="mr-2 h-4 w-4" />
              관리자 페이지
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}