import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, Building, User as UserIcon, AlertTriangle } from 'lucide-react'; // Renamed User to UserIcon to avoid conflict
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { AvailableSurvey, SurveyDelivery } from '@/types/survey';
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from '@/data/mockUsers';
import { mockGroups } from '@/data/mockGroups';
import { mockCompanies } from '@/data/mockCompanies';

interface CreateSurveyDeliveryDialogProps {
  survey: AvailableSurvey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeliveryCreated: (deliveryDetails: Partial<SurveyDelivery>) => void;
}

const allTargets = [
  ...mockUsers.slice(0,3).map(u => ({ id: u.id, name: u.name, type: 'user' as const, icon: UserIcon })),
  ...mockGroups.slice(0,2).map(g => ({ id: g.id, name: g.name, type: 'group' as const, icon: Users })),
  ...mockCompanies.slice(0,1).map(c => ({ id: c.id, name: c.name, type: 'company' as const, icon: Building })),
];

export default function CreateSurveyDeliveryDialog({
  survey,
  open,
  onOpenChange,
  onDeliveryCreated,
}: CreateSurveyDeliveryDialogProps) {
  const [deliveryName, setDeliveryName] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  });
  const [selectedTargets, setSelectedTargets] = useState<Array<{ id: string | number; name: string; type: 'user' | 'group' | 'company' }>>([]);
  const [targetSearchTerm, setTargetSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();

  useEffect(() => {
    if (survey) {
      setDeliveryName(`${survey.title} - ${format(new Date(), 'yyyy/MM/dd')}`);
    }
    // Reset fields when dialog opens or survey changes
    setStartDate(new Date());
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setEndDate(nextWeek);
    setSelectedTargets([]);
    setTargetSearchTerm('');
    setErrors({});
  }, [survey, open]);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    if (!deliveryName.trim()) newErrors.deliveryName = "配信名は必須です。";
    if (!startDate) newErrors.startDate = "開始日は必須です。";
    if (!endDate) newErrors.endDate = "終了日は必須です。";
    if (startDate && endDate && endDate < startDate) newErrors.endDate = "終了日は開始日より後に設定してください。";
    if (selectedTargets.length === 0) newErrors.targets = "少なくとも1つの対象を選択してください。";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!survey || !validateFields()) {
      if (!survey) toast({ title: "エラー", description: "対象のサーベイが選択されていません。", variant: "destructive" });
      return;
    }

    const deliveryDetails: Partial<SurveyDelivery> = {
      surveyId: survey.id,
      surveyTitle: survey.title,
      deliveryName,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      targets: selectedTargets.map(t => ({ id: String(t.id), name: t.name, type: t.type })), // Ensure id is string
      status: 'scheduled',
      totalParticipants: selectedTargets.reduce((acc, target) => {
        if (target.type === 'user') return acc + 1;
        if (target.type === 'group') return acc + (mockGroups.find(g=>g.id === target.id)?.memberCount || 5);
        if (target.type === 'company') return acc + (mockCompanies.find(c=>c.id === target.id)?.employeeCount || 50);
        return acc;
      },0),
      completedParticipants: 0,
      completionRate: 0,
    };

    console.log("Creating survey delivery:", deliveryDetails);
    onDeliveryCreated(deliveryDetails);
    toast({
      title: "サーベイ配信設定完了",
      description: `${deliveryName} の配信設定を作成しました。`,
    });
    onOpenChange(false);
  };

  const toggleTargetSelection = (target: { id: string | number; name: string; type: 'user' | 'group' | 'company' }) => {
    setSelectedTargets(prev =>
      prev.find(st => st.id === target.id)
        ? prev.filter(st => st.id !== target.id)
        : [...prev, target]
    );
  };

  const filteredTargets = allTargets.filter(target =>
    target.name.toLowerCase().includes(targetSearchTerm.toLowerCase())
  );

  if (!survey) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>サーベイ配信設定: {survey.title}</DialogTitle>
          <DialogDescription>
            「{survey.title}」の新しい配信を設定します。詳細を入力してください。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 overflow-y-auto px-1 flex-grow">
          <div>
            <Label htmlFor="deliveryName">配信名</Label>
            <Input
              id="deliveryName"
              value={deliveryName}
              onChange={(e) => setDeliveryName(e.target.value)}
              className="mt-1"
            />
            {errors.deliveryName && <p className="text-sm text-destructive mt-1">{errors.deliveryName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">開始日</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP', { locale: ja }) : <span>日付を選択</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    locale={ja}
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-sm text-destructive mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <Label htmlFor="endDate">終了日</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP', { locale: ja }) : <span>日付を選択</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    locale={ja}
                    disabled={{ before: startDate || new Date(0) }}
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-sm text-destructive mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <Label>対象者/グループ/会社</Label>
            <Input
              placeholder="対象を検索..."
              value={targetSearchTerm}
              onChange={(e) => setTargetSearchTerm(e.target.value)}
              className="mt-1 mb-2"
            />
            {errors.targets && <p className="text-sm text-destructive mb-2 flex items-center"><AlertTriangle className="h-4 w-4 mr-1"/>{errors.targets}</p>}
            <div className="max-h-[200px] overflow-y-auto border rounded-md p-2 space-y-1">
              {filteredTargets.length > 0 ? filteredTargets.map(target => (
                <Button
                  key={target.id}
                  variant={selectedTargets.find(st => st.id === target.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTargetSelection(target)}
                  className="w-full justify-start text-left"
                >
                  <target.icon className="mr-2 h-4 w-4" />
                  {target.name} ({target.type === 'user' ? 'ユーザー' : target.type === 'group' ? 'グループ' : '会社'})
                </Button>
              )) : <p className="text-sm text-muted-foreground text-center py-2">該当する対象が見つかりません。</p>}
            </div>
            {selectedTargets.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">選択中の対象 ({selectedTargets.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {selectedTargets.map(st => (
                    <Badge key={st.id} variant="secondary" className="py-1">
                      {st.name}
                      <Button variant="ghost" size="xs" className="ml-1 h-auto p-0 text-muted-foreground hover:text-destructive" onClick={() => toggleTargetSelection(st)}>✕</Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-auto pt-4 border-t">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              キャンセル
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            配信設定を作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
