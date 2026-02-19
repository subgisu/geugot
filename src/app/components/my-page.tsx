import { 
  Calendar, 
  Heart, 
  User, 
  Bell, 
  MessageCircle, 
  FileText, 
  Shield, 
  ChevronRight,
  Camera,
  LogOut,
  UserX
} from 'lucide-react';
import { UserData } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface MyPageProps {
  user: UserData;
  bookingCount?: number;
  wishlistCount?: number;
  onEditProfile: () => void;
  onNotificationSettings: () => void;
  onViewBookings: () => void;
  onViewWishlist: () => void;
  onCustomerSupport: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function MyPage({
  user,
  bookingCount = 0,
  wishlistCount = 0,
  onEditProfile,
  onNotificationSettings,
  onViewBookings,
  onViewWishlist,
  onCustomerSupport,
  onLogout,
  onDeleteAccount,
}: MyPageProps) {
  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google':
        return '구글 연동';
      case 'naver':
        return '네이버 연동';
      case 'kakao':
        return '카카오 연동';
      default:
        return '이메일 가입';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'bg-blue-500';
      case 'naver':
        return 'bg-green-500';
      case 'kakao':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAvatarChange = () => {
    toast.info('프로필 사진 변경 기능은 준비 중입니다');
  };

  const handleTermsClick = () => {
    toast.info('이용약관 페이지로 이동합니다');
  };

  const handlePrivacyClick = () => {
    toast.info('개인정보 처리방침 페이지로 이동합니다');
  };

  const handleDeleteAccount = () => {
    if (confirm('정말로 회원을 탈퇴하시겠습니까?\n모든 예약 정보가 삭제되며 복구할 수 없습니다.')) {
      onDeleteAccount();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[375px] mx-auto bg-white min-h-screen">
        {/* Profile Header with Gradient */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-b-[24px] pb-8 pt-12 px-6">
          <div className="flex flex-col items-center">
            {/* Avatar with Camera Overlay */}
            <div className="relative mb-4">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-4 border-white/30"
                />
              ) : (
                <div className={`w-16 h-16 rounded-full ${getProviderColor(user.provider)} flex items-center justify-center text-white text-2xl font-bold border-4 border-white/30`}>
                  {user.name.charAt(0)}
                </div>
              )}
              <button
                onClick={handleAvatarChange}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* User Info */}
            <h1 className="text-xl font-bold text-white mb-1">{user.name}</h1>
            <p className="text-[13px] text-white/70 mb-3">{user.email}</p>
            
            {/* Provider Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className={`w-2 h-2 rounded-full ${getProviderColor(user.provider)}`} />
              <span className="text-xs text-white font-medium">
                {getProviderName(user.provider)}
              </span>
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="px-4 py-6 space-y-4">
          {/* Group 1: Booking & Wishlist */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={onViewBookings}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#64748B]" />
                </div>
                <span className="text-[15px] font-medium text-gray-900">예약 내역</span>
              </div>
              <div className="flex items-center gap-2">
                {bookingCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full min-w-[24px] text-center">
                    {bookingCount}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>

            <button
              onClick={onViewWishlist}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#64748B]" />
                </div>
                <span className="text-[15px] font-medium text-gray-900">찜 목록</span>
              </div>
              <div className="flex items-center gap-2">
                {wishlistCount > 0 && (
                  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full min-w-[24px] text-center">
                    {wishlistCount}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          </div>

          {/* Group 2: Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={onEditProfile}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-[#64748B]" />
                </div>
                <span className="text-[15px] font-medium text-gray-900">프로필 수정</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={onNotificationSettings}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[#64748B]" />
                </div>
                <span className="text-[15px] font-medium text-gray-900">알림 설정</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={onCustomerSupport}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#64748B]" />
                </div>
                <span className="text-[15px] font-medium text-gray-900">고객센터</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Group 3: Legal & App Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={handleTermsClick}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#64748B]" />
                </div>
                <span className="text-[15px] font-medium text-gray-900">이용약관</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={handlePrivacyClick}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#64748B]" />
                </div>
                <span className="text-[15px] font-medium text-gray-900">개인정보 처리방침</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                  <span className="text-xs font-bold text-[#64748B]">그곳</span>
                </div>
                <span className="text-[15px] font-medium text-gray-900">앱 버전</span>
              </div>
              <span className="text-sm text-gray-500">v2.0.1</span>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="px-4 pb-8">
          <div className="flex items-center justify-center gap-4 text-sm">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>로그아웃</span>
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors text-[13px]"
            >
              <UserX className="w-4 h-4" />
              <span>회원탈퇴</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
