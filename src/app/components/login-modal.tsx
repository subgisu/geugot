import { useState } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (provider: 'google' | 'naver' | 'kakao' | 'apple') => void;
  onGuestBooking?: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin, onGuestBooking }: LoginModalProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [lastAttemptedProvider, setLastAttemptedProvider] = useState<'google' | 'naver' | 'kakao' | 'apple' | null>(null);
  const [showNetworkError, setShowNetworkError] = useState(false);
  const [networkErrorType, setNetworkErrorType] = useState<'timeout' | 'offline' | 'server'>('server');

  // Edge Case: 소셜 로그인 실패 복구
  const handleLogin = async (provider: 'google' | 'naver' | 'kakao' | 'apple') => {
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

  const getProviderName = (provider: 'google' | 'naver' | 'kakao' | 'apple' | null) => {
    if (!provider) return '';
    return provider === 'google' ? '구글' : provider === 'naver' ? '네이버' : provider === 'kakao' ? '카카오' : '애플';
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
        <div className="relative w-full max-w-[340px] bg-white rounded-[20px] p-6 pt-8 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-start mb-5">
            <p className="text-[13px] text-[#2DB400] mb-3">
              그곳에 오신 것을 환영합니다
            </p>
            <h1 className="text-[26px] font-bold text-gray-900 leading-tight">
              3 초면 끝나는<br />간편 가입
            </h1>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-2.5 mb-4">
            {/* Kakao Button */}
            <button
              onClick={() => handleLogin('kakao')}
              disabled={isLoggingIn}
              className="w-full h-[48px] bg-[#FEE500] rounded-[8px] flex items-center justify-center gap-2 text-[#1A1A1A] font-medium text-[15px] hover:bg-[#FDD835] transition-colors disabled:opacity-50"
            >
              {isLoggingIn && lastAttemptedProvider === 'kakao' ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></span>
                  로그인 중...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3C5.589 3 2 5.895 2 9.5c0 2.427 1.592 4.555 4 5.764V18l2.664-1.777c.435.062.882.095 1.336.095 4.411 0 8-2.895 8-6.5S14.411 3 10 3z" fill="#1A1A1A"/>
                  </svg>
                  카카오로 시작하기
                </>
              )}
            </button>

            {/* Naver Button */}
            <button
              onClick={() => handleLogin('naver')}
              disabled={isLoggingIn}
              className="w-full h-[48px] bg-[#03C75A] rounded-[8px] flex items-center justify-center gap-2 text-white font-medium text-[15px] hover:bg-[#02b350] transition-colors disabled:opacity-50"
            >
              {isLoggingIn && lastAttemptedProvider === 'naver' ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  로그인 중...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <rect width="20" height="20" rx="2" fill="white"/>
                    <path d="M13.6 10.5L10.8 6H7V14H10.4V9.5L13.2 14H17V6H13.6V10.5Z" fill="#03C75A"/>
                  </svg>
                  네이버로 시작하기
                </>
              )}
            </button>

            {/* Google Button */}
            <button
              onClick={() => handleLogin('google')}
              disabled={isLoggingIn}
              className="w-full h-[48px] bg-white border border-gray-300 rounded-[8px] flex items-center justify-center gap-2 text-gray-700 font-medium text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isLoggingIn && lastAttemptedProvider === 'google' ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></span>
                  로그인 중...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                    <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                    <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                    <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                  </svg>
                  Google 로 시작하기
                </>
              )}
            </button>

            {/* Apple Button */}
            <button
              onClick={() => handleLogin('apple')}
              disabled={isLoggingIn}
              className="w-full h-[48px] bg-black rounded-[8px] flex items-center justify-center gap-2 text-white font-medium text-[15px] hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {isLoggingIn && lastAttemptedProvider === 'apple' ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  로그인 중...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M15.182 10.596c-.028-2.652 2.164-3.926 2.262-3.99-1.23-1.8-3.148-2.046-3.832-2.074-1.632-.165-3.185.962-4.013.962-.828 0-2.108-.937-3.464-.912-1.783.026-3.426 1.037-4.345 2.634-1.852 3.214-.474 7.977 1.332 10.586.883 1.277 1.935 2.712 3.318 2.66 1.332-.053 1.835-.862 3.445-.862 1.61 0 2.062.862 3.466.835 1.432-.021 2.341-1.302 3.219-2.582 1.015-1.482 1.433-2.916 1.458-2.99-.032-.015-2.796-1.073-2.846-4.267z" fill="white"/>
                    <path d="M12.538 2.76c.734-.89 1.229-2.124 1.094-3.354-1.058.043-2.34.705-3.098 1.594-.68.786-1.275 2.04-1.115 3.244 1.18.092 2.385-.6 3.119-1.484z" fill="white"/>
                  </svg>
                  Apple 로 시작하기
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-[13px] text-gray-400">또는</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Guest Booking Button */}
          {onGuestBooking && (
            <button
              onClick={onGuestBooking}
              className="w-full h-[48px] bg-white border border-gray-300 rounded-[8px] flex items-center justify-center text-gray-500 text-[14px] hover:bg-gray-50 transition-colors"
            >
              회원가입 없이 예약하기
            </button>
          )}
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