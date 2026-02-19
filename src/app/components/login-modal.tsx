import { useState } from 'react';
import { toast } from 'sonner';
import { X, Home } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (provider: 'google' | 'naver' | 'kakao') => void;
  onGuestBooking?: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin, onGuestBooking }: LoginModalProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [lastAttemptedProvider, setLastAttemptedProvider] = useState<'google' | 'naver' | 'kakao' | null>(null);
  const [showNetworkError, setShowNetworkError] = useState(false);
  const [networkErrorType, setNetworkErrorType] = useState<'timeout' | 'offline' | 'server'>('server');

  // Edge Case: 소셜 로그인 실패 복구
  const handleLogin = async (provider: 'google' | 'naver' | 'kakao') => {
    if (isLoggingIn) {
      toast.warning('이미 로그인을 진행 중입니다');
      return;
    }

    setLastAttemptedProvider(provider);
    setIsLoggingIn(true);

    // 네트워크 상태 체크
    if (!navigator.onLine) {
      setNetworkErrorType('offline');
      setShowNetworkError(true);
      setIsLoggingIn(false);
      return;
    }

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate random network error (10% chance for demo)
      if (Math.random() < 0.05) {
        throw new Error('NETWORK_ERROR');
      }

      onLogin(provider);
    } catch (error) {
      console.error('Login error:', error);
      
      if (!navigator.onLine) {
        setNetworkErrorType('offline');
      } else {
        setNetworkErrorType('server');
      }
      
      setShowNetworkError(true);
      
      toast.error('로그인 실패', {
        description: '다시 시도해주세요',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRetryLogin = () => {
    setShowNetworkError(false);
    if (lastAttemptedProvider) {
      handleLogin(lastAttemptedProvider);
    }
  };

  const getProviderName = (provider: 'google' | 'naver' | 'kakao' | null) => {
    if (!provider) return '';
    return provider === 'google' ? '구글' : provider === 'naver' ? '네이버' : '카카오';
  };

  const getNetworkErrorMessage = () => {
    switch (networkErrorType) {
      case 'timeout':
        return {
          title: '연결 시간 초과',
          message: '네트워크가 불안정합니다. 다시 시도해주세요.',
          icon: '⏱️',
        };
      case 'offline':
        return {
          title: '인터넷 연결 없음',
          message: 'Wi-Fi 또는 모바일 데이터를 확인해주세요.',
          icon: '📡',
        };
      case 'server':
        return {
          title: '일시적인 오류',
          message: '잠시 후 다시 시도해주세요.',
          icon: '🔧',
        };
    }
  };

  const errorMessage = getNetworkErrorMessage();

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        {/* Modal Content */}
        <div className="relative w-full max-w-[340px] bg-white rounded-[20px] p-6 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* App Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-blue-600">그곳</h1>
            </div>
            <h2 className="text-base font-medium text-gray-900 text-center mb-2">
              예약을 위해 로그인이 필요합니다
            </h2>
            <p className="text-[13px] text-gray-500 text-center">
              간편하게 로그인하고 예약을 진행하세요
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-2 mb-4">
            {/* Google Button */}
            <button
              onClick={() => handleLogin('google')}
              disabled={isLoggingIn}
              className="w-full h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center gap-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isLoggingIn && lastAttemptedProvider === 'google' ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></span>
                  로그인 중...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                    <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                    <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                    <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                  </svg>
                  Google로 계속하기
                </>
              )}
            </button>

            {/* Naver Button */}
            <button
              onClick={() => handleLogin('naver')}
              disabled={isLoggingIn}
              className="w-full h-12 bg-[#03C75A] rounded-xl flex items-center justify-center gap-3 text-white font-medium hover:bg-[#02b350] transition-colors disabled:opacity-50"
            >
              {isLoggingIn && lastAttemptedProvider === 'naver' ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  로그인 중...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect width="20" height="20" rx="2" fill="white"/>
                    <path d="M13.6 10.5L10.8 6H7V14H10.4V9.5L13.2 14H17V6H13.6V10.5Z" fill="#03C75A"/>
                  </svg>
                  네이버로 계속하기
                </>
              )}
            </button>

            {/* Kakao Button */}
            <button
              onClick={() => handleLogin('kakao')}
              disabled={isLoggingIn}
              className="w-full h-12 bg-[#FEE500] rounded-xl flex items-center justify-center gap-3 text-[#000000] font-medium hover:bg-[#FDD835] transition-colors disabled:opacity-50"
            >
              {isLoggingIn && lastAttemptedProvider === 'kakao' ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></span>
                  로그인 중...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3C5.589 3 2 5.895 2 9.5c0 2.427 1.592 4.555 4 5.764V18l2.664-1.777c.435.062.882.095 1.336.095 4.411 0 8-2.895 8-6.5S14.411 3 10 3z" fill="#000000"/>
                  </svg>
                  카카오로 계속하기
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center my-4">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-400">또는</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Guest Booking Button */}
          {onGuestBooking && (
            <button
              onClick={onGuestBooking}
              className="w-full h-12 bg-white border border-gray-300 rounded-xl flex items-center justify-center text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-3"
            >
              비회원으로 예약하기
            </button>
          )}

          {/* Bottom Note */}
          <p className="text-[11px] text-gray-400 text-center leading-relaxed">
            비회원 예약 시 이메일과 전화번호가 필요합니다
          </p>
        </div>
      </div>

      {/* Network Error Dialog */}
      {showNetworkError && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center mb-4">
              <span className="text-4xl mb-3 block">{errorMessage.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {errorMessage.title}
              </h3>
              <p className="text-sm text-gray-600">
                {errorMessage.message}
              </p>
              {lastAttemptedProvider && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-left">
                  <span className="font-medium">마지막 시도:</span> {getProviderName(lastAttemptedProvider)} 로그인
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowNetworkError(false)}
                className="flex-1"
              >
                취소
              </Button>
              <Button
                onClick={handleRetryLogin}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}