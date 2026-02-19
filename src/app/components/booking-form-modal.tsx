import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import type { Room } from './room-card';

interface BookingFormModalProps {
  room: Room | null;
  date: Date | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (guestName: string, contact: string, checkIn: Date, checkOut: Date) => void;
}

export function BookingFormModal({
  room,
  date,
  isOpen,
  onClose,
  onSubmit,
}: BookingFormModalProps) {
  const [guestName, setGuestName] = useState('');
  const [contact, setContact] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errors, setErrors] = useState({ 
    guestName: '', 
    contact: '', 
    checkIn: '', 
    checkOut: '' 
  });

  // Set default dates when modal opens
  useEffect(() => {
    if (isOpen && date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      setCheckIn(dateStr);
      
      // Set default checkout to next day
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(format(nextDay, 'yyyy-MM-dd'));
      setHasUnsavedChanges(false);
    }
  }, [isOpen, date]);

  // Edge Case 26: 전화번호 자동 포맷팅
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 자동 하이픈 추가
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Edge Case 27: 예약자 성함 sanitize (이모지, 특수문자 제거)
  const sanitizeName = (value: string) => {
    // 한글, 영문, 공백만 허용
    return value.replace(/[^\u3131-\u3163\uac00-\ud7a3a-zA-Z\s]/g, '');
  };

  // Edge Case 25: 실시간 입력 검증
  const validateContact = (value: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!value) {
      return '';
    } else if (!phoneRegex.test(value)) {
      return '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Edge Case 23: 더블 클릭 방지
    if (isSubmitting) return;

    // Validation
    const newErrors = { guestName: '', contact: '', checkIn: '', checkOut: '' };
    let hasError = false;

    if (!guestName.trim()) {
      newErrors.guestName = '예약자 성함을 입력해주세요.';
      hasError = true;
    } else if (guestName.trim().length < 2) {
      newErrors.guestName = '성함은 최소 2자 이상 입력해주세요.';
      hasError = true;
    }

    const contactError = validateContact(contact);
    if (!contact.trim()) {
      newErrors.contact = '연락처를 입력해주세요.';
      hasError = true;
    } else if (contactError) {
      newErrors.contact = contactError;
      hasError = true;
    }

    if (!checkIn) {
      newErrors.checkIn = '체크인 날짜를 선택해주세요.';
      hasError = true;
    }

    if (!checkOut) {
      newErrors.checkOut = '체크아웃 날짜를 선택해주세요.';
      hasError = true;
    }

    if (checkIn && checkOut && new Date(checkIn) >= new Date(checkOut)) {
      newErrors.checkOut = '체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate async submission
    setTimeout(() => {
      onSubmit(guestName, contact, new Date(checkIn), new Date(checkOut));
      setGuestName('');
      setContact('');
      setCheckIn('');
      setCheckOut('');
      setErrors({ guestName: '', contact: '', checkIn: '', checkOut: '' });
      setHasUnsavedChanges(false);
      setIsSubmitting(false);
    }, 300);
  };

  // Edge Case 28: 모달 외부 클릭 시 미저장 데이터 경고
  const handleClose = () => {
    if (hasUnsavedChanges && (guestName || contact)) {
      if (!confirm('입력하신 내용이 저장되지 않았습니다. 정말 닫으시겠습니까?')) {
        return;
      }
    }
    
    setGuestName('');
    setContact('');
    setCheckIn('');
    setCheckOut('');
    setErrors({ guestName: '', contact: '', checkIn: '', checkOut: '' });
    setHasUnsavedChanges(false);
    onClose();
  };

  if (!room || !date) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>예약 정보 입력</DialogTitle>
          <DialogDescription>예약자 정보를 입력해주세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="roomName">객실명</Label>
              <Input id="roomName" value={room.name} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label htmlFor="checkIn">체크인 *</Label>
              <Input
                id="checkIn"
                type="date"
                value={checkIn}
                readOnly
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                드래그로 설정된 날짜입니다
              </p>
            </div>
            <div>
              <Label htmlFor="checkOut">체크아웃 *</Label>
              <Input
                id="checkOut"
                type="date"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  setHasUnsavedChanges(true);
                  if (errors.checkOut) {
                    setErrors({ ...errors, checkOut: '' });
                  }
                }}
                className={errors.checkOut ? 'input-error' : ''}
              />
              {errors.checkOut && (
                <p className="error-message">{errors.checkOut}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                체크아웃 날짜만 수정 가능합니다
              </p>
            </div>
            <div>
              <Label htmlFor="guestName">예약자 성함 *</Label>
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => {
                  const sanitized = sanitizeName(e.target.value);
                  setGuestName(sanitized);
                  setHasUnsavedChanges(true);
                  if (errors.guestName) {
                    setErrors({ ...errors, guestName: '' });
                  }
                }}
                placeholder="홍길동"
                maxLength={50}
                className={errors.guestName ? 'input-error' : ''}
              />
              {errors.guestName && (
                <p className="error-message">{errors.guestName}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                한글 또는 영문만 입력 가능합니다
              </p>
            </div>
            <div>
              <Label htmlFor="contact">연락처 *</Label>
              <Input
                id="contact"
                type="tel"
                value={contact}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setContact(formatted);
                  setHasUnsavedChanges(true);
                  if (errors.contact) {
                    const error = validateContact(formatted);
                    setErrors({ ...errors, contact: error });
                  }
                }}
                onBlur={(e) => {
                  const error = validateContact(e.target.value);
                  setErrors({ ...errors, contact: error });
                }}
                placeholder="010-1234-5678"
                maxLength={13}
                inputMode="numeric"
                className={errors.contact ? 'input-error' : ''}
              />
              {errors.contact && (
                <p className="error-message">{errors.contact}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                하이픈이 자동으로 입력됩니다
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={isSubmitting ? 'loading' : ''}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  처리 중...
                </>
              ) : (
                '예약 확정'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}