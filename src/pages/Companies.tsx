import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Select for status filter is removed as status is not in the shared mock data
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
} from "@/components/ui/dialog";
import { AddCompanyForm } from "@/components/forms/AddCompanyForm";
import { Search, PlusCircle, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { mockCompanies } from '@/data/mockCompanies'; // Import shared mockCompanies
import type { Company } from '@/types/company'; // Import Company type

type SortKey = "name" | "employeeCount" | null; // Updated SortKey
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 5;

export default function Companies() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name"); // Default sort by name
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  // statusFilter is removed
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = [...mockCompanies]; // Use the imported mockCompanies

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((company) =>
        company.name.toLowerCase().includes(lowerSearchTerm)
      );
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (sortKey === "employeeCount") {
          return sortDirection === "asc" ? (aValue ?? 0) - (bValue ?? 0) : (bValue ?? 0) - (aValue ?? 0);
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
  }, [searchTerm, sortKey, sortDirection]);

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

  // handleStatusFilterChange is removed

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Updated to use string companyId from the shared mock data
  const handleRowClick = (companyId: string) => {
    navigate(`/companies/update/${companyId}`);
  };

  const handleAddCompanySuccess = () => {
    setIsAddCompanyModalOpen(false);
    // This will now reflect changes if AddCompanyForm modifies the shared mockCompanies array
    // or if a re-fetch mechanism were in place.
    // For now, we rely on mockCompanies being potentially updated by AddCompanyForm if it were to do so.
    // A more robust solution would involve state management or re-fetching.
    toast({
      title: "企業が正常に追加されました。",
      description: "企業リストが更新されました。",
    });
     // Force a re-render by updating a dummy state or re-calculating sorted/filtered data
    setSearchTerm(st => st); // Simple way to trigger re-evaluation of memos
    setCurrentPage(1); // Reset to first page
  };

  // getStatusBadgeClass is removed

  // --- Render ---
  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>企業一覧</CardTitle>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4">
            {/* Search */}
            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="企業名で検索..." // Updated placeholder
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-9 w-full md:w-[250px] lg:w-[300px]"
                />
              </div>
              {/* Status Select removed */}
            </div>
            {/* Add Company Button with Modal */}
            <Dialog open={isAddCompanyModalOpen} onOpenChange={setIsAddCompanyModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto shrink-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  新規企業を追加
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>新規企業アカウント作成</DialogTitle>
                </DialogHeader>
                <div className="pt-4">
                  {/* 
                    Pass a callback to AddCompanyForm if it needs to inform this parent 
                    about new data. For mock data, AddCompanyForm would need to directly 
                    mutate the imported mockCompanies array or use a shared state.
                    For simplicity, handleAddCompanySuccess now just shows a toast.
                    A real app would refetch or update a global store.
                  */}
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
                    onClick={() => handleSort("employeeCount")}
                  >
                    従業員数{" "}
                    <ArrowUpDown
                      className={`inline-block ml-1 h-3 w-3 ${
                        sortKey === "employeeCount" ? "text-gray-900" : "text-gray-400"
                      }`}
                    />
                  </TableHead>
                  {/* Status column removed */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompanies.length > 0 ? (
                  paginatedCompanies.map((company: Company) => ( // Ensure company is typed
                    <TableRow
                      key={company.id}
                      onClick={() => handleRowClick(company.id)} // company.id is now string
                      className={cn(
                        "cursor-pointer",
                        "hover:bg-gray-50"
                      )}
                    >
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell className="text-right">
                        {company.employeeCount?.toLocaleString() ?? '-'} 
                      </TableCell>
                      {/* Status cell removed */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2} // Updated colSpan
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
                    // Simplified pagination display logic for brevity
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
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
                    } else if (
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                        // Ensure ellipsis is not duplicated if already handled by a sibling
                        const key = `ellipsis-${page < currentPage ? 'start' : 'end'}`;
                        if (!document.querySelector(`[data-ellipsis-key="${key}"]`)) {
                            return (
                                <PaginationItem key={key} data-ellipsis-key={key}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }
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
