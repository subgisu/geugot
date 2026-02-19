import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Slider } from '@/app/components/ui/slider';

export interface UserSettings {
  searchRadius: number; // km
  notificationsEnabled: boolean;
  preferredTypes: {
    hotel: boolean;
    pension: boolean;
    motel: boolean;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>환경설정</DialogTitle>
          <DialogDescription>
            특가 검색 및 알림 설정을 관리하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search Radius */}
          <div className="space-y-3">
            <Label>검색 반경: {localSettings.searchRadius}km</Label>
            <Slider
              value={[localSettings.searchRadius]}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, searchRadius: value[0] })
              }
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              현재 위치로부터 {localSettings.searchRadius}km 이내의 숙소를 검색합니다
            </p>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>특가 알림</Label>
              <p className="text-xs text-gray-500">
                새로운 특가 정보를 알림으로 받습니다
              </p>
            </div>
            <Switch
              checked={localSettings.notificationsEnabled}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, notificationsEnabled: checked })
              }
            />
          </div>

          {/* Preferred Types */}
          <div className="space-y-3">
            <Label>선호 숙소 유형</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">호텔</span>
                <Switch
                  checked={localSettings.preferredTypes.hotel}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      preferredTypes: { ...localSettings.preferredTypes, hotel: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">펜션</span>
                <Switch
                  checked={localSettings.preferredTypes.pension}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      preferredTypes: { ...localSettings.preferredTypes, pension: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">모텔</span>
                <Switch
                  checked={localSettings.preferredTypes.motel}
                  onCheckedChange={(checked) =>
                    setLocalSettings({
                      ...localSettings,
                      preferredTypes: { ...localSettings.preferredTypes, motel: checked },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label>
              가격 범위: {localSettings.priceRange.min.toLocaleString()}원 ~{' '}
              {localSettings.priceRange.max.toLocaleString()}원
            </Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-gray-500">최소 금액</Label>
                <Slider
                  value={[localSettings.priceRange.min]}
                  onValueChange={(value) =>
                    setLocalSettings({
                      ...localSettings,
                      priceRange: { ...localSettings.priceRange, min: value[0] },
                    })
                  }
                  min={0}
                  max={500000}
                  step={10000}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">최대 금액</Label>
                <Slider
                  value={[localSettings.priceRange.max]}
                  onValueChange={(value) =>
                    setLocalSettings({
                      ...localSettings,
                      priceRange: { ...localSettings.priceRange, max: value[0] },
                    })
                  }
                  min={0}
                  max={500000}
                  step={10000}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
