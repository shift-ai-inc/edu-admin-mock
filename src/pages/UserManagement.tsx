import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, PlusCircle } from "lucide-react";

const users = [
  { id: 1, name: "山田太郎", email: "yamada@example.com", role: "管理者", lastLogin: "2024/03/20" },
  { id: 2, name: "佐藤花子", email: "sato@example.com", role: "一般ユーザー", lastLogin: "2024/03/19" },
  { id: 3, name: "鈴木一郎", email: "suzuki@example.com", role: "一般ユーザー", lastLogin: "2024/03/18" },
  { id: 4, name: "田中美咲", email: "tanaka@example.com", role: "管理者", lastLogin: "2024/03/17" },
];

export default function UserManagement() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">ユーザー管理</h2>
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="ユーザーを検索..."
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            新規ユーザーを追加
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>役割</TableHead>
              <TableHead>最終ログイン</TableHead>
              <TableHead className="text-right">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === "管理者" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    編集
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
