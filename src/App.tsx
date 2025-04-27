import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  Building,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCog,
  ClipboardList,
  ShieldCheck, // New icon for System Admins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Import Pages
import Dashboard from "./pages/Dashboard";
import SystemAdminManagement from "./pages/SystemAdminManagement"; // Renamed import
import AddSystemAdmin from "./pages/AddSystemAdmin"; // Import new page
import Companies from "./pages/Companies";
import AddCompany from "./pages/AddCompany";
import UpdateCompany from "./pages/UpdateCompany";
import Contracts from "./pages/Contracts";
import Surveys from "./pages/Surveys";
import Assessments from "./pages/Assessments";
import AddAssessment from "./pages/AddAssessment";
import AssessmentDetail from "./pages/AssessmentDetail";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";
import CompanyAdmins from "./pages/CompanyAdmins";
import AddCompanyAdmin from "./pages/AddCompanyAdmin";

const navItems = [
  // { to: '/', label: 'ダッシュボード', icon: LayoutDashboard },
  { to: "/system-admins", label: "システム管理者管理", icon: ShieldCheck }, // Renamed label, updated path, new icon
  { to: "/companies", label: "企業一覧", icon: Building },
  { to: "/company-admins", label: "企業管理者", icon: UserCog },
  { to: "/contracts", label: "契約管理", icon: FileText },
  // { to: '/surveys', label: 'アンケート', icon: FileText },
  { to: "/assessments", label: "アセスメント", icon: ClipboardList },
  { to: "/settings", label: "設定", icon: Settings },
];

function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col",
        isOpen ? "w-60" : "w-16"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
        {isOpen && <span className="text-xl font-semibold">EduAdmin</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-700"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>
      <nav className="flex-grow mt-4 space-y-1 px-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.to ||
                      (item.to !== "/" &&
                        location.pathname.startsWith(item.to + "/"))
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    !isOpen && "justify-center"
                  )}
                >
                  <item.icon size={20} className={cn(isOpen && "mr-3")} />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right" sideOffset={5}>
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <div className="p-2 border-t border-gray-700">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full flex items-center text-gray-300 hover:bg-gray-700 hover:text-white",
                  !isOpen && "justify-center"
                )}
              >
                <LogOut size={20} className={cn(isOpen && "mr-3")} />
                {isOpen && <span>ログアウト</span>}
              </Button>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right" sideOffset={5}>
                ログアウト
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to open

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // TODO: Implement actual authentication check
  const isAuthenticated = true; // Assume user is logged in for now

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-0">
            {" "}
            {/* Removed padding here, apply padding within pages */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* System Administrator Management */}
              <Route
                path="/system-admins"
                element={<SystemAdminManagement />}
              />{" "}
              {/* Renamed route */}
              <Route
                path="/system-admins/add"
                element={<AddSystemAdmin />}
              />{" "}
              {/* Added route */}
              {/* Company Management */}
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/add" element={<AddCompany />} />
              <Route
                path="/companies/update/:companyId"
                element={<UpdateCompany />}
              />
              {/* Company Admins */}
              <Route path="/company-admins" element={<CompanyAdmins />} />
              <Route path="/company-admins/add" element={<AddCompanyAdmin />} />
              {/* Contract Management */}
              <Route path="/contracts" element={<Contracts />} />
              {/* Surveys */}
              <Route path="/surveys" element={<Surveys />} />
              {/* Assessments */}
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/assessments/add" element={<AddAssessment />} />
              <Route
                path="/assessments/detail/:assessmentId"
                element={<AssessmentDetail />}
              />
              {/* Settings */}
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
