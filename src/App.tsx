import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  FileText,
  Settings,
  LogOut,
  UserCog,
  ShieldCheck,
  LogIn,
  ClipboardList,
  Vote, // Re-added for Survey feature
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Import Pages
import Dashboard from './pages/Dashboard';
import SystemAdminManagement from './pages/SystemAdminManagement';
import AddSystemAdmin from './pages/AddSystemAdmin';
import SystemAdminDetail from './pages/SystemAdminDetail';
import EditSystemAdmin from './pages/EditSystemAdmin';
import Companies from './pages/Companies';
import AddCompany from './pages/AddCompany';
import UpdateCompany from './pages/UpdateCompany';
import Contracts from './pages/Contracts';
import ContractDetail from './pages/ContractDetail';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import CompanyAdmins from './pages/CompanyAdmins';
import AddCompanyAdmin from './pages/AddCompanyAdmin';
import CompanyAdminDetail from './pages/CompanyAdminDetail';
import Profile from './pages/Profile';
import AssessmentList from './pages/AssessmentList';
import AssessmentDetail from './pages/AssessmentDetail';
import AssessmentQuestionDetail from './pages/AssessmentQuestionDetail';
import SurveyList from './pages/SurveyList'; // Added
import SurveyDetail from './pages/SurveyDetail'; // Added
import SurveyQuestionDetail from './pages/SurveyQuestionDetail'; // Added


interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { to: '/', label: 'ダッシュボード', icon: LayoutDashboard },
  { to: '/companies', label: '企業一覧', icon: Building },
  { to: '/company-admins', label: '企業管理者', icon: UserCog },
  { to: '/contracts', label: '契約管理', icon: FileText },
  { to: '/assessments', label: 'アセスメント', icon: ClipboardList },
  { to: '/surveys', label: 'サーベイ', icon: Vote }, // Added back
  { to: '/system-admins', label: 'システム管理者管理', icon: ShieldCheck },
  { to: '/settings', label: '設定', icon: Settings },
];


interface SidebarProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

function Sidebar({ onLogout, isAuthenticated }: SidebarProps) {
  const location = useLocation();

  // This function is no longer used, all logic is incorporated directly in the render function
  // commented it to satisfy the TS error about unused function
  /*
  const isNavItemActive = (itemPath: string, currentPath: string): boolean => {
    if (itemPath === '/' && currentPath === '/') return true;
    if (itemPath !== '/' && currentPath.startsWith(itemPath)) {
      if (itemPath === '/') return currentPath === '/';
      return currentPath.startsWith(itemPath);
    }
    return false;
  };
  */
  

  return (
    <aside className={cn(
      "bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col",
      "w-60"
    )}>
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
        <span className="text-xl font-semibold">EduAdmin</span>
      </div>
      <nav className="flex-grow mt-4 space-y-1 px-2">
        {navItems.map((item) => {
          // More robust active check:
          // An item is active if its path is a prefix of the current location's path.
          // For the root path, it must be an exact match.
          const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));


          return (
            <TooltipProvider key={item.to} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>
      <div className="p-2 border-t border-gray-700 space-y-1">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center justify-start text-sm font-medium",
                    "px-3 py-2.5 rounded-md",
                    "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                  onClick={onLogout}
                >
                  <LogOut size={20} className="mr-3" />
                  <span>ログアウト</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full flex items-center justify-start text-sm font-medium",
                    "px-3 py-2.5 rounded-md",
                    "text-gray-300 hover:bg-gray-700 hover:text-white"
                  )}
                >
                  <Link to="/login">
                    <LogIn size={20} className="mr-3" />
                    <span>ログイン</span>
                  </Link>
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
              {isAuthenticated ? "ログアウトする" : "ログインページへ"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/'); 
  };
  
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsAuthenticated(true);
    }
  }, []);


  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} isAuthenticated={isAuthenticated} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-0"> {/* Ensure no padding here if pages manage their own */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            
            <Route path="/system-admins" element={<SystemAdminManagement />} />
            <Route path="/system-admins/add" element={<AddSystemAdmin />} />
            <Route path="/system-admins/detail/:adminId" element={<SystemAdminDetail />} />
            <Route path="/system-admins/edit/:adminId" element={<EditSystemAdmin />} />
            
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/add" element={<AddCompany />} />
            <Route path="/companies/update/:companyId" element={<UpdateCompany />} />
            
            <Route path="/company-admins" element={<CompanyAdmins />} />
            <Route path="/company-admins/add" element={<AddCompanyAdmin />} />
            <Route path="/company-admins/detail/:adminId" element={<CompanyAdminDetail />} />
            
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/contracts/detail/:contractId" element={<ContractDetail />} />
            
            <Route path="/assessments" element={<AssessmentList />} />
            <Route path="/assessments/detail/:assessmentId" element={<AssessmentDetail />} />
            <Route path="/assessments/questions/:questionVersionId" element={<AssessmentQuestionDetail />} />
            
            <Route path="/surveys" element={<SurveyList />} /> {/* Added */}
            <Route path="/surveys/detail/:surveyId" element={<SurveyDetail />} /> {/* Added */}
            <Route path="/surveys/questions/:questionVersionId" element={<SurveyQuestionDetail />} /> {/* Added */}
            
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<Profile />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
