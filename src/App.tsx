import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  FileText,
  Settings,
  LogOut,
  UserCog,
  ClipboardList,
  ShieldCheck,
  LogIn,
  ChevronDown,
  ChevronRight,
  Layers,
  ListChecks,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
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
import Surveys from './pages/Surveys'; // Existing Survey Instance List
import SurveyDetail from './pages/SurveyDetail';
import SurveyVersionList from './pages/SurveyVersionList'; 
import SurveyQuestionListPage from './pages/SurveyQuestionListPage';
import Assessments from './pages/Assessments';
import AddAssessment from './pages/AddAssessment';
import AssessmentDetail from './pages/AssessmentDetail';
import EditAssessment from './pages/EditAssessment';
import AddAssessmentQuestion from './pages/AddAssessmentQuestion';
import EditAssessmentQuestion from './pages/EditAssessmentQuestion';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import CompanyAdmins from './pages/CompanyAdmins';
import AddCompanyAdmin from './pages/AddCompanyAdmin';
import CompanyAdminDetail from './pages/CompanyAdminDetail';
import Profile from './pages/Profile';
import AssessmentVersionList from './pages/AssessmentVersionList';
import AssessmentQuestionListPage from './pages/AssessmentQuestionListPage';

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
  {
    to: '/surveys', 
    label: 'サーベイ',
    icon: FileText,
    children: [
      { to: '/surveys', label: 'サーベイ一覧', icon: FileText }, 
      { to: '/surveys/versions', label: 'バージョン一覧', icon: Layers }, 
      { to: '/surveys/questions', label: '設問一覧', icon: ListChecks }, 
    ],
  },
  {
    to: '/assessments', 
    label: 'アセスメント',
    icon: ClipboardList,
    children: [
      { to: '/assessments', label: 'アセスメント一覧', icon: ClipboardList },
      { to: '/assessments/versions', label: 'バージョン一覧', icon: Layers },
      { to: '/assessments/questions', label: '設問一覧', icon: ListChecks },
    ],
  },
  { to: '/system-admins', label: 'システム管理者管理', icon: ShieldCheck },
  { to: '/settings', label: '設定', icon: Settings },
];

const RedirectToDefaultAssessmentQuestionList = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/assessments/ASS-001/versions/V1/questions', { replace: true });
  }, [navigate]);
  return null; 
};

const RedirectToDefaultSurveyQuestionList = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/surveys/SDEF-001/versions/SV1-SDEF-001/questions', { replace: true });
  }, [navigate]);
  return null;
};

interface SidebarProps {
  onLogout: () => void;
  isAuthenticated: boolean;
}

function Sidebar({ onLogout, isAuthenticated }: SidebarProps) {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isNavItemActive = (itemPath: string, currentPath: string): boolean => {
    if (itemPath === '/' && currentPath === '/') return true;
    if (itemPath !== '/' && currentPath.startsWith(itemPath)) return true;
    return false;
  };
  
  useEffect(() => {
    const newOpenState: Record<string, boolean> = {};
    let needsUpdate = false;
    navItems.forEach(item => {
      if (item.children && !(item.label === 'サーベイ' || item.label === 'アセスメント')) { // Only for collapsible items
        const isParentActive = isNavItemActive(item.to, location.pathname);
        const isAnyChildActive = item.children.some(child => isNavItemActive(child.to, location.pathname));
        
        if ((isParentActive || isAnyChildActive) && !openSubmenus[item.to]) {
          newOpenState[item.to] = true;
          needsUpdate = true;
        } else if (!(isParentActive || isAnyChildActive) && openSubmenus[item.to]) {
          newOpenState[item.to] = false;
          needsUpdate = true;
        } else {
          newOpenState[item.to] = openSubmenus[item.to] || false;
        }
      }
    });
    if (needsUpdate) {
      setOpenSubmenus(newOpenState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);


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
          const isNonCollapsibleWithChildren = (item.label === 'サーベイ' || item.label === 'アセスメント') && item.children;

          if (isNonCollapsibleWithChildren) {
            return (
              <div key={item.label} className="w-full">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.to}
                        className={cn(
                          "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full",
                          isNavItemActive(item.to, location.pathname)
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
                <div className="pl-4 space-y-1 py-1">
                  {item.children!.map((child) => (
                    <TooltipProvider key={child.to + child.label} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={child.to}
                            className={cn(
                              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
                              isNavItemActive(child.to, location.pathname)
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:bg-gray-600 hover:text-white"
                            )}
                          >
                            <child.icon size={18} className="mr-2.5" />
                            <span>{child.label}</span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                          {child.label}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            );
          } else if (item.children) { // Other items with children remain collapsible
            return (
              <Collapsible
                key={item.label}
                open={openSubmenus[item.to] || false}
                onOpenChange={() => toggleSubmenu(item.to)}
                className="w-full"
              >
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                            isNavItemActive(item.to, location.pathname)
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          )}
                        >
                          <div className="flex items-center">
                            <item.icon size={20} className="mr-3" />
                            <span>{item.label}</span>
                          </div>
                          {openSubmenus[item.to] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </CollapsibleTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <CollapsibleContent className="pl-4 space-y-1 py-1">
                  {item.children.map((child) => (
                    <TooltipProvider key={child.to + child.label} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={child.to}
                            className={cn(
                              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors w-full",
                              isNavItemActive(child.to, location.pathname)
                                ? "bg-gray-700 text-white"
                                : "text-gray-400 hover:bg-gray-600 hover:text-white"
                            )}
                          >
                            <child.icon size={18} className="mr-2.5" />
                            <span>{child.label}</span>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white border-gray-700">
                          {child.label}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          } else { // Simple link (no children)
            return (
              <TooltipProvider key={item.to} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                        isNavItemActive(item.to, location.pathname)
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
          }
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} isAuthenticated={isAuthenticated} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-0">
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
            
            {/* Survey Routes */}
            <Route path="/surveys" element={<Surveys />} /> 
            <Route path="/surveys/detail/:surveyId" element={<SurveyDetail />} />
            <Route path="/surveys/versions" element={<SurveyVersionList />} />
            <Route path="/surveys/questions" element={<RedirectToDefaultSurveyQuestionList />} />
            <Route path="/surveys/:surveyDefId/versions/:versionId/questions" element={<SurveyQuestionListPage />} />

            {/* Assessment Routes */}
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/assessments/add" element={<AddAssessment />} />
            <Route path="/assessments/detail/:assessmentId" element={<AssessmentDetail />} />
            <Route path="/assessments/edit/:assessmentId" element={<EditAssessment />} />
            <Route path="/assessments/versions" element={<AssessmentVersionList />} />
            <Route path="/assessments/questions" element={<RedirectToDefaultAssessmentQuestionList />} />
            <Route path="/assessments/:assessmentId/versions/:versionId/questions" element={<AssessmentQuestionListPage />} />
            <Route path="/assessments/:assessmentId/versions/:versionId/questions/add" element={<AddAssessmentQuestion />} />
            <Route path="/assessments/:assessmentId/versions/:versionId/questions/edit/:questionId" element={<EditAssessmentQuestion />} />
            
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
