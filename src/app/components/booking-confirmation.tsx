import { CheckCircle2, Copy, MapPin, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    bookingNumber: string;
    pensionName: string;
    roomName: string;
    checkIn: Date;
    checkOut: Date;
    guests: string;
    totalPrice: number;
  } | null;
}

export function BookingConfirmation({
  isOpen,
  onClose,
  data,
}: BookingConfirmationProps) {
  if (!isOpen || !data) return null;

  const handleCopyBookingNumber = () => {
    navigator.clipboard.writeText(data.bookingNumber);
    toast.success('예약번호가 복사되었습니다');
  };

  const handleNavigation = () => {
    // Mock address for demo
    const address = '강원특별자치도 동해시 대진항길 19-1';
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://map.kakao.com/link/search/${encodedAddress}`, '_blank');
    toast.info('네비게이션을 실행합니다');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const formatDate = (date: Date) => {
    return format(date, 'yyyy.MM.dd', { locale: ko });
  };

  const formatDay = (date: Date) => {
    return format(date, 'E', { locale: ko });
  };

  const formatTime = (date: Date, isCheckIn: boolean) => {
    return isCheckIn ? '15:00' : '11:00';
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
      <div className="max-w-[375px] mx-auto bg-white min-h-screen">
        {/* Success Icon with Animation */}
        <div className="pt-12 pb-6 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
          >
            <div className="relative">
              <CheckCircle2 className="w-24 h-24 text-[#10B981]" strokeWidth={2} />
              <motion.div
                className="absolute inset-0 rounded-full bg-[#10B981]/10"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </div>
          </motion.div>

          {/* Confirmation Text */}
          <motion.h1
            className="text-2xl font-bold text-gray-900 mt-6 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            예약이 완료되었습니다
          </motion.h1>

          {/* Booking Number */}
          <motion.div
            className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-sm text-gray-600">
              예약번호: <span className="font-semibold text-gray-900">{data.bookingNumber}</span>
            </span>
            <button
              onClick={handleCopyBookingNumber}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <Copy className="w-4 h-4 text-gray-600" />
            </button>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="px-4 space-y-4">
          {/* Booking Details Card */}
          <motion.div
            className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">펜션</span>
                <span className="text-sm font-medium text-gray-900">{data.pensionName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">객실</span>
                <span className="text-sm font-medium text-gray-900">{data.roomName}</span>
              </div>

              <div className="border-t border-gray-100 pt-3" />

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">체크인</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(data.checkIn)} ({formatDay(data.checkIn)}) {formatTime(data.checkIn, true)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">체크아웃</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(data.checkOut)} ({formatDay(data.checkOut)}) {formatTime(data.checkOut, false)}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-3" />

              <div className="flex justify-between">
                <span className="text-sm text-gray-500">인원</span>
                <span className="text-sm font-medium text-gray-900">{data.guests}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-semibold text-gray-900">결제금액</span>
                <span className="text-lg font-bold text-blue-600">{formatPrice(data.totalPrice)}원</span>
              </div>
            </div>
          </motion.div>

          {/* Check-in Guide Box */}
          <motion.div
            className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-base font-semibold text-gray-900">체크인 안내</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">체크인 시간</span>
                <span className="font-medium text-gray-900">15:00 이후</span>
              </div>

              <div className="flex justify-between text-sm items-start">
                <span className="text-gray-600 flex-shrink-0">주소</span>
                <span className="font-medium text-gray-900 text-right ml-4">
                  강원특별자치도 동해시 대진항길 19-1
                </span>
              </div>
            </div>

            <Button
              onClick={handleNavigation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl mt-3"
            >
              <MapPin className="w-4 h-4 mr-2" />
              네비게이션
            </Button>
          </motion.div>
        </div>

        {/* Bottom Action Buttons */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="max-w-[375px] mx-auto space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-12 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium"
              >
                예약 내역 보기
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                홈으로
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              예약 확인 알림이 카카오톡으로 발송되었습니다
            </p>
          </div>
        </motion.div>

        {/* Spacer for fixed bottom buttons */}
        <div className="h-32" />
      </div>
    </div>
  );
}
