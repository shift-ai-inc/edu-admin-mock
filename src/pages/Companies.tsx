import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from "@/components/ui/button"; // Import buttonVariants
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Search, PlusCircle, ArrowUpDown, ExternalLink } from "lucide-react";
import { cn } from '@/lib/utils';
import { format, differenceInDays, parseISO } from 'date-fns'; // date-fns for date manipulation

// --- Mock Data ---
// Expanded mock data to include new fields and more entries
const mockCompanies = [
  { id: 1, name: "株式会社テクノロジー", plan: "プレミアム", startDate: "2023-01-15", endDate: "2025-01-14", users: 230, maxUsers: 250, adminCount: 5, status: "アクティブ" },
  { id: 2, name: "グローバル商事", plan: "エンタープライズ", startDate: "2022-11-01", endDate: "2024-10-31", users: 1450, maxUsers: 1500, adminCount: 20, status: "アクティブ" },
  { id: 3, name: "未来建設", plan: "スタンダード", startDate: "2023-05-20", endDate: "2024-05-19", users: 780, maxUsers: 800, adminCount: 10, status: "休止中" },
  { id: 4, name: "エコソリューションズ", plan: "スタンダード", startDate: "2024-03-01", endDate: "2024-08-31", users: 115, maxUsers: 120, adminCount: 3, status: "アクティブ" }, // Near expiry
  { id: 5, name: "デジタルメディア", plan: "プレミアム", startDate: "2023-09-10", endDate: "2024-09-09", users: 450, maxUsers: 500, adminCount: 8, status: "審査中" },
  { id: 6, name: "ヘルステック・イノベーションズ", plan: "エンタープライズ", startDate: "2024-01-01", endDate: "2025-12-31", users: 300, maxUsers: 350, adminCount: 7, status: "アクティブ" },
  { id: 7, name: "スマート物流", plan: "スタンダード", startDate: "2023-07-01", endDate: "2024-06-30", users: 500, maxUsers: 600, adminCount: 12, status: "アクティブ" }, // Near expiry
  { id: 8, name: "クリエイティブデザイン", plan: "プレミアム", startDate: "2024-02-15", endDate: "2025-02-14", users: 80, maxUsers: 100, adminCount: 4, status: "アクティブ" },
  { id: 9, name: "フードサービス・ジャパン", plan: "スタンダード", startDate: "2023-10-01", endDate: "2024-09-30", users: 1200, maxUsers: 1300, adminCount: 15, status: "休止中" },
  { id: 10, name: "教育ソリューションズ", plan: "エンタープライズ", startDate: "2023-04-01", endDate: "2026-03-31", users: 650, maxUsers: 700, adminCount: 9, status: "アクティブ" },
  { id: 11, name: "リージョナルバンク", plan: "プレミアム", startDate: "2024-05-01", endDate: "2025-04-30", users: 400, maxUsers: 450, adminCount: 6, status: "審査中" },
  { id: 12, name: "アドバンスト・マニュファクチャリング", plan: "エンタープライズ", startDate: "2023-03-10", endDate: "2025-03-09", users: 2500, maxUsers: 3000, adminCount: 25, status: "アクティブ" },
];

