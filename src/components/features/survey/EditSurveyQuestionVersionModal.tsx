import { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { QuestionVersion } from '@/types/survey'; // Changed

// Schema for editing question content
const questionContentSchema = z.object({
  text: z.string().min(5, { message: "設問内容は5文字以上で入力してください。" }),
  // Options and correctAnswer might be optional depending on question type for surveys
  options: z.array(z.string().min(1, { message: "選択肢は1文字以上で入力してください。"})).optional(),
  // correctAnswer: z.union([z.string(), z.array(z.string())]).optional(), // Surveys might not have correct answers
});

export type QuestionContentFormData = z.infer<typeof questionContentSchema>;

interface EditSurveyQuestionVersionModalProps { // Changed
  isOpen: boolean;
  onClose: () => void;
  questionVersion: QuestionVersion | null;
  onSave: (questionVersionId: string, data: QuestionContentFormData) => Promise<QuestionVersion | null>;
}

export function EditSurveyQuestionVersionModal({ // Changed
  isOpen,
  onClose,
  questionVersion,
  onSave,
}: EditSurveyQuestionVersionModalProps) {
  const { toast } = useToast();
  const form = useForm<QuestionContentFormData>({
    resolver: zodResolver(questionContentSchema),
  });

  // For dynamic options
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (questionVersion) {
      form.reset({
        text: questionVersion.questionData.text,
        options: questionVersion.questionData.options || [],
        // correctAnswer: questionVersion.questionData.correctAnswer, // Might not be applicable
      });
      setOptions(questionVersion.questionData.options || []);
    } else {
      form.reset({ text: '', options: [] });
      setOptions([]);
    }
  }, [questionVersion, form, isOpen]);

  const handleAddOption = () => setOptions([...options, '']);
  const handleRemoveOption = (index: number) => setOptions(options.filter((_, i) => i !== index));
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    form.setValue('options', newOptions.filter(opt => opt.trim() !== ''), { shouldValidate: true });
  };


  const onSubmit = async (data: QuestionContentFormData) => {
    if (!questionVersion) return;
    try {
      // Ensure options are part of the data if the question type requires them
      const dataToSave: QuestionContentFormData = {
        ...data,
        options: (questionVersion.questionData.type === 'multiple-choice' || questionVersion.questionData.type === 'single-choice') ? options.filter(opt => opt.trim() !== '') : undefined,
      };

      const updatedQuestionVersion = await onSave(questionVersion.id, dataToSave);
      if (updatedQuestionVersion) {
        toast({
          title: '成功',
          description: '設問内容が更新されました。',
        });
        onClose();
      }
      // Error handling can be done in onSave or here if it returns null
    } catch (error) {
      toast({
        title: 'エラー',
        description: (error as Error).message || '設問内容の更新に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  const questionType = questionVersion?.questionData.type;
  const showOptions = questionType === 'multiple-choice' || questionType === 'single-choice';
  // const showCorrectAnswer = showOptions; // Correct answer might not be relevant for surveys

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>サーベイ設問内容編集</DialogTitle> {/* Changed */}
          <DialogDescription>
            サーベイ設問の内容を編集します。ID: {questionVersion?.id} (設問ID: {questionVersion?.questionId} v{questionVersion?.versionNumber}) {/* Changed */}
          </DialogDescription>
        </DialogHeader>
        {questionVersion && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>設問文</FormLabel>
                    <FormControl>
                      <Textarea placeholder="設問内容を入力..." {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showOptions && (
                <FormItem>
                  <FormLabel>選択肢</FormLabel>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`選択肢 ${index + 1}`}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveOption(index)}>削除</Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>選択肢を追加</Button>
                  {/* Hidden field to trigger validation for options array if needed by zod schema */}
                  <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => <input type="hidden" {...field} />}
                  />
                   <FormMessage>{form.formState.errors.options?.message || form.formState.errors.options?.root?.message}</FormMessage>
                </FormItem>
              )}
              
              {/* Correct Answer field might be removed or adapted for surveys */}
              {/* {showCorrectAnswer && ( ... )} */}

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={form.formState.isSubmitting}>
                  キャンセル
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "保存中..." : "変更を保存"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
