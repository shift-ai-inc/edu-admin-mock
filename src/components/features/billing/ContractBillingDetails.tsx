import { useState, useMemo, useEffect } from "react";
import { mockBillingHistory } from "@/data/mockBillingHistory";
import type { BillingRecord } from "@/types/billing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Search, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  parseISO,
  format,
  startOfDay,
  isBefore,
  differenceInDays,
  isValid,
  formatISO,
} from "date-fns";
import { ja } from "date-fns/locale";

interface ContractBillingDetailsProps {
  contractId: string;
}

type BillingStatusVariant =
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "default";

interface BillingStatusInfo {
  text: string;
  variant: BillingStatusVariant;
  daysRemaining?: number;
  icon?: React.ElementType;
}

const getBillingStatus = (record: BillingRecord): BillingStatusInfo => {
  const today = startOfDay(new Date());
  const dueDate = startOfDay(parseISO(record.dueDate));

  if (record.status === "Paid") {
    return { text: "支払済", variant: "success", icon: CheckCircle2 };
  }

  if (isBefore(dueDate, today)) {
    return { text: "期限切れ", variant: "destructive", icon: AlertTriangle };
  }

  const daysRemaining = differenceInDays(dueDate, today);
  if (daysRemaining <= 7) {
    return {
      text: `未払 (残り${daysRemaining}日)`,
      variant: "warning",
      daysRemaining,
      icon: AlertTriangle,
    };
  }
  return { text: "未払", variant: "info", daysRemaining };
};

const getStatusBadgeClassName = (variant: BillingStatusVariant): string => {
  switch (variant) {
    case "success":
      return "bg-green-100 text-green-700 border-green-300";
    case "warning":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "destructive":
      return "bg-red-100 text-red-700 border-red-300";
    case "info":
      return "bg-blue-100 text-blue-700 border-blue-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "無効な日付";
    return format(date, "PPP", { locale: ja });
  } catch {
    return "フォーマットエラー";
  }
};

export default function ContractBillingDetails({
  contractId,
}: ContractBillingDetailsProps) {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<BillingRecord>>({
    contractId,
    currency: "JPY",
    cycle: "Monthly",
    status: "Unpaid",
    issueDate: formatISO(new Date(), { representation: "date" }),
  });

  useEffect(() => {
    console.log("[ContractBillingDetails] Received contractId:", contractId);
    const recordsForContract = mockBillingHistory.filter(
      (br) => br.contractId === contractId
    );
    console.log(
      "[ContractBillingDetails] Filtered billing records for this contract:",
      recordsForContract
    );
    setBillingRecords(recordsForContract);
  }, [contractId]);

  const filteredRecords = useMemo(() => {
    return billingRecords.filter(
      (record) =>
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.cycle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(record.issueDate).includes(searchTerm) ||
        formatDate(record.dueDate).includes(searchTerm)
    );
  }, [billingRecords, searchTerm]);

  const handleAddRecord = () => {
    if (!newRecord.dueDate || !newRecord.amount || !newRecord.issueDate) {
      alert("必須項目を入力してください: 発行日, 支払期日, 金額");
      return;
    }
    const newId = `INV-${Date.now().toString().slice(-6)}`;
    const completeNewRecord: BillingRecord = {
      ...newRecord,
      id: newId,
      contractId,
      status: "Unpaid", // Default status for new records
      generatedDate: formatISO(new Date(), { representation: "date" }),
    } as BillingRecord;

    // Update shared mock data (for demo purposes)
    setBillingRecords((prev) => [...prev, completeNewRecord]); // Update local state
    // Also re-filter from the global mock data to ensure consistency if other components modify it
    // setBillingRecords(mockBillingHistory.filter(br => br.contractId === contractId));
    setIsAddModalOpen(false);
    setNewRecord({
      contractId,
      currency: "JPY",
      cycle: "Monthly",
      status: "Unpaid",
      issueDate: formatISO(new Date(), { representation: "date" }),
    });
  };

  const handleMarkAsPaid = (recordId: string) => {
    const recordIndexInGlobalMock = mockBillingHistory.findIndex(
      (r) => r.id === recordId && r.contractId === contractId
    );
    if (recordIndexInGlobalMock !== -1) {
      // Re-filter from the updated global mock data to refresh the local state
      setBillingRecords([
        ...mockBillingHistory.filter((br) => br.contractId === contractId),
      ]);
    }
  };

  const handleInputChange = (
    field: keyof BillingRecord,
    value: string | number | null
  ) => {
    // Ensure amount is parsed as number, or null if empty
    const processedValue =
      field === "amount"
        ? value === ""
          ? null
          : parseInt(String(value), 10)
        : value;
    setNewRecord((prev) => ({ ...prev, [field]: processedValue }));
  };

  return (
    <Card className="mt-6">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>請求情報</CardTitle>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <PlusCircle size={16} /> 新規請求追加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新規請求記録の追加</DialogTitle>
                <DialogDescription>
                  契約ID: {contractId} の新しい請求情報を入力します。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="issueDate" className="text-right">
                    発行日
                  </Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={newRecord.issueDate || ""}
                    onChange={(e) =>
                      handleInputChange("issueDate", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    支払期日
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newRecord.dueDate || ""}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    金額 (JPY)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100000"
                    value={newRecord.amount ?? ""}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cycle" className="text-right">
                    請求サイクル
                  </Label>
                  <Select
                    value={newRecord.cycle}
                    onValueChange={(value: "Monthly" | "Annual") =>
                      handleInputChange("cycle", value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="サイクルを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">月次</SelectItem>
                      <SelectItem value="Annual">年次</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    備考
                  </Label>
                  <Input
                    id="notes"
                    placeholder="任意"
                    value={newRecord.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  キャンセル
                </Button>
                <Button onClick={handleAddRecord}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="請求書ID, ステータス, 日付などで検索..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>請求書ID</TableHead>
                <TableHead>発行日</TableHead>
                <TableHead>支払期日</TableHead>
                <TableHead>金額</TableHead>
                <TableHead>サイクル</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>支払日</TableHead>
                <TableHead>アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  const statusInfo = getBillingStatus(record);
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>{formatDate(record.issueDate)}</TableCell>
                      <TableCell>{formatDate(record.dueDate)}</TableCell>
                      <TableCell>
                        {record.amount.toLocaleString()} {record.currency}
                      </TableCell>
                      <TableCell>
                        {record.cycle === "Monthly" ? "月次" : "年次"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusBadgeClassName(
                            statusInfo.variant
                          )} flex items-center gap-1`}
                        >
                          {statusInfo.icon && <statusInfo.icon size={12} />}
                          {statusInfo.text}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(record.paymentDate)}</TableCell>
                      <TableCell>
                        {record.status === "Unpaid" &&
                          isValid(parseISO(record.dueDate)) &&
                          !isBefore(
                            startOfDay(parseISO(record.dueDate)),
                            startOfDay(new Date())
                          ) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsPaid(record.id)}
                            >
                              支払済にする
                            </Button>
                          )}
                        {/* Add other actions like "View Invoice", "Send Reminder" later */}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    該当する請求記録がありません。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {/* Optional: Add pagination for billing records if needed */}
    </Card>
  );
}
