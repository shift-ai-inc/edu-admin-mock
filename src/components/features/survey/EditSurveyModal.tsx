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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import {
  Survey,
  SURVEY_TYPES,
  SURVEY_DIFFICULTIES,
  SKILL_LEVELS,
  getSurveyTypeName,
  getSurveyDifficultyName,
  getSkillLevelName
} from '@/types/survey';

const surveyFormSchema = z.object({
  title: z.string().min(3, { message: "タイトルは3文字以上で入力してください。" }),
  description: z.string().min(10, { message: "説明は10文字以上で入力してください。" }),
  type: z.enum(SURVEY_TYPES.map(type => type as string) as [string, ...string[]], { required_error: "種類を選択してください。" }),
  difficulty: z.enum(SURVEY_DIFFICULTIES.map(diff => diff as string) as [string, ...string[]], { required_error: "複雑度を選択してください。" }),
  targetSkillLevel: z.array(z.enum(SKILL_LEVELS.map(level => level as string) as [string, ...string[]])).min(1, { message: "対象者を1つ以上選択してください。" }),
  estimatedDurationMinutes: z.coerce
    .number({ invalid_type_error: "数値を入力してください。" })
    .int({ message: "整数を入力してください。" })
    .positive({ message: "所要時間は正の数である必要があります。" })
    .min(1, { message: "所要時間は1分以上である必要があります。" }),
});

export type SurveyFormData = z.infer<typeof surveyFormSchema>;

interface EditSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: Pick<Survey, 'id' | 'title' | 'description' | 'type' | 'difficulty' | 'targetSkillLevel' | 'estimatedDurationMinutes'> | null;
  onSave: (surveyId: string, data: SurveyFormData) => Promise<void>;
}

export function EditSurveyModal({ isOpen, onClose, survey, onSave }: EditSurveyModalProps) {
  const { toast } = useToast();
  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: {
      title: '',
      description: '',
      targetSkillLevel: [],
      estimatedDurationMinutes: 15,
    },
  });

  useEffect(() => {
    if (survey) {
      form.reset({
        title: survey.title,
        description: survey.description,
        type: survey.type,
        difficulty: survey.difficulty,
        targetSkillLevel: survey.targetSkillLevel,
        estimatedDurationMinutes: survey.estimatedDurationMinutes,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        type: undefined,
        difficulty: undefined,
        targetSkillLevel: [],
        estimatedDurationMinutes: 15,
      });
    }
  }, [survey, form, isOpen]);

  const onSubmit = async (data: SurveyFormData) => {
    if (!survey) return;
    try {
      await onSave(survey.id, data);
      toast({
        title: '成功',
        description: 'サーベイ情報が更新されました。',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'サーベイ情報の更新に失敗しました。',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>サーベイ編集</DialogTitle>
          <DialogDescription>
            サーベイの詳細情報を編集します。変更を保存するには「変更を保存」をクリックしてください。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 従業員満足度サーベイ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Textarea placeholder="サーベイの目的や内容について説明します。" {...field} rows={4}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>種類</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="サーベイの種類を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SURVEY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {getSurveyTypeName(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>複雑度</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="複雑度を選択" />
                      </SelectTrigger> {/* Corrected this line */}
                    </FormControl>
                    <SelectContent>
                      {SURVEY_DIFFICULTIES.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {getSurveyDifficultyName(difficulty)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetSkillLevel"
              render={() => (
                <FormItem>
                  <FormLabel>対象者</FormLabel>
                  <FormDescription>
                    このサーベイが対象とする層を1つ以上選択してください。
                  </FormDescription>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  {SKILL_LEVELS.map((level) => (
                    <FormField
                      key={level}
                      control={form.control}
                      name="targetSkillLevel"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={level}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(level)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), level])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== level
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {getSkillLevelName(level)}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimatedDurationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>標準所要時間 (分)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="例: 15" {...field} />
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
                {form.formState.isSubmitting ? "保存中..." : "変更を保存"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
