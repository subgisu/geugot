import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { UserData } from '@/app/types';
import { toast } from 'sonner';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onSave: (name: string, phone: string) => void;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  user,
  onSave,
}: ProfileEditModalProps) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('이름을 입력해주세요');
      return;
    }

    if (!phone.trim()) {
      toast.error('전화번호를 입력해주세요');
      return;
    }

    onSave(name, phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">프로필 수정</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2">
              이름
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="h-12"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
              이메일 (변경 불가)
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="h-12 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2">
              전화번호
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="h-12"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
            >
              저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
