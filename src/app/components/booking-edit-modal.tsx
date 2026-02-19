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
import type { Booking } from './booking-calendar';

interface BookingEditModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (guestName: string, contact: string, checkIn: Date, checkOut: Date) => void;
  onCancel: () => void;
}

export function BookingEditModal({
  booking,
  isOpen,
  onClose,
  onUpdate,
  onCancel,
}: BookingEditModalProps) {
  const [guestName, setGuestName] = useState('');
  const [contact, setContact] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [errors, setErrors] = useState({ 
    guestName: '', 
    contact: '',
    checkIn: '',
    checkOut: ''
  });

  useEffect(() => {
    if (booking) {
      setGuestName(booking.guestName);
      setContact(booking.contact);
      setCheckIn(format(booking.checkIn, 'yyyy-MM-dd'));
      setCheckOut(format(booking.checkOut, 'yyyy-MM-dd'));
    }
  }, [booking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors = { guestName: '', contact: '', checkIn: '', checkOut: '' };
    let hasError = false;

    if (!guestName.trim()) {
      newErrors.guestName = '예약자 성함을 입력해주세요.';
      hasError = true;
    }

    if (!contact.trim()) {
      newErrors.contact = '연락처를 입력해주세요.';
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

    onUpdate(guestName, contact, new Date(checkIn), new Date(checkOut));
    setErrors({ guestName: '', contact: '', checkIn: '', checkOut: '' });
  };

  const handleCancel = () => {
    if (confirm('예약을 취소하시겠습니까?')) {
      onCancel();
    }
  };

  const handleClose = () => {
    setErrors({ guestName: '', contact: '', checkIn: '', checkOut: '' });
    onClose();
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>예약 정보 수정</DialogTitle>
          <DialogDescription>예약 정보를 수정하거나 취소할 수 있습니다.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="roomName">객실명</Label>
              <Input
                id="roomName"
                value={booking.roomName}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="checkIn">체크인 *</Label>
              <Input
                id="checkIn"
                type="date"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (errors.checkIn) {
                    setErrors({ ...errors, checkIn: '' });
                  }
                }}
                className={errors.checkIn ? 'border-red-500' : ''}
              />
              {errors.checkIn && (
                <p className="text-sm text-red-500 mt-1">{errors.checkIn}</p>
              )}
            </div>
            <div>
              <Label htmlFor="checkOut">체크아웃 *</Label>
              <Input
                id="checkOut"
                type="date"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  if (errors.checkOut) {
                    setErrors({ ...errors, checkOut: '' });
                  }
                }}
                className={errors.checkOut ? 'border-red-500' : ''}
              />
              {errors.checkOut && (
                <p className="text-sm text-red-500 mt-1">{errors.checkOut}</p>
              )}
            </div>
            <div>
              <Label htmlFor="guestName">예약자 성함 *</Label>
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  if (errors.guestName) {
                    setErrors({ ...errors, guestName: '' });
                  }
                }}
                placeholder="홍길동"
                className={errors.guestName ? 'border-red-500' : ''}
              />
              {errors.guestName && (
                <p className="text-sm text-red-500 mt-1">{errors.guestName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="contact">연락처 *</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                  if (errors.contact) {
                    setErrors({ ...errors, contact: '' });
                  }
                }}
                placeholder="010-1234-5678"
                className={errors.contact ? 'border-red-500' : ''}
              />
              {errors.contact && (
                <p className="text-sm text-red-500 mt-1">{errors.contact}</p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-6 flex justify-between">
            <Button type="button" variant="destructive" onClick={handleCancel}>
              예약 취소
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                닫기
              </Button>
              <Button type="submit">수정 완료</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}