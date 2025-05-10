import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom"; // Added useNavigate
import {
  LayoutDashboard,
  Building,
  FileText,
  Settings as SettingsIcon,
  UserCog,
  ShieldCheck,
  ClipboardList,
  Vote,
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
import Login from "./pages/Login"; // Re-imported Login page
import CompanyAdmins from "./pages/CompanyAdmins";
import AddCompanyAdmin from "./pages/AddCompanyAdmin";
import CompanyAdminDetail from "./pages/CompanyAdminDetail";
import Profile from "./pages/Profile";
import AssessmentList from "./pages/AssessmentList";
import AssessmentDetail from "./pages/AssessmentDetail";
import AssessmentQuestionDetail from "./pages/AssessmentQuestionDetail";
import SurveyList from "./pages/SurveyList";
import SurveyDetail from "./pages/SurveyDetail";
import SurveyQuestionDetail from "./pages/SurveyQuestionDetail";

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
}

interface LayoutProps {
  navItems: NavItem[];
  isAuthenticated: boolean; // Add isAuthenticated prop
  onLogout: () => void;
}

const navItems: NavItem[] = [
  { to: "/", label: "ダッシュボード", icon: LayoutDashboard },
  {
    to: "/assessments",
    label: "アセスメント",
    icon: ClipboardList,
  },
  {
    to: "/surveys",
    label: "サーベイ",
    icon: Vote,
  },
  { to: "/companies", label: "企業一覧", icon: Building },
  { to: "/company-admins", label: "企業管理者", icon: UserCog },
  { to: "/contracts", label: "契約管理", icon: FileText },
  { to: "/system-admins", label: "システム管理者管理", icon: ShieldCheck },
  { to: "/settings", label: "設定", icon: SettingsIcon },
];

function AppContent() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // In a real app, you might set auth tokens here
    navigate("/");
  };

  const handleLogout = () => {
    // In a real app, you might clear auth tokens here
    navigate("/auth");
  };

  return (
    <Routes>
      {/* Auth route is outside the main Layout */}
      <Route
        path="/auth"
        element={<Login onLoginSuccess={handleLoginSuccess} />}
      />

      {/* Main application routes wrapped by Layout */}
      <Route
        element={
          <Layout
            navItems={navItems}
            isAuthenticated={true}
            onLogout={handleLogout}
          />
        }
      >
        <Route path="/" element={<Dashboard />} />

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

        <Route path="/company-admins" element={<CompanyAdmins />} />
        <Route path="/company-admins/add" element={<AddCompanyAdmin />} />
        <Route
          path="/company-admins/detail/:adminId"
          element={<CompanyAdminDetail />}
        />

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

        {/* Catch-all for routes within the layout, redirect to dashboard */}
        {/* Ensure this is the last route within the Layout-wrapped routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      {/* A general catch-all if no routes match (e.g. if /auth is mistyped), could redirect to /auth or / */}
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