type Company = typeof mockCompanies[0];
type SortKey = keyof Company | null;
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 5; // Number of items per page for pagination

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all', 'アクティブ', '休止中', '審査中'
  const [planFilter, setPlanFilter] = useState<string>('all'); // 'all', 'スタンダード', 'プレミアム', 'エンタープライズ'
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = mockCompanies.filter(company => {
      // Status Filter
      if (statusFilter !== 'all' && company.status !== statusFilter) {
        return false;
      }
      // Plan Filter
      if (planFilter !== 'all' && company.plan !== planFilter) {
        return false;
      }
      // Search Term Filter (case-insensitive)
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
          company.name.toLowerCase().includes(lowerSearchTerm) ||
          company.plan.toLowerCase().includes(lowerSearchTerm) ||
          company.status.toLowerCase().includes(lowerSearchTerm)
          // Add other searchable fields if needed
        );
      }
      return true;
    });

    // Sorting
    if (sortKey) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        // Handle different data types for comparison
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        // Add more type handling if necessary (e.g., dates)
        if (sortKey === 'startDate' || sortKey === 'endDate') {
           const dateA = parseISO(aValue as string);
           const dateB = parseISO(bValue as string);
           return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        }

        return 0; // Default no sort if types mismatch or unhandled
      });
    }

    return filtered;
  }, [searchTerm, sortKey, sortDirection, statusFilter, planFilter]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredAndSortedCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedCompanies.slice(startIndex, endIndex);
  }, [filteredAndSortedCompanies, currentPage]);

  // --- Handlers ---
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

   const handlePlanFilterChange = (value: string) => {
    setPlanFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Helper Functions ---
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "アクティブ": return "bg-green-100 text-green-800";
      case "休止中": return "bg-red-100 text-red-800";
      case "審査中": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isNearExpiry = (endDate: string) => {
    const daysRemaining = differenceInDays(parseISO(endDate), new Date());
    return daysRemaining >= 0 && daysRemaining <= 60; // Highlight if expiring within 60 days
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'yyyy/MM/dd');
    } catch (e) {
      return '無効な日付';
    }
  };

  // --- Render ---
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header and Controls */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">企業一覧</h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
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
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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
             <Select value={planFilter} onValueChange={handlePlanFilterChange}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="プラン" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全プラン</SelectItem>
                <SelectItem value="スタンダード">スタンダード</SelectItem>
                <SelectItem value="プレミアム">プレミアム</SelectItem>
                <SelectItem value="エンタープライズ">エンタープライズ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Add Company Button */}
          <Link to="/companies/add" className={cn(buttonVariants({ variant: "default", size: "default" }), 'w-full md:w-auto')}> {/* Apply buttonVariants correctly */}
            <PlusCircle className="mr-2 h-4 w-4" />
            新規企業を追加
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Add sorting capability to headers */}
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('name')}>
                企業名 <ArrowUpDown className={`inline-block ml-1 h-3 w-3 ${sortKey === 'name' ? 'text-gray-900' : 'text-gray-400'}`} />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('plan')}>
                プラン <ArrowUpDown className={`inline-block ml-1 h-3 w-3 ${sortKey === 'plan' ? 'text-gray-900' : 'text-gray-400'}`} />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('startDate')}>
                契約開始日 <ArrowUpDown className={`inline-block ml-1 h-3 w-3 ${sortKey === 'startDate' ? 'text-gray-900' : 'text-gray-400'}`} />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('endDate')}>
                契約終了日 <ArrowUpDown className={`inline-block ml-1 h-3 w-3 ${sortKey === 'endDate' ? 'text-gray-900' : 'text-gray-400'}`} />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50 text-right" onClick={() => handleSort('users')}>
                ユーザー数 <ArrowUpDown className={`inline-block ml-1 h-3 w-3 ${sortKey === 'users' ? 'text-gray-900' : 'text-gray-400'}`} />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50 text-right" onClick={() => handleSort('adminCount')}>
                管理者数 <ArrowUpDown className={`inline-block ml-1 h-3 w-3 ${sortKey === 'adminCount' ? 'text-gray-900' : 'text-gray-400'}`} />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort('status')}>
                ステータス <ArrowUpDown className={`inline-block ml-1 h-3 w-3 ${sortKey === 'status' ? 'text-gray-900' : 'text-gray-400'}`} />
              </TableHead>
              <TableHead className="text-right">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCompanies.length > 0 ? (
              paginatedCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  className={cn(
                    isNearExpiry(company.endDate) && company.status === 'アクティブ' ? 'bg-orange-50 hover:bg-orange-100' : '', // Highlight near expiry
                    'hover:bg-gray-50'
                  )}
                >
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.plan}</TableCell>
                  <TableCell>{formatDate(company.startDate)}</TableCell>
                  <TableCell className={cn(isNearExpiry(company.endDate) && company.status === 'アクティブ' ? 'text-orange-600 font-semibold' : '')}>
                    {formatDate(company.endDate)}
                    {isNearExpiry(company.endDate) && company.status === 'アクティブ' && <span className="ml-1 text-xs">(期限近)</span>}
                  </TableCell>
                  <TableCell className="text-right">{company.users.toLocaleString()} / {company.maxUsers.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{company.adminCount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(company.status)}`}>
                      {company.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/companies/update/${company.id}`}>
                        詳細 <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                  該当する企業が見つかりません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                  className={cn(currentPage === 1 ? 'pointer-events-none opacity-50' : '')}
                />
              </PaginationItem>

              {/* Simplified Pagination Links - Consider a more robust implementation for many pages */}
              {[...Array(totalPages)].map((_, i) => {
                 const page = i + 1;
                 // Basic logic to show first, last, current, and adjacent pages
                 const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                 const showEllipsis = Math.abs(page - currentPage) === 2 && totalPages > 5;

                 if (showEllipsis) {
                   // Show ellipsis only once between groups of pages
                   if (page < currentPage && currentPage > 3) {
                      return <PaginationItem key={`ellipsis-start-${page}`}><PaginationEllipsis /></PaginationItem>;
                   } else if (page > currentPage && totalPages - currentPage > 2) {
                      return <PaginationItem key={`ellipsis-end-${page}`}><PaginationEllipsis /></PaginationItem>;
                   }
                   return null; // Avoid duplicate ellipsis
                 }

                 if (showPage) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                 }
                 return null; // Don't render pages far from current if many pages exist
              })}


              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                  className={cn(currentPage === totalPages ? 'pointer-events-none opacity-50' : '')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
