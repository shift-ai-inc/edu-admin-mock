import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Question,
  QuestionVersion,
  QuestionType,
  QuestionDifficulty, // Add this import
  VersionStatus,
  getQuestionDifficultyName,
  getQuestionTypeName,
  getVersionStatusName,
} from "@/types/assessment";

const editQuestionVersionFormSchema = z.object({
  questionData: z.object({
    text: z
      .string()
      .min(10, { message: "設問内容は10文字以上で入力してください。" }),
    category: z.string().min(1, { message: "カテゴリを入力してください。" }),
    points: z.coerce
      .number({ invalid_type_error: "数値を入力してください。" })
      .int({ message: "整数を入力してください。" })
      .positive({ message: "配点は正の数である必要があります。" }),
    difficulty: z.enum(
      QUESTION_DIFFICULTIES.map((diff) => diff as string) as [
        string,
        ...string[]
      ],
      { required_error: "難易度を選択してください。" }
    ),
    // type, options, correctAnswer are not editable in this modal for now
  }),
  changeLog: z
    .string()
    .min(5, { message: "変更理由は5文字以上で入力してください。" }),
});

export type EditQuestionVersionFormData = z.infer<
  typeof editQuestionVersionFormSchema
>;

interface EditQuestionVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionVersion: QuestionVersion | null;
  onSave: (
    questionVersionId: string,
    data: EditQuestionVersionFormData
  ) => Promise<QuestionVersion | null>;
}

export function EditQuestionVersionModal({
  isOpen,
  onClose,
  questionVersion,
  onSave,
}: EditQuestionVersionModalProps) {
  const { toast } = useToast();
  const form = useForm<EditQuestionVersionFormData>({
    resolver: zodResolver(editQuestionVersionFormSchema),
    defaultValues: {
      questionData: {
        text: "",
        category: "",
        points: 10, // Default points
        difficulty: "medium", // Default difficulty
      },
      changeLog: "",
    },
  });

  useEffect(() => {
    if (isOpen && questionVersion) {
      form.reset({
        questionData: {
          text: questionVersion.questionData.text,
          category: questionVersion.questionData.category,
          points: questionVersion.questionData.points,
          difficulty: questionVersion.questionData.difficulty,
        },
        changeLog: questionVersion.changeLog || "", // Use existing changelog or empty
      });
    } else if (!isOpen) {
      form.reset({
        // Reset to default if modal is closed or no questionVersion
        questionData: {
          text: "",
          category: "",
          points: 10,
          difficulty: "medium",
        },
        changeLog: "",
      });
    }
  }, [isOpen, questionVersion, form]);

  const onSubmit = async (data: EditQuestionVersionFormData) => {
    if (!questionVersion) return;
    try {
      const updatedVersion = await onSave(questionVersion.id, data);
      if (updatedVersion) {
        toast({
          title: "成功",
          description: "設問情報が更新されました。",
        });
        onClose();
      }
      // Error toast is handled by the onSave promise rejection in AssessmentQuestionDetail page
    } catch (error) {
      // Fallback, should be handled by onSave
      toast({
        title: "エラー",
        description: "設問情報の更新に失敗しました。",
        variant: "destructive",
      });
    }
  };

  if (!questionVersion) return null; // Or some loading/error state if preferred

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            設問内容編集 (バージョン: v{questionVersion.versionNumber})
          </DialogTitle>
          <DialogDescription>
            設問の内容とこのバージョンの変更理由を編集します。
            設問タイプ、選択肢、正解はここでは編集できません。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2"
          >
            <div className="space-y-2 p-3 border rounded-md bg-muted/30">
              <p className="text-sm font-medium">
                設問タイプ:{" "}
                {getQuestionTypeName(questionVersion.questionData.type)}
              </p>
              {(questionVersion.questionData.type === "multiple-choice" ||
                questionVersion.questionData.type === "single-choice") &&
                questionVersion.questionData.options && (
                  <div>
                    <p className="text-sm font-medium">選択肢:</p>
                    <ul className="list-disc list-inside pl-4 text-sm text-muted-foreground">
                      {questionVersion.questionData.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              <p className="text-sm font-medium">
                正解:{" "}
                <span className="text-muted-foreground">
                  {Array.isArray(questionVersion.questionData.correctAnswer)
                    ? questionVersion.questionData.correctAnswer.join(", ")
                    : questionVersion.questionData.correctAnswer || "未設定"}
                </span>
              </p>
            </div>

            <FormField
              control={form.control}
              name="questionData.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>設問内容</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="設問の本文を入力してください。"
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="questionData.category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>カテゴリ</FormLabel>
                  <FormControl>
                    <Input placeholder="例: React Hooks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="questionData.points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>配点</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="例: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="questionData.difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>難易度</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="難易度を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {QUESTION_DIFFICULTIES.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {getQuestionDifficultyName(
                              difficulty as QuestionDifficulty
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="changeLog"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>変更理由 (このバージョンへの変更点)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="このバージョンでの変更内容や理由を記述してください。"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={form.formState.isSubmitting}
              >
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
