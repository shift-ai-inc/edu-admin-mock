import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockCompanyAdmins } from '@/data/mockCompanyAdmins'; // deleteMockCompanyAdmin removed as delete action is removed from this page
import { getGroupNamesByIds } from '@/data/mockGroups';
import { CompanyAdministrator, getAuthorityDisplayName } from '@/types/companyAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react'; // Removed Edit, Trash2, KeyRound, Eye
// AlertDialog components are removed as their triggers (action buttons) are removed.
// useToast might still be used for other notifications, or can be removed if not. Keeping for now.
import { useToast } from '@/hooks/use-toast'; 
// addPermissionLog might still be used if other actions on this page log, or can be removed. Keeping for now.
// import { addPermissionLog } from '@/data/mockPermissionLogs'; // Removed as actions that log are gone

const CompanyAdminList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // const { toast } = useToast(); // toast is not used if actions are removed
  const navigate = useNavigate();
  const [dataVersion, setDataVersion] = useState(0); // Used to force re-render if data changes elsewhere

  // forceRerender can be removed if no actions on this page modify the list directly.
  // const forceRerender = useCallback(() => setDataVersion(prev => prev + 1), []); 

  const filteredAdmins = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dataVersion; 
    
    return mockCompanyAdmins.filter(admin =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, dataVersion]);

  // handleDelete and handlePasswordReset functions are removed as action buttons are gone.
  // Associated AlertDialogs are also removed.

  return (
    <div className="container mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">企業管理者一覧</h1>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link to="/company-admins/add">
            <PlusCircle className="mr-2 h-4 w-4" /> 新規企業管理者登録
          </Link>
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="氏名またはメールアドレスで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-full sm:max-w-sm"
        />
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">氏名</TableHead>
              <TableHead className="min-w-[200px]">メールアドレス</TableHead>
              <TableHead className="min-w-[100px]">権限</TableHead>
              <TableHead className="min-w-[200px]">所属グループ</TableHead>
              <TableHead className="min-w-[120px]">登録日</TableHead>
              {/* Action column header removed */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow 
                  key={admin.id} 
                  onClick={() => navigate(`/company-admins/detail/${admin.id}`)}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={admin.authority === 'system_admin' ? 'default' : 'secondary'}>
                      {getAuthorityDisplayName(admin.authority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getGroupNamesByIds(admin.affiliatedGroupIds).map(groupName => (
                        <Badge key={groupName} variant="outline" className="text-xs">{groupName}</Badge>
                      ))}
                      {admin.affiliatedGroupIds.length === 0 && <span className="text-xs text-gray-500">なし</span>}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                  {/* Action cell removed */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-10"> {/* colSpan changed from 6 to 5 */}
                  該当する企業管理者は見つかりません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompanyAdminList;
