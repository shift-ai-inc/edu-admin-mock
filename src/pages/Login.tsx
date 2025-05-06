import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  // States for Temporary Password Login
  const [tempEmail, setTempEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [tempPasswordError, setTempPasswordError] = useState("");
  const [tempPasswordSuccess, setTempPasswordSuccess] = useState(false);

  // States for Password Reset Modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetModalEmail, setResetModalEmail] = useState("");
  const [resetModalSuccess, setResetModalSuccess] = useState(false);
  const [resetModalError, setResetModalError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Mock login logic (no validation, just credential check)
    setTimeout(() => {
      if (email === "admin@example.com" && password === "admin123") {
        onLoginSuccess();
        navigate("/");
      } else {
        setError("メールアドレスまたはパスワードが正しくありません。");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleTempPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTempPasswordError("");
    setTempPasswordSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setTempPasswordError("新しいパスワードが一致しません。");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setTempPasswordSuccess(true);
      setIsLoading(false);
      setTempEmail("");
      setTempPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }, 1000);
  };

  const handlePasswordResetModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResetModalError("");
    setResetModalSuccess(false);

    setTimeout(() => {
      if (resetModalEmail) {
        setResetModalSuccess(true);
      } else {
        setResetModalError("メールアドレスを入力してください。");
      }
      setIsLoading(false);
    }, 1000);
  };

  const openResetModal = () => {
    setResetModalEmail("");
    setResetModalSuccess(false);
    setResetModalError("");
    setResetModalOpen(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            SHIFT AI管理ポータル
          </h1>
          <p className="text-gray-600 mt-2">
            企業アカウント・契約・アセスメント・サーベイの一元管理
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setError("");
            setTempPasswordError("");
            setTempPasswordSuccess(false);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">ログイン</TabsTrigger>
            <TabsTrigger value="temp-password">
              仮パスワードログイン
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>ログイン</CardTitle>
                <CardDescription>
                  アカウント情報を入力してログインしてください
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">メールアドレス</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        // required removed
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">パスワード</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // required removed
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "ログイン中..." : "ログイン"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm text-blue-600 hover:underline"
                  onClick={openResetModal}
                  type="button" // Add type="button" to prevent form submission if inside a form
                >
                  パスワードをお忘れですか？
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="temp-password">
            <Card>
              <CardHeader>
                <CardTitle>仮パスワードでログイン</CardTitle>
                <CardDescription>
                  仮パスワードと新しいパスワードを入力してください
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTempPasswordLogin}>
                  {tempPasswordError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{tempPasswordError}</AlertDescription>
                    </Alert>
                  )}
                  {tempPasswordSuccess && (
                    <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>
                        パスワードが正常に変更されました。新しいパスワードでログインしてください。
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="temp-email">メールアドレス</Label>
                      <Input
                        id="temp-email"
                        type="email"
                        placeholder="admin@example.com"
                        autoComplete="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        disabled={tempPasswordSuccess}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="temp-password">仮パスワード</Label>
                      <Input
                        id="temp-password"
                        type="password"
                        placeholder="仮パスワード"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        disabled={tempPasswordSuccess}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-password">新しいパスワード</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="新しいパスワード"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={tempPasswordSuccess}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-new-password">
                        新しいパスワード（確認）
                      </Label>
                      <Input
                        id="confirm-new-password"
                        type="password"
                        placeholder="新しいパスワードを再入力"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        disabled={tempPasswordSuccess}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || tempPasswordSuccess}
                    >
                      {isLoading ? "処理中..." : "パスワード変更"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setActiveTab("login")}
                  disabled={tempPasswordSuccess}
                >
                  ログイン画面に戻る
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>パスワードリセット</DialogTitle>
              <DialogDescription>
                登録済みメールアドレスにリセットリンクを送信します。
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordResetModalSubmit}>
              <div className="grid gap-4 py-4">
                {resetModalError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{resetModalError}</AlertDescription>
                  </Alert>
                )}
                {resetModalSuccess && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>
                      パスワードリセットのリンクを送信しました。メールをご確認ください。
                    </AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="reset-modal-email">メールアドレス</Label>
                  <Input
                    id="reset-modal-email"
                    type="email"
                    placeholder="登録済みのメールアドレス"
                    value={resetModalEmail}
                    onChange={(e) => setResetModalEmail(e.target.value)}
                    disabled={resetModalSuccess || isLoading}
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-between">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isLoading}>
                    キャンセル
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading || resetModalSuccess}>
                  {isLoading ? "送信中..." : "リセットリンクを送信"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
