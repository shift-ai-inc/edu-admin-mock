import React from 'react';
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
import { SurveyVersion } from '@/types/survey'; // Changed

const createVersionFormSchema = z.object({
  description: z.string().min(5, { message: "バージョン説明は5文字以上で入力してください。" }).max(500, { message: "500文字以内で入力してください。"}),
});

export type CreateVersionFormData = z.infer<typeof createVersionFormSchema>;

interface CreateSurveyVersionModalProps { // Changed
  isOpen: boolean;
  onClose: () => void;
  surveyId: string; // Changed
  onSave: (surveyId: string, data: CreateVersionFormData) => Promise<SurveyVersion | null>; // Changed
}

export function CreateSurveyVersionModal({ isOpen, onClose, surveyId, onSave }: CreateSurveyVersionModalProps) { // Changed
  const { toast } = useToast();
  const form = useForm<CreateVersionFormData>({
    resolver: zodResolver(createVersionFormSchema),
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = async (data: CreateVersionFormData) => {
    try {
      const newVersion = await onSave(surveyId, data); // Changed
      if (newVersion) {
        toast({
          title: '成功',
          description: `サーベイの新規バージョン (v${newVersion.versionNumber}) が作成されました。`, // Changed
        });
        form.reset();
        onClose();
      } else {
        // Error toast is handled by the caller (SurveyDetail page) if onSave returns null or throws
      }
    } catch (error) {
      // Error already handled by onSave or the page if it throws, but as a fallback:
      toast({
        title: 'エラー',
        description: (error as Error).message || '新規バージョンの作成に失敗しました。',
        variant: 'destructive',
      });
    }
  };
  
  // Reset form when modal is opened/closed or surveyId changes
  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新規サーベイバージョン作成</DialogTitle> {/* Changed */}
          <DialogDescription>
            このサーベイの新しいバージョンを作成します。バージョン固有の説明を入力してください。 {/* Changed */}
            既存の最新バージョンの設問がコピーされます。
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
                      placeholder="例: Q2フィードバック反映版、設問項目見直し"
                      {...field}
                      rows={3}
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
                {form.formState.isSubmitting ? "作成中..." : "バージョン作成"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
