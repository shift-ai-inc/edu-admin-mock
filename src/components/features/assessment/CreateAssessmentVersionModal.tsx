import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AssessmentVersion } from '@/types/assessment';

const createVersionFormSchema = z.object({
  description: z.string().min(5, { message: "バージョン説明は5文字以上で入力してください。" }).max(500, { message: "バージョン説明は500文字以内で入力してください。" }),
});

export type CreateVersionFormData = z.infer<typeof createVersionFormSchema>;

interface CreateAssessmentVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentId: string;
  onSave: (assessmentId: string, data: CreateVersionFormData) => Promise<AssessmentVersion | null>;
}

export function CreateAssessmentVersionModal({ isOpen, onClose, assessmentId, onSave }: CreateAssessmentVersionModalProps) {
  const { toast } = useToast();
  const form = useForm<CreateVersionFormData>({
    resolver: zodResolver(createVersionFormSchema),
    defaultValues: {
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ description: '' });
    }
  }, [isOpen, form]);

  const onSubmit = async (data: CreateVersionFormData) => {
    try {
      const newVersion = await onSave(assessmentId, data);
      if (newVersion) {
        toast({
          title: '成功',
          description: `新規アセスメントバージョン (v${newVersion.versionNumber}) が作成されました。`,
        });
        onClose();
      } else {
        // Error toast is handled by the onSave promise rejection in AssessmentDetail
      }
    } catch (error) {
      // Error already handled by onSave in AssessmentDetail, or if onSave itself throws before returning null
      // This catch is a fallback.
      toast({
        title: 'エラー',
        description: '新規バージョンの作成に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新規アセスメントバージョン作成</DialogTitle>
          <DialogDescription>
            新しいアセスメントバージョンを作成します。バージョン説明を入力してください。
            新しいバージョンは「下書き」ステータスで作成されます。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>バージョン説明</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="例: 設問内容の見直しと難易度調整版"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={form.formState.isSubmitting}>
                キャンセル
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "作成中..." : "作成"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
