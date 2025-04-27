"use client" // Required for TanStack Table v8 hooks

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, KeyRound, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming checkbox exists
import { Badge } from "@/components/ui/badge"; // Assuming badge exists
import { SystemAdmin, getPermissionLevelName, getStatusName } from "@/types/system-admin";
import { toast } from "@/hooks/use-toast"; // Assuming toast hook exists
import { format } from 'date-fns'; // For date formatting

// --- Placeholder Action Handlers ---
const handleEdit = (admin: SystemAdmin) => {
  // TODO: Implement navigation to an edit page or open an edit modal
  toast({ title: "編集アクション", description: `管理者 ${admin.name} (ID: ${admin.id}) を編集中。 (実装保留)` });
  console.log("Edit admin:", admin);
};

const handleDelete = (admin: SystemAdmin) => {
  // TODO: Implement confirmation dialog and API call for deletion
  toast({ title: "削除アクション", description: `管理者 ${admin.name} (ID: ${admin.id}) を削除中。 (実装保留)`, variant: "destructive" });
  console.log("Delete admin:", admin);
};

const handleIssueTemporaryPassword = (admin: SystemAdmin) => {
  // TODO: Implement API call to issue temporary password and notify user/admin
  toast({ title: "仮パスワード発行アクション", description: `管理者 ${admin.name} (ID: ${admin.id}) の仮パスワードを発行中。 (実装保留)` });
  console.log("Issue temporary password for admin:", admin);
};

// --- Column Definitions ---
export const columns: ColumnDef<SystemAdmin>[] = [
  // Optional: Select Checkbox Column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          氏名
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          メールアドレス
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "permissionLevel",
    header: "権限レベル",
    cell: ({ row }) => {
      const level = row.getValue("permissionLevel") as SystemAdmin["permissionLevel"];
      return getPermissionLevelName(level);
    },
    filterFn: (row, id, value) => { // Enable filtering by permission level if needed
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      const status = row.getValue("status") as SystemAdmin["status"];
      const variant = status === 'active' ? 'default' : 'secondary';
      return <Badge variant={variant}>{getStatusName(status)}</Badge>;
    },
     filterFn: (row, id, value) => { // Enable filtering by status if needed
      return value.includes(row.getValue(id))
    },
  },
   {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          登録日
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date | null;
        return date ? format(date, 'yyyy/MM/dd') : '-';
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const admin = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>アクション</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEdit(admin)}>
              <Edit className="mr-2 h-4 w-4" />
              編集
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleIssueTemporaryPassword(admin)}>
               <KeyRound className="mr-2 h-4 w-4" />
              仮パスワード発行
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(admin)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
