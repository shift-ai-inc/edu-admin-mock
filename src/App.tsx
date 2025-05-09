import { Routes, Route, Navigate, useLocation, matchPath } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyInfo from './pages/CompanyInfo';
import CompanyAdminList from './pages/CompanyAdminList';
import CompanyAdminCreate from './pages/CompanyAdminCreate';
import CompanyAdminEdit from './pages/CompanyAdminEdit';
import GeneralUserList from './pages/GeneralUserList';
import GeneralUserDetail from './pages/GeneralUserDetail';
import BulkUserRegistration from './pages/BulkUserRegistration';
import GroupManagement from './pages/GroupManagement';
import GroupDetail from './pages/GroupDetail';

import AssessmentList from './pages/AssessmentList';
import AssessmentDetails from './pages/AssessmentDetails';
import AssessmentDeliveryList from './pages/AssessmentDeliveryList';
import AssessmentDeliveryDetailsPage from './pages/AssessmentDeliveryDetailsPage';
import Assessment from './pages/Assessment';
import DataAnalysisPage from './pages/DataAnalysisPage'; // Assessment Data Analysis

import SurveyList from './pages/SurveyList';
import SurveyDetails from './pages/SurveyDetails';
import SurveyDeliveryList from './pages/SurveyDeliveryList';
import SurveyDeliveryDetailsPage from './pages/SurveyDeliveryDetailsPage'; // Added import
import Survey from './pages/Survey';
import SurveyDataAnalysisPage from './pages/SurveyDataAnalysisPage'; // Survey Data Analysis

import ContractManagement from './pages/ContractManagement';
import PermissionLogList from './pages/PermissionLogList';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { Toaster } from "@/components/ui/toaster";


function App() {
  const location = useLocation();

  const publicPaths = [
    '/login',
    '/assessment/:assessmentId',
    '/survey/:surveyId',
  ];

  const isPublicPath = publicPaths.some(path =>
    matchPath(path, location.pathname)
  );

  const isAuthenticated = !isPublicPath;

  const AuthLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 sm:ml-64">
        {children}
      </main>
      <Toaster />
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/assessment/:assessmentId" element={<Assessment />} />
      <Route path="/survey/:surveyId" element={<Survey />} />

      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <AuthLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:companyId/info" element={<CompanyInfo />} />
                <Route path="/companies/:companyId/admins" element={<CompanyAdminList />} />
                <Route path="/companies/:companyId/admins/create" element={<CompanyAdminCreate />} />
                <Route path="/companies/:companyId/admins/edit/:adminId" element={<CompanyAdminEdit />} />

                <Route path="/company-admins" element={<CompanyAdminList />} />
                <Route path="/company-admins/create" element={<CompanyAdminCreate />} />
                <Route path="/company-admins/edit/:adminId" element={<CompanyAdminEdit />} />

                <Route path="/general-users" element={<GeneralUserList />} />
                <Route path="/general-users/:userId" element={<GeneralUserDetail />} />
                <Route path="/general-users/bulk-register" element={<BulkUserRegistration />} />
                <Route path="/groups" element={<GroupManagement />} />
                <Route path="/groups/:groupId" element={<GroupDetail />} />

                <Route path="/assessments" element={<AssessmentList />} />
                <Route path="/assessments/:assessmentId" element={<AssessmentDetails />} />
                <Route path="/assessment-deliveries" element={<AssessmentDeliveryList />} />
                <Route path="/assessment-deliveries/:deliveryId" element={<AssessmentDeliveryDetailsPage />} />
                <Route path="/assessments/data-analysis" element={<DataAnalysisPage />} />

                <Route path="/surveys" element={<SurveyList />} />
                <Route path="/surveys/:surveyId" element={<SurveyDetails />} />
                <Route path="/survey-deliveries" element={<SurveyDeliveryList />} />
                <Route path="/survey-deliveries/:deliveryId" element={<SurveyDeliveryDetailsPage />} /> {/* Added route */}
                <Route path="/surveys/data-analysis" element={<SurveyDataAnalysisPage />} />

                <Route path="/contracts" element={<ContractManagement />} />
                <Route path="/logs/permissions" element={<PermissionLogList />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/company-info" element={<CompanyInfo />} /> {/* Ensure this is correctly placed if it's a top-level page */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AuthLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
