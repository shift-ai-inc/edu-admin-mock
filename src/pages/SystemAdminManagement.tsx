import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/data-table'; // Import the DataTable
import { columns } from './system-admin-columns'; // Import the columns
import { mockSystemAdmins } from '@/data/mockSystemAdmins'; // Import mock data

export default function SystemAdminManagement() {
  const navigate = useNavigate();
  // TODO: Replace mockSystemAdmins with data fetched from an API
  const data = mockSystemAdmins;

  const handleAddNewAdmin = () => {
    navigate('/system-admins/add');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">システム管理者管理</h1>
        <Button onClick={handleAddNewAdmin}>
          <PlusCircle className="mr-2 h-4 w-4" /> 新規登録
        </Button>
      </div>
      <div className="bg-white p-6 shadow rounded-lg">
         {/* Use the DataTable component */}
         <DataTable
            columns={columns}
            data={data}
            filterInputPlaceholder="氏名またはメールアドレスで検索..."
            filterColumnId="name" // Or combine filters if DataTable supports it, or filter on multiple columns
            // Consider adding another filter input specifically for email if needed
         />
      </div>
    </div>
  );
}
