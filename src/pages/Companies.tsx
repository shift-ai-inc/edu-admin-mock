import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Link removed as it's no longer used for navigation here
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components
import { AddCompanyForm } from "@/components/forms/AddCompanyForm"; // Import the new form component
import { Search, PlusCircle, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast"; // Import toast for potential parent-level notifications

// Simplified mock data - removed plan, startDate, endDate, users, maxUsers
const mockCompanies = [
  { id: 1, name: "株式会社テクノロジー", adminCount: 5, status: "アクティブ" },
  { id: 2, name: "グローバル商事", adminCount: 20, status: "アクティブ" },
  { id: 3, name: "未来建設", adminCount: 10, status: "休止中" },
  { id: 4, name: "エコソリューションズ", adminCount: 3, status: "アクティブ" },
  { id: 5, name: "デジタルメディア", adminCount: 8, status: "審査中" },
  {
    id: 6,
    name: "ヘルステック・イノベーションズ",
    adminCount: 7,
    status: "アクティブ",
  },
  { id: 7, name: "スマート物流", adminCount: 12, status: "アクティブ" },
  {
    id: 8,
    name: "クリエイティブデザイン",
    adminCount: 4,
    status: "アクティブ",
  },
  { id: 9, name: "フードサービス・ジャパン", adminCount: 15, status: "休止中" },
  { id: 10, name: "教育ソリューションズ", adminCount: 9, status: "アクティブ" },
  { id: 11, name: "リージョナルバンク", adminCount: 6, status: "審査中" },
  {
    id: 12,
    name: "アドバンスト・マニュファクチャリング",
    adminCount: 25,
    status: "アクティブ",
  },
];

type SortKey = "name" | "adminCount" | "status" | null;
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 5;

export default function Companies() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false); // State for modal

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedCompanies = useMemo(() => {
    const filtered = mockCompanies.filter((company) => {
      if (statusFilter !== "all" && company.status !== statusFilter) {
        return false;
      }
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          company.name.toLowerCase().includes(lowerSearchTerm) ||
          company.status.toLowerCase().includes(lowerSearchTerm)
        );
      }
      return true;
    });

    if (sortKey) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, sortKey, sortDirection, statusFilter]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(
    filteredAndSortedCompanies.length / ITEMS_PER_PAGE
  );
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedCompanies.slice(startIndex, endIndex);
  }, [filteredAndSortedCompanies, currentPage]);

  // --- Handlers ---
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (companyId: number) => {
    navigate(`/companies/update/${companyId}`);
  };

  const handleAddCompanySuccess = () => {
    setIsAddCompanyModalOpen(false);
    // TODO: Implement logic to refresh the company list from the backend
    // For now, mockCompanies is static, so a visual refresh isn't automatic.
    // You might re-fetch data or update local state if managing data client-side.
    toast({
      title: "企業が正常に追加されました。",
      description: "企業リストが更新されました（モック）。", // Placeholder
    });
  };

  // --- Helper Functions ---
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "アクティブ":
        return "bg-green-100 text-green-800";
      case "休止中":
        return "bg-red-100 text-red-800";
      case "審査中":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // --- Render ---
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>企業一覧</CardTitle>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="企業名などで検索..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-9 w-full md:w-[250px] lg:w-[300px]"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全ステータス</SelectItem>
                  <SelectItem value="アクティブ">アクティブ</SelectItem>
                  <SelectItem value="休止中">休止中</SelectItem>
                  <SelectItem value="審査中">審査中</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Add Company Button with Modal */}
            <Dialog open={isAddCompanyModalOpen} onOpenChange={setIsAddCompanyModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto shrink-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  新規企業を追加
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl"> {/* Adjusted max-width for better form layout */}
                <DialogHeader>
                  <DialogTitle>新規企業アカウント作成</DialogTitle>
                </DialogHeader>
                <div className="pt-4">
                  <AddCompanyForm onSuccess={handleAddCompanySuccess} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("name")}
                  >
                    企業名{" "}
                    <ArrowUpDown
                      className={`inline-block ml-1 h-3 w-3 ${
                        sortKey === "name" ? "text-gray-900" : "text-gray-400"
                      }`}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50 text-right"
                    onClick={() => handleSort("adminCount")}
                  >
                    管理者数{" "}
                    <ArrowUpDown
                      className={`inline-block ml-1 h-3 w-3 ${
                        sortKey === "adminCount" ? "text-gray-900" : "text-gray-400"
                      }`}
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("status")}
                  >
                    ステータス{" "}
                    <ArrowUpDown
                      className={`inline-block ml-1 h-3 w-3 ${
                        sortKey === "status" ? "text-gray-900" : "text-gray-400"
                      }`}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company) => (
                    <TableRow
                      key={company.id}
                      onClick={() => handleRowClick(company.id)}
                      className={cn(
                        "cursor-pointer",
                        "hover:bg-gray-50"
                      )}
                    >
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell className="text-right">
                        {company.adminCount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            company.status
                          )}`}
                        >
                          {company.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-gray-500"
                    >
                      該当する企業が見つかりません。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={cn(
                        currentPage === 1 ? "pointer-events-none opacity-50" : ""
                      )}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1;
                    const showEllipsis =
                      Math.abs(page - currentPage) === 2 && totalPages > 5;

                    if (showEllipsis) {
                      const key =
                        page < currentPage
                          ? `ellipsis-start-${page}`
                          : `ellipsis-end-${page}`;
                      const existingEllipsis = document.querySelector(
                        `[data-ellipsis-key="${key}"]`
                      );
                      if (!existingEllipsis) {
                        return (
                          <PaginationItem key={key} data-ellipsis-key={key}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    if (showPage) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={cn(
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
