import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { columns } from "./system-admin-columns";
import { mockSystemAdmins } from "@/data/mockSystemAdmins";

export default function SystemAdminManagement() {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");

  // Filter the mock data based on the search input
  const filteredAdmins = filterText
    ? mockSystemAdmins.filter(
        (admin) =>
          admin.name.toLowerCase().includes(filterText.toLowerCase()) ||
          admin.email.toLowerCase().includes(filterText.toLowerCase())
      )
    : mockSystemAdmins;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">システム管理者管理</h1>
          <p className="text-gray-500 mt-1">システム管理者の登録と権限管理</p>
        </div>
        <Button onClick={() => navigate("/system-admins/add")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          新規管理者を追加
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="名前またはメールで検索..."
              className="pl-8"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredAdmins}
          filterInputPlaceholder="管理者を検索..."
          filterColumnId="email"
        />
      </div>
    </div>
  );
}
