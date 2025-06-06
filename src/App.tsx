import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom"; 
import {
  Building,
  FileText,
  Settings as SettingsIcon,
  UserCog,
  ShieldCheck,
  ClipboardList,
  // ShieldAlert, // Removed as Permission Management is removed
  Info, 
} from "lucide-react";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import SystemAdminManagement from "./pages/SystemAdminManagement";
import AddSystemAdmin from "./pages/AddSystemAdmin";
import SystemAdminDetail from "./pages/SystemAdminDetail";
import EditSystemAdmin from "./pages/EditSystemAdmin";
import Companies from "./pages/Companies";
import AddCompany from "./pages/AddCompany";
import UpdateCompany from "./pages/UpdateCompany";
import Contracts from "./pages/Contracts";
import ContractDetail from "./pages/ContractDetail";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login"; 
import CompanyAdminList from "./pages/CompanyAdminList"; // Renamed import for clarity
import AddCompanyAdmin from "./pages/AddCompanyAdmin";
import CompanyAdminDetail from "./pages/CompanyAdminDetail";
import Profile from "./pages/Profile";
import AssessmentList from "./pages/AssessmentList";
import AssessmentDetail from "./pages/AssessmentDetail";
import AssessmentQuestionDetail from "./pages/AssessmentQuestionDetail";
import SurveyList from "./pages/SurveyList";
import SurveyDetail from "./pages/SurveyDetail";
import SurveyQuestionDetail from "./pages/SurveyQuestionDetail";
import CompanyInfo from "./pages/CompanyInfo"; 

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    to: "/assessments",
    label: "アセスメント",
    icon: ClipboardList,
  },
  { to: "/companies", label: "企業一覧", icon: Building },
  { to: "/company-admins", label: "企業管理者", icon: UserCog }, // Route for CompanyAdminList
  { to: "/contracts", label: "契約管理", icon: FileText },
  { to: "/system-admins", label: "システム管理者管理", icon: ShieldCheck },
  { to: "/settings", label: "設定", icon: SettingsIcon },
  // { to: "/company-info", label: "企業情報(テスト)", icon: Info }, // Test route for CompanyInfo, can be removed if not primary
];

function AppContent() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/auth"
        element={<Login onLoginSuccess={handleLoginSuccess} />}
      />
      <Route
        element={
          <Layout
            navItems={navItems}
          />
        }
      >
        <Route path="/" element={<Navigate to="/assessments" replace />} />
        
        <Route path="/dashboard-placeholder" element={<Dashboard />} />

        <Route path="/system-admins" element={<SystemAdminManagement />} />
        <Route path="/system-admins/add" element={<AddSystemAdmin />} />
        <Route
          path="/system-admins/detail/:adminId"
          element={<SystemAdminDetail />}
        />
        <Route
          path="/system-admins/edit/:adminId"
          element={<EditSystemAdmin />}
        />

        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/add" element={<AddCompany />} />
        <Route
          path="/companies/update/:companyId"
          element={<UpdateCompany />}
        />
        {/* Optional: Keep if CompanyInfo is a distinct page, otherwise remove if UpdateCompany covers it */}
        <Route path="/company-info/:companyId" element={<CompanyInfo />} /> 


        {/* Company Administrator Routes */}
        <Route path="/company-admins" element={<CompanyAdminList />} />
        <Route path="/company-admins/add" element={<AddCompanyAdmin />} />
        <Route
          path="/company-admins/detail/:adminId"
          element={<CompanyAdminDetail />}
        />
        {/* Note: No separate /company-admins/edit/:adminId route as editing is handled in CompanyAdminDetail dialog */}

        <Route path="/contracts" element={<Contracts />} />
        <Route
          path="/contracts/detail/:contractId"
          element={<ContractDetail />}
        />

        <Route path="/assessments" element={<AssessmentList />} />
        <Route
          path="/assessments/detail/:assessmentId"
          element={<AssessmentDetail />}
        />
        <Route
          path="/assessments/questions/:questionVersionId"
          element={<AssessmentQuestionDetail />}
        />

        <Route path="/surveys" element={<SurveyList />} />
        <Route path="/surveys/detail/:surveyId" element={<SurveyDetail />} />
        <Route
          path="/surveys/questions/:questionVersionId"
          element={<SurveyQuestionDetail />}
        />
        
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="*" element={<Navigate to="/assessments" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
